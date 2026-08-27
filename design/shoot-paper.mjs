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
  await p.goto(url, { waitUntil:'load' }); await p.waitForTimeout(2200)
  console.log(tag, 'errors=' + (errs.length?errs.join(' | '):'none'))
  await p.screenshot({ path: path.join(OUT, `${tag}-00-sheet.png`) })
  await p.hover('.entry[data-i="0"]'); await p.mouse.move(900, 620, {steps:12}); await p.waitForTimeout(1200)
  await p.screenshot({ path: path.join(OUT, `${tag}-01-bleed.png`) })
  await p.click('.entry[data-i="0"]'); await p.waitForTimeout(240)
  await p.screenshot({ path: path.join(OUT, `${tag}-02-tearing.png`) })
  await p.waitForTimeout(1200)
  await p.screenshot({ path: path.join(OUT, `${tag}-03-world.png`) })
  await p.evaluate(() => { const w = document.getElementById('world'); w.scrollTop = w.scrollHeight * 0.34 })
  await p.waitForTimeout(700)
  await p.screenshot({ path: path.join(OUT, `${tag}-04-scrolled.png`) })
  await p.click('#wBack'); await p.waitForTimeout(1000)
  await p.screenshot({ path: path.join(OUT, `${tag}-05-back.png`) })
  await ctx.close()
}
await b.close()
console.log('OUT', OUT)
