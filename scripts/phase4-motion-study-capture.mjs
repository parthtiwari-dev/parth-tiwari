/** Capture the three Phase 4 paper-transition studies from the non-production design artifact. */

import { createServer } from 'node:http'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'
import { chromiumLaunchOptions } from './browser.mjs'

const root = process.cwd()
const output = path.resolve('.shots/phase4-motion-studies')
const contentTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.jpg', 'image/jpeg'],
  ['.png', 'image/png'],
  ['.woff2', 'font/woff2'],
])
const studies = ['row', 'edge', 'sheet']
const viewports = [
  { name: 'phone-390', width: 390, height: 844, touch: true, scale: 2 },
  { name: 'tablet-800', width: 800, height: 1024, touch: true, scale: 1 },
  { name: 'desktop-1440', width: 1440, height: 900, touch: false, scale: 1 },
]

const server = createServer(async (request, response) => {
  try {
    const requested = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname)
    const resolved = path.resolve(root, `.${requested}`)
    if (!resolved.startsWith(root)) throw new Error('Path escapes the workspace root.')
    const bytes = await readFile(resolved)
    response.writeHead(200, { 'content-type': contentTypes.get(path.extname(resolved)) ?? 'application/octet-stream' })
    response.end(bytes)
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
    response.end('Not found')
  }
})

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const address = server.address()
const base = `http://127.0.0.1:${address.port}/design/directions/phase-4-paper-transition.html`
await mkdir(output, { recursive: true })

const browser = await chromium.launch(chromiumLaunchOptions())
let failures = 0
const metrics = []

const percentile = (values, share) => {
  const ordered = [...values].sort((left, right) => left - right)
  return ordered[Math.min(ordered.length - 1, Math.floor(ordered.length * share))] ?? 0
}

try {
  for (const viewport of viewports) {
    for (const study of studies) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: viewport.scale,
        hasTouch: viewport.touch,
        isMobile: viewport.touch,
      })
      const page = await context.newPage()
      const errors = []
      page.on('pageerror', (error) => errors.push(error.message))
      const response = await page.goto(`${base}?study=${study}&hold=1`, { waitUntil: 'load' })
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(80)

      const initial = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        study: document.body.dataset.study,
      }))
      await page.screenshot({ path: path.join(output, `${viewport.name}-${study}-default.png`) })
      if (viewport.touch) {
        await page.locator('[data-project-entry]').scrollIntoViewIfNeeded()
        await page.evaluate(() => document.querySelector('[data-project-entry]').scrollIntoView({ block: 'center' }))
        await page.waitForTimeout(80)
      }
      await page.evaluate(() => window.phase4Study.activatePreview())
      await page.waitForTimeout(210)
      await page.screenshot({ path: path.join(output, `${viewport.name}-${study}-preview.png`) })
      await page.evaluate(() => window.phase4Study.play())
      await page.waitForTimeout(240)
      await page.screenshot({ path: path.join(output, `${viewport.name}-${study}-tear-mid.png`) })
      await page.waitForTimeout(290)
      await page.screenshot({ path: path.join(output, `${viewport.name}-${study}-tear-final.png`) })

      const pass = response?.ok() && initial.overflow <= 1 && initial.study === study && errors.length === 0
      console.log(`${pass ? 'PASS' : 'FAIL'} ${viewport.name} ${study}: status=${response?.status() ?? 'none'} overflow=${initial.overflow}px errors=${errors.join(' | ') || 'none'}`)
      if (!pass) failures += 1
      await context.close()

      // Measure on a fresh page so screenshot encoding and retained paint state do not
      // distort the motion comparison. Discard one warm-up run, then combine two runs.
      const performanceContext = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: viewport.scale,
        hasTouch: viewport.touch,
        isMobile: viewport.touch,
      })
      const performancePage = await performanceContext.newPage()
      await performancePage.goto(`${base}?study=${study}&hold=1`, { waitUntil: 'load' })
      await performancePage.evaluate(() => document.fonts.ready)
      if (viewport.touch) {
        await performancePage.locator('[data-project-entry]').scrollIntoViewIfNeeded()
        await performancePage.evaluate(() => document.querySelector('[data-project-entry]').scrollIntoView({ block: 'center' }))
      }
      const performanceRuns = await performancePage.evaluate(async () => {
        const sample = async () => {
          window.phase4Study.reset()
          await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
          const deltas = []
          let previous
          window.phase4Study.play()
          await new Promise((resolve) => {
            const started = performance.now()
            const tick = (now) => {
              if (previous !== undefined) deltas.push(now - previous)
              previous = now
              if (now - started < 620) requestAnimationFrame(tick)
              else resolve()
            }
            requestAnimationFrame(tick)
          })
          return deltas
        }
        await sample()
        return [await sample(), await sample()]
      })
      const frameDeltas = performanceRuns.flat()
      const p95 = percentile(frameDeltas, .95)
      const max = Math.max(...frameDeltas)
      const over33 = frameDeltas.filter((delta) => delta > 33.4).length
      metrics.push({ viewport: viewport.name, study, runs: performanceRuns.length, frames: frameDeltas.length, p95, max, over33 })
      console.log(`PERF ${viewport.name} ${study}: frames=${frameDeltas.length} p95=${p95.toFixed(1)}ms max=${max.toFixed(1)}ms >33ms=${over33}`)
      await performanceContext.close()

      const reducedContext = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: viewport.scale,
        hasTouch: viewport.touch,
        isMobile: viewport.touch,
        reducedMotion: 'reduce',
      })
      const reducedPage = await reducedContext.newPage()
      await reducedPage.goto(`${base}?study=${study}&hold=1`, { waitUntil: 'load' })
      await reducedPage.evaluate(() => document.fonts.ready)
      await reducedPage.evaluate(() => {
        window.phase4Study.activatePreview()
        window.phase4Study.play()
      })
      await reducedPage.waitForTimeout(40)
      const reducedState = await reducedPage.evaluate(() => ({
        pieces: document.querySelectorAll('.tear-piece').length,
        preview: document.body.classList.contains('is-preview'),
      }))
      await reducedPage.screenshot({ path: path.join(output, `${viewport.name}-${study}-reduced.png`) })
      const reducedPass = reducedState.pieces === 0 && reducedState.preview
      console.log(`${reducedPass ? 'PASS' : 'FAIL'} ${viewport.name} ${study} reduced: pieces=${reducedState.pieces} preview=${reducedState.preview}`)
      if (!reducedPass) failures += 1
      await reducedContext.close()
    }
  }
} finally {
  await browser.close()
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
}

await writeFile(path.join(output, 'metrics.json'), `${JSON.stringify(metrics, null, 2)}\n`)
console.log(`Phase 4 motion-study screenshots: ${output}`)
process.exit(failures === 0 ? 0 : 1)
