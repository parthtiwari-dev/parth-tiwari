/** Verify the shared world contract and the BeatMind Sound Foundry pilot. */

import { createServer } from 'node:http'
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { gzipSync } from 'node:zlib'
import { chromium } from 'playwright'
import { chromiumLaunchOptions } from './browser.mjs'

const root = process.cwd()
const dist = path.resolve('dist')
const output = path.resolve('.shots/phase5-beatmind-world')
const route = '/work/beatmind/world/'
const viewports = [
  { name: 'phone-390', width: 390, height: 844, touch: true, scale: 2 },
  { name: 'tablet-800', width: 800, height: 1024, touch: true, scale: 1 },
  { name: 'desktop-1440', width: 1440, height: 900, touch: false, scale: 1 },
]
const contentTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.jpg', 'image/jpeg'],
  ['.png', 'image/png'],
  ['.webp', 'image/webp'],
  ['.woff2', 'font/woff2'],
  ['.xml', 'application/xml; charset=utf-8'],
])

const failures = []
const assert = (condition, message) => {
  if (!condition) failures.push(message)
}

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname)
    const requested = pathname.endsWith('/') ? `${pathname}index.html` : pathname
    const resolved = path.resolve(dist, `.${requested}`)
    if (!resolved.startsWith(dist)) throw new Error('Path escapes dist.')
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
const base = `http://127.0.0.1:${address.port}`
await mkdir(output, { recursive: true })

const worldHtmlPath = path.join(dist, 'work/beatmind/world/index.html')
const worldHtml = await readFile(worldHtmlPath, 'utf8')
const homeHtml = await readFile(path.join(dist, 'index.html'), 'utf8')
const workHtml = await readFile(path.join(dist, 'work/index.html'), 'utf8')
const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8')
const sourceScript = await readFile(path.join(root, 'src/scripts/beatmind-world.ts'), 'utf8')
const artifactText = await readFile(path.join(root, 'src/data/worlds/beatmind-world-v1.json'), 'utf8')
const artifact = JSON.parse(artifactText)

assert(homeHtml.includes('href="/work/beatmind/world/"'), 'Home does not route BeatMind to its published world.')
assert(workHtml.includes('href="/work/beatmind/world/"'), '/work does not route BeatMind to its published world.')
assert(worldHtml.includes('href="/work/beatmind/"'), 'The BeatMind world does not hand off to the paper case study.')
assert(sitemap.includes('/work/beatmind/world/'), 'The sitemap omits the published BeatMind world.')
assert(!worldHtml.includes('<audio'), 'The withheld-audio world emits an audio element.')
assert(!sourceScript.includes('Math.random'), 'BeatMind drawing code contains Math.random().')
assert(artifact.trace?.available === false, 'The build artifact unexpectedly claims a publishable trace.')
assert(Object.values(artifact.envelopes).every((entry) => entry.rms.length === 256 && entry.peak.length === 256), 'An envelope does not contain 256 RMS and peak bins.')
assert(Object.keys(artifact.envelopes).join(',') === 'source,vocals,backing_vocals,drums,bass,other', 'The artifact signal set changed.')

const privatePatterns = [
  /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i,
  /[A-Z]:\\/,
  /AppData|signed(?:-|_)?url|storage(?:-|_)?key|raw prompt|raw error/i,
]
for (const pattern of privatePatterns) {
  assert(!pattern.test(worldHtml), `World HTML matches private pattern ${pattern}.`)
  assert(!pattern.test(artifactText), `Sanitized artifact matches private pattern ${pattern}.`)
}
const worldEmails = [...worldHtml.matchAll(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g)].map((match) => match[0])
assert(worldEmails.every((email) => email === 'parthti2003@gmail.com'), 'World metadata contains an unexpected email address.')
assert(!/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/.test(artifactText), 'Sanitized artifact contains an email address.')

const assetRefs = [...worldHtml.matchAll(/<(?:script|link)[^>]+(?:src|href)="([^"]+\.(?:js|css))"/g)].map((match) => match[1])
const scriptRefs = [...new Set(assetRefs.filter((reference) => reference.endsWith('.js')))]
const styleRefs = [...new Set(assetRefs.filter((reference) => reference.endsWith('.css')))]
const bytesFor = async (references) => {
  const assets = await Promise.all(references.map(async (reference) => readFile(path.join(dist, reference.replace(/^\//, '')))))
  return {
    raw: assets.reduce((total, bytes) => total + bytes.length, 0),
    gzip: assets.reduce((total, bytes) => total + gzipSync(bytes).length, 0),
  }
}
const scripts = await bytesFor(scriptRefs)
const styles = await bytesFor(styleRefs)
const imageBytes = (await stat(path.join(root, 'public/media/beatmind-precision-descent-machinery.webp'))).size
assert(scripts.gzip <= 30 * 1024, `World JavaScript is ${scripts.gzip} gzip bytes, above 30 kB.`)
assert(imageBytes <= 200 * 1024, `Decorative machinery is ${imageBytes} bytes, above 200 kB.`)

const browser = await chromium.launch(chromiumLaunchOptions())
const results = []

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: viewport.scale,
      hasTouch: viewport.touch,
      isMobile: viewport.touch,
      reducedMotion: 'no-preference',
    })
    const page = await context.newPage()
    const errors = []
    const runtimeRequests = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('request', (request) => {
      if (['fetch', 'xhr', 'media'].includes(request.resourceType())) runtimeRequests.push(`${request.resourceType()}:${request.url()}`)
    })
    const response = await page.goto(`${base}${route}`, { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    await page.evaluate(() => {
      window.__phase5LongTasks = []
      if (!('PerformanceObserver' in window)) return
      window.__phase5LongTaskObserver = new PerformanceObserver((list) => {
        window.__phase5LongTasks.push(...list.getEntries().map((entry) => entry.duration))
      })
      try { window.__phase5LongTaskObserver.observe({ entryTypes: ['longtask'] }) } catch {}
    })

    const initial = await page.evaluate(() => ({
      ready: document.querySelector('[data-world-root]')?.getAttribute('data-world-ready'),
      mode: document.querySelector('[data-world-root]')?.getAttribute('data-world-mode'),
      canvasHidden: document.querySelector('[data-world-canvas]')?.getAttribute('aria-hidden'),
      sceneCount: document.querySelectorAll('[data-world-scene]').length,
      h1Count: document.querySelectorAll('h1').length,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      staticAlt: document.querySelector('[data-world-static] img')?.getAttribute('alt') ?? '',
    }))

    const sceneStates = []
    const sceneLocators = page.locator('[data-world-scene]')
    for (let index = 0; index < await sceneLocators.count(); index += 1) {
      const scene = sceneLocators.nth(index)
      await scene.evaluate((element) => element.scrollIntoView({ block: 'center' }))
      await page.waitForTimeout(240)
      const state = await page.evaluate(() => ({
        active: document.querySelector('[data-world-scene].is-current')?.getAttribute('data-scene-index'),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      }))
      sceneStates.push(state)
      await page.screenshot({ path: path.join(output, `${viewport.name}-scene-${String(index + 1).padStart(2, '0')}.png`) })
    }
    await page.screenshot({ path: path.join(output, `${viewport.name}-final-frame.png`) })

    const measured = await page.evaluate(() => {
      const root = document.querySelector('[data-world-root]')
      const count = Number(root?.getAttribute('data-world-draw-count') ?? 0)
      const span = Number(root?.getAttribute('data-world-draw-span') ?? 0)
      const longTasks = window.__phase5LongTasks ?? []
      return {
        count,
        span,
        rate: span > 0 ? count / (span / 1000) : 0,
        maxLongTask: Math.max(0, ...longTasks),
        maxDraw: Number(root?.getAttribute('data-world-max-draw') ?? 0),
        ctaVisible: Boolean(document.querySelector('.world-deep-dive')?.getBoundingClientRect().height),
      }
    })
    const passed = response?.ok()
      && initial.ready === 'true'
      && initial.mode === 'animated'
      && initial.canvasHidden === 'true'
      && initial.sceneCount === 8
      && initial.h1Count === 1
      && initial.overflow <= 1
      && initial.staticAlt.length >= 24
      && sceneStates.every((state) => state.overflow <= 1)
      && measured.rate <= 30.5
      && measured.maxDraw <= 50
      && measured.ctaVisible
      && runtimeRequests.length === 0
      && errors.length === 0
    console.log(`${passed ? 'PASS' : 'FAIL'} ${viewport.name}: ready=${initial.ready} scenes=${initial.sceneCount} overflow=${initial.overflow}px drawRate=${measured.rate.toFixed(1)}/s maxDraw=${measured.maxDraw.toFixed(1)}ms observedLongTask=${measured.maxLongTask.toFixed(1)}ms runtimeRequests=${runtimeRequests.length} errors=${errors.join(' | ') || 'none'}`)
    if (!passed) failures.push(`${viewport.name} animated render failed.`)
    results.push({ viewport: viewport.name, initial, sceneStates, measured, runtimeRequests, errors, passed })
    await context.close()
  }

  const staticChecks = [
    { name: 'no-JavaScript', context: { javaScriptEnabled: false, viewport: { width: 390, height: 844 } } },
    { name: 'reduced-motion', context: { reducedMotion: 'reduce', viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } },
  ]
  for (const check of staticChecks) {
    const context = await browser.newContext(check.context)
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    const response = await page.goto(`${base}${route}`, { waitUntil: 'load' })
    const state = await page.evaluate(() => {
      const staticFrame = document.querySelector('[data-world-static]')
      const stage = document.querySelector('[data-world-stage]')
      return {
        scenes: document.querySelectorAll('[data-world-scene]').length,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        staticVisible: Boolean(staticFrame && getComputedStyle(staticFrame).display !== 'none'),
        stageHidden: Boolean(stage && getComputedStyle(stage).display === 'none'),
        cta: document.querySelector('.world-deep-dive')?.getAttribute('href'),
      }
    })
    const passed = response?.ok() && state.scenes === 8 && state.overflow <= 1
      && state.staticVisible && state.stageHidden && state.cta === '/work/beatmind/' && errors.length === 0
    console.log(`${passed ? 'PASS' : 'FAIL'} ${check.name}: scenes=${state.scenes} overflow=${state.overflow}px static=${state.staticVisible} stageHidden=${state.stageHidden} cta=${state.cta}`)
    if (!passed) failures.push(`${check.name} fallback failed.`)
    await page.screenshot({ path: path.join(output, `${check.name}.png`), fullPage: true })
    await context.close()
  }

  const canvasContext = await browser.newContext({ viewport: { width: 800, height: 1024 } })
  await canvasContext.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = () => null
  })
  const canvasPage = await canvasContext.newPage()
  const canvasResponse = await canvasPage.goto(`${base}${route}`, { waitUntil: 'load' })
  const canvasState = await canvasPage.evaluate(() => ({
    ready: document.querySelector('[data-world-root]')?.getAttribute('data-world-ready'),
    mode: document.querySelector('[data-world-root]')?.getAttribute('data-world-mode'),
    staticVisible: getComputedStyle(document.querySelector('[data-world-static]')).display !== 'none',
    stageHidden: getComputedStyle(document.querySelector('[data-world-stage]')).display === 'none',
    scenes: document.querySelectorAll('[data-world-scene]').length,
  }))
  const canvasPassed = canvasResponse?.ok() && canvasState.ready === null && canvasState.mode === 'static'
    && canvasState.staticVisible && canvasState.stageHidden && canvasState.scenes === 8
  console.log(`${canvasPassed ? 'PASS' : 'FAIL'} forced canvas failure: ${JSON.stringify(canvasState)}`)
  if (!canvasPassed) failures.push('Canvas failure fallback failed.')
  await canvasContext.close()

  const lifecycleContext = await browser.newContext({ viewport: { width: 800, height: 1024 } })
  const lifecyclePage = await lifecycleContext.newPage()
  await lifecyclePage.goto(`${base}${route}`, { waitUntil: 'load' })
  const lifecycleState = await lifecyclePage.evaluate(async () => {
    const root = document.querySelector('[data-world-root]')
    window.dispatchEvent(new PageTransitionEvent('pagehide'))
    const afterHide = { state: root?.getAttribute('data-world-state'), ready: root?.getAttribute('data-world-ready') }
    window.dispatchEvent(new PageTransitionEvent('pageshow'))
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    const afterShow = { state: root?.getAttribute('data-world-state'), ready: root?.getAttribute('data-world-ready') }
    window.dispatchEvent(new Event('world:destroy'))
    const stoppedCount = Number(root?.getAttribute('data-world-draw-count') ?? 0)
    window.scrollBy(0, 200)
    window.dispatchEvent(new Event('resize'))
    await new Promise((resolve) => setTimeout(resolve, 120))
    return {
      afterHide,
      afterShow,
      stopped: root?.getAttribute('data-world-state'),
      readyAfterStop: root?.getAttribute('data-world-ready'),
      drawsStable: Number(root?.getAttribute('data-world-draw-count') ?? 0) === stoppedCount,
    }
  })
  const lifecyclePassed = lifecycleState.afterHide.state === 'stopped'
    && lifecycleState.afterHide.ready === null
    && lifecycleState.afterShow.ready === 'true'
    && lifecycleState.stopped === 'stopped'
    && lifecycleState.readyAfterStop === null
    && lifecycleState.drawsStable
  console.log(`${lifecyclePassed ? 'PASS' : 'FAIL'} lifecycle teardown/restoration: ${JSON.stringify(lifecycleState)}`)
  if (!lifecyclePassed) failures.push('Lifecycle teardown/restoration failed.')
  await lifecycleContext.close()

  const resizeContext = await browser.newContext({ viewport: { width: 800, height: 1024 } })
  const resizePage = await resizeContext.newPage()
  await resizePage.goto(`${base}${route}`, { waitUntil: 'load' })
  await resizePage.setViewportSize({ width: 390, height: 844 })
  await resizePage.waitForTimeout(140)
  const resizeState = await resizePage.evaluate(() => ({
    ready: document.querySelector('[data-world-root]')?.getAttribute('data-world-ready'),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    canvasWidth: document.querySelector('canvas')?.width ?? 0,
  }))
  const resizePassed = resizeState.ready === 'true' && resizeState.overflow <= 1 && resizeState.canvasWidth > 0
  console.log(`${resizePassed ? 'PASS' : 'FAIL'} resize/orientation: ${JSON.stringify(resizeState)}`)
  if (!resizePassed) failures.push('Resize/orientation handling failed.')
  await resizeContext.close()

  const navigationContext = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const navigationPage = await navigationContext.newPage()
  await navigationPage.goto(`${base}/work/`, { waitUntil: 'load' })
  const beatMindLink = navigationPage.locator('[data-paper-project][data-project-slug="beatmind"]')
  await beatMindLink.scrollIntoViewIfNeeded()
  const sourceScroll = await navigationPage.evaluate(() => window.scrollY)
  await beatMindLink.press('Enter', { noWaitAfter: true })
  await navigationPage.waitForURL(`**${route}`)
  await navigationPage.waitForTimeout(80)
  const destinationFocus = await navigationPage.evaluate(() => document.activeElement?.id)
  await navigationPage.goBack({ waitUntil: 'load' })
  await navigationPage.waitForTimeout(80)
  const returnState = await navigationPage.evaluate(() => ({
    focus: document.activeElement?.getAttribute('data-project-slug') ?? null,
    scroll: window.scrollY,
    rootStage: document.documentElement.dataset.paperWorldStage ?? null,
    panels: document.querySelectorAll('.paper-fault-panel').length,
    preview: document.querySelector('[data-project-preview][data-active="true"]')?.getAttribute('data-project-preview') ?? null,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }))
  const navigationPassed = destinationFocus === 'world-title'
    && returnState.focus === 'beatmind'
    && Math.abs(returnState.scroll - sourceScroll) <= 2
    && returnState.rootStage === null
    && returnState.panels === 0
    && returnState.preview === null
    && returnState.overflow <= 1
  console.log(`${navigationPassed ? 'PASS' : 'FAIL'} world route and Back restoration: focus=${destinationFocus} return=${JSON.stringify(returnState)}`)
  if (!navigationPassed) failures.push('World route or Back restoration failed.')
  await navigationContext.close()

  const printContext = await browser.newContext({ viewport: { width: 800, height: 1024 } })
  const printPage = await printContext.newPage()
  await printPage.goto(`${base}${route}`, { waitUntil: 'load' })
  await printPage.emulateMedia({ media: 'print', colorScheme: 'light' })
  const printState = await printPage.evaluate(() => ({
    staticVisible: getComputedStyle(document.querySelector('[data-world-static]')).display !== 'none',
    stageHidden: getComputedStyle(document.querySelector('[data-world-stage]')).display === 'none',
    scenes: document.querySelectorAll('[data-world-scene]').length,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }))
  const printPassed = printState.staticVisible && printState.stageHidden && printState.scenes === 8 && printState.overflow <= 1
  console.log(`${printPassed ? 'PASS' : 'FAIL'} print fallback: ${JSON.stringify(printState)}`)
  if (!printPassed) failures.push('Print fallback failed.')
  await printPage.screenshot({ path: path.join(output, 'print-800.png'), fullPage: true })
  await printContext.close()
} finally {
  await browser.close()
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
}

const metrics = {
  route,
  artifact: {
    durationSeconds: artifact.analysis.durationSeconds,
    bpm: artifact.analysis.bpm,
    key: artifact.analysis.key,
    sections: artifact.analysis.sections.length,
    downbeats: artifact.analysis.downbeatTimes.length,
    trace: artifact.trace.available ? 'included' : 'omitted',
    audio: 'withheld',
  },
  transfer: {
    scripts,
    styles,
    decorativeImageBytes: imageBytes,
  },
  viewports: results,
  failures,
}
await writeFile(path.join(output, 'metrics.json'), `${JSON.stringify(metrics, null, 2)}\n`)

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`)
  process.exit(1)
}

console.log(`PASS real data contract: 6 signals, 256 RMS/peak bins, ${artifact.analysis.sections.length} sections, ${artifact.analysis.downbeatTimes.length} downbeats, trace omitted, audio withheld`)
console.log(`PASS transfer: JS=${scripts.raw} bytes (${scripts.gzip} gzip), CSS=${styles.raw} bytes (${styles.gzip} gzip), image=${imageBytes} bytes`)
console.log(`Phase 5 BeatMind evidence: ${output}`)
