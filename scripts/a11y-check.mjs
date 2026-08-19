/**
 * Phase 7 hardening check — keyboard, screen reader, contrast, plain-mode parity.
 *
 * This is the phase where the site stops being judged on what it does and starts
 * being judged on who can use it. None of that is visible in a screenshot, and
 * all of it is mechanically checkable, which is the only reason it gets checked
 * at all — a manual accessibility pass is a thing you do once and never repeat.
 *
 *   node scripts/a11y-check.mjs --url http://localhost:4400
 *
 * Exits non-zero on any failure.
 */

import { chromium } from 'playwright'
import { chromiumLaunchOptions } from './browser.mjs'

const args = process.argv.slice(2)
const urlFlag = args.indexOf('--url')
const B = urlFlag !== -1 && args[urlFlag + 1] ? args[urlFlag + 1] : 'http://localhost:4400'

const b = await chromium.launch(chromiumLaunchOptions())
let fails = 0
const ok = (n, c, extra = '') => {
  console.log(`${c ? '✓' : '✗'} ${n}${extra ? '  ' + extra : ''}`)
  if (!c) fails += 1
}

const VIEWPORTS = [
  { name: '390', width: 390, height: 844, touch: true, dsf: 3 },
  { name: '800', width: 800, height: 1000, touch: true, dsf: 2 },
  { name: '1440', width: 1440, height: 900, touch: false, dsf: 1 },
]

async function open(vp, path = '/') {
  const p = await (await b.newContext({
    viewport: { width: vp.width, height: vp.height },
    hasTouch: vp.touch,
    isMobile: vp.touch,
    deviceScaleFactor: vp.dsf,
  })).newPage()
  p.on('pageerror', (e) => { console.log('  PAGEERROR', e.message); fails += 1 })
  await p.goto(B + path, { waitUntil: 'load' })
  await p.waitForTimeout(2200)
  await p.keyboard.press('Escape')
  await p.waitForTimeout(3800)
  return p
}

/** Contrast maths, straight from WCAG 2.1. */
const CONTRAST_FN = `
function parseRgb(value) {
  const m = /rgba?\\(([^)]+)\\)/.exec(value)
  if (!m) return null
  const parts = m[1].split(',').map((n) => parseFloat(n))
  return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 }
}
function channel(c) {
  const s = c / 255
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}
function luminance(c) {
  return 0.2126 * channel(c.r) + 0.7152 * channel(c.g) + 0.0722 * channel(c.b)
}
function over(fg, bg) {
  const a = fg.a
  return { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a), a: 1 }
}
/**
 * Walks up for the first ancestor that actually paints. Most text here sits over
 * a WebGL canvas or a translucent glass panel, so the computed background of the
 * element itself is almost always transparent and tells you nothing.
 */
function effectiveBackground(el) {
  let node = el
  let result = { r: 1, g: 4, b: 9, a: 1 }
  const stack = []
  while (node && node !== document.documentElement) {
    const bg = parseRgb(getComputedStyle(node).backgroundColor)
    if (bg && bg.a > 0) stack.push(bg)
    if (bg && bg.a >= 0.999) { result = bg; break }
    node = node.parentElement
  }
  for (let i = stack.length - 1; i >= 0; i -= 1) result = over(stack[i], result)
  return result
}
`

// ---------------------------------------------------------------- 7.1 keyboard
for (const vp of VIEWPORTS) {
  const p = await open(vp)


  // Real tab traversal has to be driven by the keyboard API, not from page JS.
  const order = []
  for (let i = 0; i < 40; i += 1) {
    await p.keyboard.press('Tab')
    const info = await p.evaluate(() => {
      const el = document.activeElement
      if (!el || el === document.body) return null
      const style = getComputedStyle(el)
      const rect = el.getBoundingClientRect()
      /*
       * Accessible name, resolved the way a screen reader would.
       *
       * The first version of this read `aria-label || textContent`, which
       * reports every `<input>` in the contact form as unnamed — inputs have no
       * text content and are named by an associated `<label>`. Measuring the
       * wrong thing and calling it a defect is worse than not measuring.
       */
      const labelled = el.getAttribute('aria-labelledby')
      const byId = labelled
        ? (document.getElementById(labelled)?.textContent || '')
        : ''
      const forLabel = el.id
        ? (document.querySelector(`label[for="${el.id}"]`)?.textContent || '')
        : ''
      const wrapping = el.closest('label')?.textContent || ''
      return {
        tag: el.tagName.toLowerCase(),
        name: (
          el.getAttribute('aria-label')
          || byId
          || forLabel
          || wrapping
          || el.getAttribute('placeholder')
          || el.textContent
          || ''
        ).trim().slice(0, 44),
        visible: rect.width > 0 && rect.height > 0,
        focusRing: style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0,
        boxShadow: style.boxShadow !== 'none',
      }
    })
    if (info) order.push(info)
  }

  ok(`7.1 @${vp.name} keyboard reaches interactive elements`, order.length >= 4, `${order.length} stops`)
  const invisible = order.filter((o) => !o.visible)
  ok(`7.1 @${vp.name} no focus lands on a zero-size element`, invisible.length === 0,
    invisible.map((o) => o.tag).join(',') || '')
  const unnamed = order.filter((o) => o.name.length === 0)
  ok(`7.1 @${vp.name} every focus stop has an accessible name`, unnamed.length === 0,
    unnamed.map((o) => o.tag).join(',') || '')
  const noRing = order.filter((o) => !o.focusRing && !o.boxShadow)
  ok(`7.1 @${vp.name} every focus stop shows a focus indicator`, noRing.length === 0,
    noRing.map((o) => `${o.tag}:${o.name}`).slice(0, 4).join(' | ') || '')

  await p.close()
}

// ---------------------------------------------------- 7.2 screen-reader basics
{
  const p = await open(VIEWPORTS[2])
  const audit = await p.evaluate(() => {
    const problems = { unnamedControls: [], imagesWithoutAlt: [], headingSkips: [], dialogsUnlabelled: [] }

    document.querySelectorAll('button, a[href], [role="button"]').forEach((el) => {
      const name = (el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent || '').trim()
      const rect = el.getBoundingClientRect()
      if (!name && rect.width > 0) problems.unnamedControls.push(el.className || el.tagName)
    })

    document.querySelectorAll('img').forEach((img) => {
      if (!img.hasAttribute('alt')) problems.imagesWithoutAlt.push(img.currentSrc || img.src)
    })

    const levels = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
      .filter((h) => h.getBoundingClientRect().width > 0)
      .map((h) => Number(h.tagName[1]))
    for (let i = 1; i < levels.length; i += 1) {
      if (levels[i] - levels[i - 1] > 1) problems.headingSkips.push(`h${levels[i - 1]}->h${levels[i]}`)
    }

    document.querySelectorAll('[role="dialog"]').forEach((d) => {
      const labelled = d.getAttribute('aria-label') || d.getAttribute('aria-labelledby')
      if (!labelled || d.getAttribute('aria-modal') !== 'true') {
        problems.dialogsUnlabelled.push(d.className || 'dialog')
      }
    })
    return problems
  })

  ok('7.2 every visible control has an accessible name', audit.unnamedControls.length === 0,
    audit.unnamedControls.slice(0, 4).join(' | '))
  ok('7.2 every image declares alt', audit.imagesWithoutAlt.length === 0,
    audit.imagesWithoutAlt.slice(0, 3).join(' | '))
  ok('7.2 heading levels never skip', audit.headingSkips.length === 0, audit.headingSkips.join(', '))

  // Open a project overlay and check the dialog contract + focus behaviour.
  await p.locator('.project-index__toggle').click()
  await p.waitForTimeout(600)
  await p.locator('.project-index__item').first().click()
  await p.waitForTimeout(1600)

  const dialog = await p.evaluate(() => {
    const d = document.querySelector('[role="dialog"]')
    if (!d) return null
    return {
      modal: d.getAttribute('aria-modal') === 'true',
      labelled: Boolean(d.getAttribute('aria-label') || d.getAttribute('aria-labelledby')),
      containsFocus: d.contains(document.activeElement),
    }
  })
  ok('7.2 project overlay is a labelled modal dialog', Boolean(dialog?.modal && dialog?.labelled))
  ok('7.2 focus moves into the overlay on open', dialog?.containsFocus === true)

  // Focus must stay inside while it is open.
  let escaped = false
  for (let i = 0; i < 25; i += 1) {
    await p.keyboard.press('Tab')
    const inside = await p.evaluate(() =>
      document.querySelector('[role="dialog"]')?.contains(document.activeElement))
    if (inside === false) { escaped = true; break }
  }
  ok('7.2 focus is trapped inside the overlay', !escaped)

  await p.keyboard.press('Escape')
  await p.waitForTimeout(900)
  const restored = await p.evaluate(() => {
    const el = document.activeElement
    return Boolean(el && el !== document.body && el.getBoundingClientRect().width > 0)
  })
  ok('7.2 focus is restored to the page on close', restored)
  await p.close()
}

// ------------------------------------------------------------- 7.3 contrast
for (const vp of [VIEWPORTS[0], VIEWPORTS[2]]) {
  const p = await open(vp)
  const low = await p.evaluate(new Function(`
    ${CONTRAST_FN}
    const results = []
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    const seen = new Set()
    let node
    while ((node = walker.nextNode())) {
      const text = node.textContent.trim()
      if (!text) continue
      const el = node.parentElement
      if (!el || seen.has(el)) continue
      seen.add(el)
      const rect = el.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) continue
      if (rect.bottom < 0 || rect.top > window.innerHeight) continue
      const style = getComputedStyle(el)
      if (style.visibility === 'hidden' || Number(style.opacity) < 0.15) continue
      const fg = parseRgb(style.color)
      if (!fg) continue
      const bg = effectiveBackground(el)
      const composited = over(fg, bg)
      const l1 = luminance(composited)
      const l2 = luminance(bg)
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
      const px = parseFloat(style.fontSize)
      const bold = Number(style.fontWeight) >= 700
      const large = px >= 24 || (px >= 18.66 && bold)
      const required = large ? 3 : 4.5
      if (ratio < required) {
        results.push({
          text: text.slice(0, 34),
          cls: (el.className || el.tagName).toString().slice(0, 40),
          ratio: Math.round(ratio * 100) / 100,
          required,
          px: Math.round(px * 10) / 10,
        })
      }
    }
    return results
  `))

  ok(`7.3 @${vp.name} all visible text meets WCAG AA`, low.length === 0,
    low.slice(0, 6).map((r) => `${r.cls}@${r.px}px ${r.ratio}:1<${r.required}`).join(' | '))
  await p.close()
}

// -------------------------------------------------- 7.6 plain-mode parity
{
  const full = await open(VIEWPORTS[2])
  // The rail is a collapsed toggle until opened, so reading it cold returns an
  // empty list and the parity check passes without checking anything.
  await full.locator('.project-index__toggle').click()
  await full.waitForTimeout(700)
  const ids = await full.evaluate(() => {
    const store = document.querySelectorAll('.project-index__item')
    // The name span specifically — the item also carries the tagline and the
    // node kind, and matching those against plain-mode copy proves nothing.
    return [...store]
      .map((el) => (el.querySelector('.project-index__item-name')?.textContent || '').trim())
      .filter(Boolean)
  })
  if (ids.length === 0) { console.log('✗ 7.6 could not read the project rail'); fails += 1 }
  await full.close()

  const plain = await (await b.newContext({ viewport: { width: 1200, height: 2000 } })).newPage()
  await plain.goto(`${B}/?plain=1`, { waitUntil: 'load' })
  await plain.waitForTimeout(2200)
  const body = await plain.evaluate(() => document.body.innerText)

  const missing = ids.filter((name) => !body.toLowerCase().includes(name.toLowerCase()))
  ok('7.6 every project in the rail also appears in plain mode', missing.length === 0,
    missing.join(', ') || `${ids.length} projects`)

  const sections = await plain.evaluate(() => ({
    services: document.querySelectorAll('.services-block').length,
    contact: document.querySelectorAll('.contact-panel').length,
    about: document.body.innerText.toLowerCase().includes("hi, i'm parth"),
    capabilities: document.body.innerText.toLowerCase().includes('capability'),
    training: document.body.innerText.toLowerCase().includes('training'),
    portrait: document.querySelectorAll('.plain-experience__portrait').length,
  }))
  ok('7.6 plain mode carries services, contact, about, capabilities and training',
    sections.services > 0 && sections.contact > 0 && sections.about
    && sections.capabilities && sections.training && sections.portrait > 0,
    JSON.stringify(sections))
  await plain.close()
}

console.log(fails === 0 ? '\nALL PHASE 7 A11Y CHECKS PASSED' : `\n${fails} FAILURE(S)`)
await b.close()
process.exit(fails ? 1 : 0)
