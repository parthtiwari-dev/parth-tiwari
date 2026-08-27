/**
 * Crops browser chrome out of the two hand-taken captures.
 *
 * beatmind-stems.png and beatmind-arrangement.png were shot by hand (the audio
 * will not render under automation) and both carry the whole Chrome window:
 * the tab strip, the address bar with a real project UUID, and the profile
 * avatar. That is a leak, and it reads as somebody's desktop rather than a
 * product. Everything from capture-demos.mjs is already clean.
 *
 * The seam is measured, not detected: the browser was in dark mode, so a
 * light-vs-dark scan finds nothing. Same window, same shot, same numbers.
 */
import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const media = path.resolve('public/media')
const CHROME_H = 108   // tab strip + address bar
const SCROLLBAR = 16   // right-hand gutter

const JOBS = [
  { file: 'beatmind-stems.png',       out: 'beatmind-stems-clean.png' },
  { file: 'beatmind-arrangement.png', out: 'beatmind-arrangement-clean.png' },
]

const b = await chromium.launch(chromiumLaunchOptions())
for (const job of JOBS) {
  const src = 'data:image/png;base64,' + readFileSync(path.join(media, job.file)).toString('base64')
  const ctx = await b.newContext({ viewport: { width: 1200, height: 800 } })
  const p = await ctx.newPage()
  await p.setContent(`<style>html,body{margin:0;background:#000}img{display:block}</style><img src="${src}">`)
  const { w, h } = await p.waitForFunction(() => {
    const i = document.querySelector('img')
    return (i && i.complete && i.naturalWidth > 0) ? { w: i.naturalWidth, h: i.naturalHeight } : null
  }).then((x) => x.jsonValue())
  await p.setViewportSize({ width: w, height: Math.min(h, 2000) })

  /* page.screenshot, not locator.screenshot: the element form silently ignores
     `clip` and hands back the whole image, which is how the first run "cropped"
     nothing and reported success. */
  await p.screenshot({
    path: path.join(media, job.out),
    clip: { x: 0, y: CHROME_H, width: w - SCROLLBAR, height: h - CHROME_H },
  })
  console.log(`${job.file} ${w}x${h} -> ${job.out} ${w - SCROLLBAR}x${h - CHROME_H}`)
  await ctx.close()
}
await b.close()
