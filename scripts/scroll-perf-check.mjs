/** Measure the maintained landing under a deterministic, frame-paced scroll. */

import { chromium } from 'playwright'
import { chromiumLaunchOptions } from './browser.mjs'

const args = process.argv.slice(2)
const argOf = (flag, fallback) => {
  const index = args.indexOf(flag)
  return index !== -1 && args[index + 1] ? args[index + 1] : fallback
}

const base = argOf('--url', 'http://127.0.0.1:4321').replace(/\/$/, '')
const withoutSheetFilter = args.includes('--without-sheet-filter')
const viewports = [
  { name: '390', width: 390, height: 844, touch: true },
  { name: '800', width: 800, height: 1000, touch: true },
  { name: '1440', width: 1440, height: 900, touch: false },
]

const percentile = (values, share) => {
  const ordered = [...values].sort((left, right) => left - right)
  return ordered[Math.min(ordered.length - 1, Math.floor(ordered.length * share))] ?? 0
}

const browser = await chromium.launch(chromiumLaunchOptions())

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    hasTouch: viewport.touch,
    isMobile: viewport.touch,
  })
  const page = await context.newPage()
  await page.goto(`${base}/`, { waitUntil: 'load' })
  if (withoutSheetFilter) {
    await page.addStyleTag({ content: '.scroll-sheet { filter: none !important; }' })
  }
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(1750)

  const result = await page.evaluate(async () => {
    const deltas = []
    const longTasks = []
    const longFrames = []
    const observers = []

    try {
      const taskObserver = new PerformanceObserver((list) => {
        longTasks.push(...list.getEntries().map((entry) => entry.duration))
      })
      taskObserver.observe({ type: 'longtask', buffered: true })
      observers.push(taskObserver)
    } catch {}

    try {
      const frameObserver = new PerformanceObserver((list) => {
        longFrames.push(...list.getEntries().map((entry) => entry.duration))
      })
      frameObserver.observe({ type: 'long-animation-frame', buffered: true })
      observers.push(frameObserver)
    } catch {}

    const maxScroll = document.documentElement.scrollHeight - innerHeight
    const duration = 4200
    let previous

    await new Promise((resolve) => {
      const start = performance.now()
      const tick = (now) => {
        if (previous !== undefined) deltas.push(now - previous)
        previous = now
        const progress = Math.min(1, (now - start) / duration)
        const travel = progress <= .5 ? progress * 2 : (1 - progress) * 2
        scrollTo(0, maxScroll * travel)
        if (progress < 1) requestAnimationFrame(tick)
        else resolve()
      }
      requestAnimationFrame(tick)
    })

    observers.forEach((observer) => observer.disconnect())
    return { deltas, longTasks, longFrames, pageHeight: document.documentElement.scrollHeight }
  })

  const p95 = percentile(result.deltas, .95)
  const over20 = result.deltas.filter((delta) => delta > 20).length
  const over33 = result.deltas.filter((delta) => delta > 33.4).length
  const over50 = result.deltas.filter((delta) => delta > 50).length
  const max = Math.max(...result.deltas)
  console.log(
    `SCROLL ${viewport.name}: height=${result.pageHeight}px frames=${result.deltas.length}`
      + ` p95=${p95.toFixed(1)}ms max=${max.toFixed(1)}ms`
      + ` >20ms=${over20} >33ms=${over33} >50ms=${over50}`
      + ` longtasks=${result.longTasks.length} loaf=${result.longFrames.length}`,
  )
  await context.close()
}

await browser.close()
