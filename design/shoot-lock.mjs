import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
const OUT = path.resolve(process.env.SP, 'lock')
await mkdir(OUT, { recursive: true })
const url = pathToFileURL(path.resolve('design/directions/lock.html')).href
const b = await chromium.launch(chromiumLaunchOptions())
for (const [tag, vp, touch] of [['desk',{width:1440,height:900},false],['phone',{width:390,height:844},true]]) {
  const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 2, hasTouch: touch, isMobile: touch })
  const p = await ctx.newPage()
  const errs = []
  p.on('pageerror', e => errs.push(e.message))
  p.on('console', m => { if (m.type()==='error') errs.push('console: '+m.text()) })
  await p.goto(url, { waitUntil:'load' }); await p.waitForTimeout(3000)
  const h = await p.evaluate(() => document.documentElement.scrollHeight)
  const ow = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)
  console.log(tag, 'h='+h, 'overflow='+ow, 'errors='+(errs.length?errs.join(' | '):'none'))
  await p.screenshot({ path: path.join(OUT, `${tag}-00.png`) })
  for (const f of [0.14,0.28,0.42,0.56,0.72,0.88]) {
    await p.evaluate(y => scrollTo(0,y), Math.round(h*f)); await p.waitForTimeout(900)
    await p.screenshot({ path: path.join(OUT, `${tag}-s${Math.round(f*100)}.png`) })
  }
  if (!touch) {
    await p.evaluate(() => document.getElementById('demo').scrollIntoView({block:'center'}))
    await p.waitForTimeout(800)
    await p.click('.demo-row[data-open="denoise"]')
    await p.waitForTimeout(250); await p.screenshot({ path: path.join(OUT,'desk-flip-mid.png') })
    await p.waitForTimeout(1400); await p.screenshot({ path: path.join(OUT,'desk-flip-done.png') })
  }
  await ctx.close()
}
await b.close()
console.log('OUT', OUT)
