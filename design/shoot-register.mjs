import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
const OUT = path.resolve(process.env.SP, 'reg')
await mkdir(OUT, { recursive: true })
const url = pathToFileURL(path.resolve('design/directions/register.html')).href
const b = await chromium.launch(chromiumLaunchOptions())
for (const [tag, vp, touch] of [
  ['desk', { width: 1440, height: 900 }, false],
  ['phone', { width: 390, height: 844 }, true],
]) {
  const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 2, hasTouch: touch, isMobile: touch })
  const p = await ctx.newPage()
  const errs = []
  p.on('pageerror', e => errs.push(e.message))
  p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()) })
  await p.goto(url, { waitUntil: 'networkidle' })
  await p.waitForTimeout(2000)
  await p.screenshot({ path: path.join(OUT, `${tag}-00-fold.png`) })
  const h = await p.evaluate(() => document.documentElement.scrollHeight)
  const ow = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth)
  console.log(tag, 'h=' + h, 'h-overflow=' + ow, 'errors=' + (errs.length ? errs.join(' | ') : 'none'))
  for (const f of [0.2, 0.34, 0.5, 0.66, 0.84]) {
    await p.evaluate(y => window.scrollTo(0, y), Math.round(h * f))
    await p.waitForTimeout(800)
    await p.screenshot({ path: path.join(OUT, `${tag}-s${Math.round(f * 100)}.png`) })
  }
  if (!touch) {
    // exercise the set piece
    await p.evaluate(() => document.getElementById('register').scrollIntoView())
    await p.waitForTimeout(700)
    await p.click('[data-sort="date"]')
    await p.waitForTimeout(320)
    await p.screenshot({ path: path.join(OUT, 'desk-flip-mid.png') })
    await p.waitForTimeout(900)
    await p.screenshot({ path: path.join(OUT, 'desk-flip-done.png') })
    await p.hover('[data-id="medrag"]')
    await p.waitForTimeout(700)
    await p.screenshot({ path: path.join(OUT, 'desk-noshot.png') })
  }
  await ctx.close()
}
await b.close()
console.log('OUT', OUT)
