/** Real touch only. CDP Input.dispatchTouchEvent. No window.scrollTo anywhere. */
import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
import { mkdirSync } from 'node:fs'

const SITE = 'https://parth-tiwari-1.vercel.app'
const OUT = '/tmp/claude-0/-home-user-parth-tiwari/eb439659-3fdc-5ea3-aef2-c36947f045f3/scratchpad/drive/touch'
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch(chromiumLaunchOptions({ headless: true }))
const context = await browser.newContext({
  viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true,
})
const page = await context.newPage()
const cdp = await context.newCDPSession(page)
const errors = []
page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)))

let n = 0
const shoot = async (label) => {
  const y = await page.evaluate(() => Math.round(window.scrollY))
  await page.screenshot({ path: `${OUT}/${String(++n).padStart(2,'0')}-${label}-y${y}.png` })
  console.log(`  [${String(n).padStart(2,'0')}] ${label.padEnd(28)} scrollY=${y}`)
  return y
}

async function swipe(x1, y1, x2, y2, steps = 14, holdMs = 0) {
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x1, y: y1, id: 1 }] })
  if (holdMs) await page.waitForTimeout(holdMs)
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: x1 + (x2 - x1) * t, y: y1 + (y2 - y1) * t, id: 1 }],
    })
    await page.waitForTimeout(12)
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
}

async function tap(x, y) {
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 1 }] })
  await page.waitForTimeout(50)
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await page.waitForTimeout(600)
}

await page.goto(SITE, { waitUntil: 'load' })
await page.waitForTimeout(3500)
await shoot('arrived')

console.log('\n--- VERTICAL SWIPE (can the page scroll at all?) ---')
for (let i = 0; i < 6; i++) {
  const before = await page.evaluate(() => window.scrollY)
  await swipe(195, 640, 195, 180, 16)
  await page.waitForTimeout(900)
  const after = await shoot(`swipe-up-${i + 1}`)
  if (after === Math.round(before)) console.log('     !! NO MOVEMENT from this swipe')
}

console.log('\n--- HORIZONTAL DRAG (orbit) ---')
await swipe(195, 400, 340, 400, 16)
await page.waitForTimeout(1000)
await shoot('drag-right-orbit')
await swipe(195, 400, 60, 400, 16)
await page.waitForTimeout(1000)
await shoot('drag-left-orbit')

console.log('\n--- WHAT IS TAPPABLE HERE ---')
const targets = await page.evaluate(() => {
  const out = []
  document.querySelectorAll('a,button,[role="button"],canvas').forEach((el) => {
    const r = el.getBoundingClientRect()
    if (r.width < 1 || r.bottom < 0 || r.top > innerHeight) return
    out.push({
      tag: el.tagName.toLowerCase(),
      label: (el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g,' ').trim().slice(0, 40),
      x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2),
      w: Math.round(r.width), h: Math.round(r.height),
    })
  })
  return out
})
targets.forEach((t) => {
  const size = `${t.w}x${t.h}`
  console.log('  ' + t.tag.padEnd(7) + size.padEnd(10) + ` @${t.x},${t.y}  "${t.label}"`)
})

console.log('\nerrors:', errors.length ? errors.join(' | ') : '(none)')
await browser.close()
