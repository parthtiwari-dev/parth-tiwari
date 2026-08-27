import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
const OUT = path.resolve(process.env.SP, 'paper')
await mkdir(OUT, { recursive: true })
const url = pathToFileURL(path.resolve('design/directions/paper.html')).href
const b = await chromium.launch(chromiumLaunchOptions())
for (const [tag, vp, touch] of [['desk',{width:1440,height:900},false],['phone',{width:390,height:844},true]]) {
  const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 2, hasTouch: touch, isMobile: touch })
  const p = await ctx.newPage()
  const errs = []
  p.on('pageerror', e => errs.push(e.message))
  p.on('console', m => { if (m.type()==='error') errs.push('console: '+m.text()) })
  await p.goto(url, { waitUntil:'load' }); await p.waitForTimeout(2400)
  const h = await p.evaluate(() => document.documentElement.scrollHeight)
  const ow = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)
  console.log(tag, 'h='+h, 'overflow='+ow, 'errors='+(errs.length?errs.join(' | '):'none'))
  await p.screenshot({ path: path.join(OUT, `${tag}-00.png`) })
  for (const f of [0.12,0.26,0.40,0.55,0.70,0.86]) {
    await p.evaluate(y => scrollTo(0,y), Math.round(h*f)); await p.waitForTimeout(700)
    await p.screenshot({ path: path.join(OUT, `${tag}-s${Math.round(f*100)}.png`) })
  }
  if (!touch) {
    // instant, not smooth: reading a boundingBox mid-animation is how the last
    // run clicked empty paper and reported the page broken
    await p.evaluate(() => document.getElementById('idx').scrollIntoView({block:'center', behavior:'instant'}))
    await p.waitForTimeout(500)
    const box = await p.locator('.entry[data-i="0"]').boundingBox()
    await p.mouse.move(box.x + box.width*0.6, box.y + box.height/2, {steps:10})
    await p.waitForTimeout(1200)
    await p.screenshot({ path: path.join(OUT, 'desk-lit.png') })
    await p.mouse.click(box.x + box.width*0.6, box.y + box.height/2)
    await p.waitForTimeout(260); await p.screenshot({ path: path.join(OUT,'desk-tear.png') })
    await p.waitForTimeout(1300); await p.screenshot({ path: path.join(OUT,'desk-world.png') })
    await p.locator('#wBack').click({timeout:5000}); await p.waitForTimeout(900)
    await p.screenshot({ path: path.join(OUT,'desk-back.png') })
  }
  await ctx.close()
}
await b.close()
console.log('OUT', OUT)
