/** Verify the Vivid Story Loom after the Phase 5 foundation gate has passed. */
import { createServer } from 'node:http'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { gzipSync } from 'node:zlib'
import { chromium } from 'playwright'
import { chromiumLaunchOptions } from './browser.mjs'

const dist = path.resolve('dist')
const output = path.resolve('.shots/phase6-vivid-world')
const route = '/work/vivid/world/'
const root = process.cwd()
const failures = []
const assert = (condition, message) => { if (!condition) failures.push(message) }
const viewports = [
  { name: 'phone-390', width: 390, height: 844, touch: true },
  { name: 'tablet-800', width: 800, height: 1024, touch: true },
  { name: 'desktop-1440', width: 1440, height: 900, touch: false },
]
const mime = new Map([['.html', 'text/html; charset=utf-8'], ['.css', 'text/css; charset=utf-8'], ['.js', 'text/javascript; charset=utf-8'], ['.jpg', 'image/jpeg'], ['.png', 'image/png'], ['.woff2', 'font/woff2'], ['.xml', 'application/xml; charset=utf-8']])
const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://127.0.0.1')
    const requested = url.pathname.endsWith('/') ? `${url.pathname}index.html` : url.pathname
    const filename = path.resolve(dist, `.${decodeURIComponent(requested)}`)
    if (!filename.startsWith(dist)) throw new Error('Path escapes dist.')
    const bytes = await readFile(filename)
    response.writeHead(200, { 'content-type': mime.get(path.extname(filename)) ?? 'application/octet-stream' }).end(bytes)
  } catch { response.writeHead(404, { 'content-type': 'text/plain' }).end('Not found') }
})
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const port = server.address().port
const base = `http://127.0.0.1:${port}`
await mkdir(output, { recursive: true })

const worldHtml = await readFile(path.join(dist, 'work/vivid/world/index.html'), 'utf8')
const homeHtml = await readFile(path.join(dist, 'index.html'), 'utf8')
const workHtml = await readFile(path.join(dist, 'work/index.html'), 'utf8')
const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8')
const dataText = await readFile(path.join(root, 'src/data/worlds/vivid-world-v1.json'), 'utf8')
const data = JSON.parse(dataText)
const scriptText = await readFile(path.join(root, 'src/scripts/vivid-world.ts'), 'utf8')

assert(homeHtml.includes('href="/work/vivid/world/"'), 'Home does not route Vivid to the published world.')
assert(workHtml.includes('href="/work/vivid/world/"'), '/work does not route Vivid to the published world.')
assert(worldHtml.includes('href="/work/vivid/"'), 'Vivid world does not hand off to the paper case study.')
assert(sitemap.includes('/work/vivid/world/'), 'Sitemap omits the Vivid world.')
assert(data.project === 'vivid' && data.version === 1, 'Vivid data contract is not versioned V1.')
assert(data.portfolioUse.ownerCleared === true, 'Vivid portfolio clearance is not recorded.')
assert(data.portfolioUse.commercialModelLicence === 'unresolved', 'Vivid licence boundary is not unresolved.')
assert(data.frames.length === 4 && data.characterAnchor, 'Vivid export must contain one anchor and four frames.')
assert(data.failureEvidence.status === 'visual-comparison-unavailable', 'Vivid visual failure boundary changed.')
assert(!scriptText.includes('Math.random'), 'Vivid renderer contains random drawing data.')
for (const forbidden of [/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i, /[A-Z]:\\/, /raw prompt|seed|storage(?:-|_)?key|signed(?:-|_)?url/i]) {
  assert(!forbidden.test(worldHtml) && !forbidden.test(dataText), `Vivid output matches prohibited pattern ${forbidden}.`)
}
assert(!worldHtml.includes('<audio'), 'Vivid world must not emit audio.')

const browser = await chromium.launch(chromiumLaunchOptions())
const results = []
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, hasTouch: viewport.touch, isMobile: viewport.touch, reducedMotion: 'no-preference' })
    const page = await context.newPage(); const errors = []; const requests = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('request', (request) => { if (['fetch', 'xhr', 'media'].includes(request.resourceType())) requests.push(`${request.resourceType()}:${request.url()}`) })
    const response = await page.goto(`${base}${route}`, { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    const initial = await page.evaluate(() => ({ ready: document.querySelector('[data-world-root]')?.getAttribute('data-world-ready'), mode: document.querySelector('[data-world-root]')?.getAttribute('data-world-mode'), scenes: document.querySelectorAll('[data-world-scene]').length, h1: document.querySelectorAll('h1').length, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, canvasHidden: document.querySelector('[data-world-canvas]')?.getAttribute('aria-hidden'), frameAlts: [...document.querySelectorAll('.vivid-contact-sheet img')].map((image) => image.alt.length) }))
    const sceneStates = []
    const sceneList = page.locator('[data-world-scene]')
    for (let index = 0; index < await sceneList.count(); index += 1) {
      await sceneList.nth(index).evaluate((element) => element.scrollIntoView({ block: 'center' }))
      await page.waitForTimeout(160)
      sceneStates.push(await page.evaluate(() => ({ active: document.querySelector('.world-scene.is-current')?.getAttribute('data-scene-index'), overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth })))
      await page.screenshot({ path: path.join(output, `${viewport.name}-scene-${String(index + 1).padStart(2, '0')}.png`) })
    }
    const measured = await page.evaluate(() => { const node = document.querySelector('[data-world-root]'); const count = Number(node?.getAttribute('data-world-draw-count') ?? 0); const span = Number(node?.getAttribute('data-world-draw-span') ?? 0); return { rate: span ? count / (span / 1000) : 0, draw: Number(node?.getAttribute('data-world-max-draw') ?? 0) } })
    const passed = response?.ok() && initial.ready === 'true' && initial.mode === 'animated' && initial.scenes === 8 && initial.h1 === 1 && initial.overflow <= 1 && initial.canvasHidden === 'true' && initial.frameAlts.length === 4 && initial.frameAlts.every((length) => length >= 24) && sceneStates.every((state) => state.overflow <= 1) && measured.rate <= 30.5 && measured.draw <= 50 && requests.length === 0 && errors.length === 0
    console.log(`${passed ? 'PASS' : 'FAIL'} ${viewport.name}: scenes=${initial.scenes} overflow=${initial.overflow}px drawRate=${measured.rate.toFixed(1)}/s maxDraw=${measured.draw.toFixed(1)}ms runtimeRequests=${requests.length} errors=${errors.join(' | ') || 'none'}`)
    if (!passed) failures.push(`${viewport.name} Vivid render failed.`)
    results.push({ viewport: viewport.name, initial, sceneStates, measured, requests, errors, passed })
    await context.close()
  }
  for (const check of [{ name: 'no-javascript', context: { javaScriptEnabled: false } }, { name: 'reduced-motion', context: { reducedMotion: 'reduce' } }]) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, ...check.context })
    const page = await context.newPage(); await page.goto(`${base}${route}`, { waitUntil: 'load' })
    const state = await page.evaluate(() => ({ scenes: document.querySelectorAll('[data-world-scene]').length, staticVisible: getComputedStyle(document.querySelector('[data-world-static]')).display !== 'none', stageHidden: getComputedStyle(document.querySelector('[data-world-stage]')).display === 'none', cta: document.querySelector('.world-deep-dive')?.getAttribute('href'), overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth }))
    const passed = state.scenes === 8 && state.staticVisible && state.stageHidden && state.cta === '/work/vivid/' && state.overflow <= 1
    console.log(`${passed ? 'PASS' : 'FAIL'} ${check.name}: ${JSON.stringify(state)}`); if (!passed) failures.push(`${check.name} fallback failed.`)
    await page.screenshot({ path: path.join(output, `${check.name}.png`), fullPage: true }); await context.close()
  }
  const canvasContext = await browser.newContext({ viewport: { width: 800, height: 1024 } }); await canvasContext.addInitScript(() => { HTMLCanvasElement.prototype.getContext = () => null })
  const canvasPage = await canvasContext.newPage(); await canvasPage.goto(`${base}${route}`, { waitUntil: 'load' })
  const canvasState = await canvasPage.evaluate(() => ({ ready: document.querySelector('[data-world-root]')?.getAttribute('data-world-ready'), mode: document.querySelector('[data-world-root]')?.getAttribute('data-world-mode'), staticVisible: getComputedStyle(document.querySelector('[data-world-static]')).display !== 'none' }))
  const canvasPassed = canvasState.ready === null && canvasState.mode === 'static' && canvasState.staticVisible
  console.log(`${canvasPassed ? 'PASS' : 'FAIL'} forced canvas failure: ${JSON.stringify(canvasState)}`); if (!canvasPassed) failures.push('Canvas fallback failed.'); await canvasContext.close()
  const navContext = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const navPage = await navContext.newPage()
  await navPage.goto(`${base}/work/`, { waitUntil: 'load' }); const link = navPage.locator('[data-paper-project][data-project-slug="vivid"]'); await link.scrollIntoViewIfNeeded(); const sourceScroll = await navPage.evaluate(() => window.scrollY); await link.press('Enter', { noWaitAfter: true }); await navPage.waitForURL(`**${route}`); await navPage.goBack({ waitUntil: 'load' }); await navPage.waitForTimeout(100)
  const returnState = await navPage.evaluate(() => ({ focus: document.activeElement?.getAttribute('data-project-slug'), scroll: window.scrollY, stage: document.documentElement.dataset.paperWorldStage ?? null, panels: document.querySelectorAll('.paper-fault-panel').length, preview: document.querySelector('[data-project-preview][data-active="true"]')?.getAttribute('data-project-preview') ?? null, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth }))
  const navPassed = returnState.focus === 'vivid' && Math.abs(returnState.scroll - sourceScroll) <= 2 && returnState.stage === null && returnState.panels === 0 && returnState.preview === null && returnState.overflow <= 1
  console.log(`${navPassed ? 'PASS' : 'FAIL'} Vivid route and Back restoration: ${JSON.stringify(returnState)}`); if (!navPassed) failures.push('Vivid Back restoration failed.'); await navContext.close()
} finally { await browser.close(); await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())) }

const scripts = [...worldHtml.matchAll(/<script[^>]+src="([^"]+\.js)"/g)].map((match) => match[1])
const gzip = (await Promise.all(scripts.map((entry) => readFile(path.join(dist, entry.replace(/^\//, '')))))).reduce((total, bytes) => total + gzipSync(bytes).length, 0)
assert(gzip <= 30 * 1024, `Vivid eager route JavaScript is ${gzip} gzip bytes, above 30 kB.`)
await writeFile(path.join(output, 'metrics.json'), `${JSON.stringify({ route, data: { frames: data.frames.length, licence: data.portfolioUse.commercialModelLicence, failure: data.failureEvidence.status }, gzip, results, failures }, null, 2)}\n`)
if (failures.length) { for (const failure of failures) console.error(`FAIL ${failure}`); process.exit(1) }
console.log(`PASS Vivid Story Loom: four cleared frames, text-only unavailable failure boundary, unresolved commercial-model licence, JS=${gzip} gzip bytes`)
