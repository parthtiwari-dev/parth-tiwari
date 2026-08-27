/**
 * Measures WCAG AA contrast for every visible text node on a built page.
 *
 *   node design/contrast-check.mjs [path/to/page.html]
 *
 * Two things this got wrong before, both worth keeping written down because
 * both made the checker lie rather than the page fail:
 *
 *   1. `querySelector('.paper, .sheet, body')` returns the first match in
 *      DOCUMENT order, and <body> precedes .paper. So the "ground" resolved to
 *      the dark void behind the sheet and every line on a light page came back
 *      at ~1.1:1. Ask in priority order instead.
 *   2. Short-circuiting everything inside the sheet to the stock then reported
 *      the red button's own white-on-oxblood as white-on-paper. The walk has to
 *      run normally and only fall back to the stock when it reaches the sheet.
 *
 * Text sitting on a gradient is a range rather than a colour, so it is reported
 * as unmeasured instead of being guessed at.
 */
import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const target = process.argv[2] || 'design/directions/register.html'
const url = pathToFileURL(path.resolve(target)).href

const b = await chromium.launch(chromiumLaunchOptions())
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage()
await p.goto(url, { waitUntil: 'load' })
await p.waitForTimeout(2500)
await p.evaluate(() => document.querySelectorAll('[data-reveal],[data-r]').forEach(e => e.classList.add('seen')))
await p.waitForTimeout(400)

const out = await p.evaluate(() => {
  const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4) }
  const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
  const parse = s => (s.match(/[\d.]+/g) || []).slice(0, 3).map(Number)

  const groundEl = document.querySelector('.paper')
    || document.querySelector('.sheet')
    || document.body
  const gc = groundEl ? getComputedStyle(groundEl).backgroundColor : ''
  const ground = (gc && !/rgba\(0, 0, 0, 0\)|transparent/.test(gc)) ? parse(gc) : [255, 255, 255]

  const sheet = document.querySelector('#sheetWrap')
  const bgOf = el => {
    let n = el
    while (n) {
      const cs = getComputedStyle(n)
      const c = cs.backgroundColor
      if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c)) return parse(c)
      if (/gradient/.test(cs.backgroundImage)) return null
      if (n === sheet) return ground
      n = n.parentElement
    }
    return ground
  }

  const bad = [], skipped = []
  document.querySelectorAll('body *').forEach(el => {
    if (!el.childNodes.length) return
    const txt = [...el.childNodes]
      .filter(n => n.nodeType === 3 && n.textContent.trim())
      .map(n => n.textContent.trim()).join(' ')
    if (!txt) return
    const cs = getComputedStyle(el)
    if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) === 0) return
    const r = el.getBoundingClientRect()
    if (!r.width || !r.height) return

    const fg = parse(cs.color), bg = bgOf(el)
    if (!bg) { skipped.push(txt.slice(0, 44)); return }

    const l1 = L(fg), l2 = L(bg)
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
    const px = parseFloat(cs.fontSize)
    const wt = parseInt(cs.fontWeight, 10) || 400
    const large = px >= 24 || (px >= 18.66 && wt >= 700)
    const floor = large ? 3 : 4.5
    if (ratio < floor) {
      bad.push({ t: txt.slice(0, 44), ratio: +ratio.toFixed(2), floor,
                 px: +px.toFixed(1), cls: el.className.toString().slice(0, 30) })
    }
  })
  return { bad, skipped }
})

console.log(out.bad.length
  ? out.bad.map(x => `FAIL ${x.ratio}:1 (need ${x.floor}) ${x.px}px .${x.cls} — "${x.t}"`).join('\n')
  : 'contrast: all visible text passes WCAG AA')

if (out.skipped.length) {
  console.log(`\nnot measured, text sits on a gradient — check by eye (${out.skipped.length}):`)
  out.skipped.forEach(t => console.log('  ' + t))
}

await b.close()
