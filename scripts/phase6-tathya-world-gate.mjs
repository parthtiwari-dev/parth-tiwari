/** Verify the Tathya Long Table after the Phase 5 foundation gate has passed. */
import { createServer } from 'node:http'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { gzipSync } from 'node:zlib'
import { chromium } from 'playwright'
import { chromiumLaunchOptions } from './browser.mjs'

const dist = path.resolve('dist')
const output = path.resolve('.shots/phase6-tathya-world')
const route = '/work/tathya/world/'
const root = process.cwd()
const failures = []
const assert = (condition, message) => { if (!condition) failures.push(message) }
const viewports = [
  { name: 'phone-390', width: 390, height: 844, touch: true },
  { name: 'tablet-800', width: 800, height: 1024, touch: true },
  { name: 'desktop-1440', width: 1440, height: 900, touch: false },
]
const mime = new Map([['.html', 'text/html; charset=utf-8'], ['.css', 'text/css; charset=utf-8'], ['.js', 'text/javascript; charset=utf-8'], ['.svg', 'image/svg+xml'], ['.jpg', 'image/jpeg'], ['.png', 'image/png'], ['.webp', 'image/webp'], ['.woff2', 'font/woff2'], ['.xml', 'application/xml; charset=utf-8']])
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

const worldHtml = await readFile(path.join(dist, 'work/tathya/world/index.html'), 'utf8')
const homeHtml = await readFile(path.join(dist, 'index.html'), 'utf8')
const workHtml = await readFile(path.join(dist, 'work/index.html'), 'utf8')
const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8')
const dataText = await readFile(path.join(root, 'src/data/worlds/tathya-world-v1.json'), 'utf8')
const data = JSON.parse(dataText)
const worldEntry = JSON.parse(await readFile(path.join(root, 'src/content/worlds/tathya.json'), 'utf8'))
const scriptText = await readFile(path.join(root, 'src/scripts/tathya-world.ts'), 'utf8')

assert(homeHtml.includes('href="/work/tathya/world/"'), 'Home does not route Tathya to the published world.')
assert(workHtml.includes('href="/work/tathya/world/"'), '/work does not route Tathya to the published world.')
assert(worldHtml.includes('href="/work/tathya/"'), 'Tathya world does not hand off to the paper case study.')
assert(sitemap.includes('/work/tathya/world/'), 'Sitemap omits the Tathya world.')
assert(worldEntry.published === true, 'The Tathya world entry is not published.')

// data contract: the provenance guard, real structure, honest absence
assert(data.project === 'tathya' && data.version === 1, 'Tathya data contract is not versioned V1.')
assert(data.provenance !== 'placeholder', 'Tathya world still ships the placeholder data artifact.')
assert(['committed-export', 'public-snapshot'].includes(data.provenance), `Tathya provenance ${data.provenance} is not a real source.`)
assert(/^\d{4}-\d{2}-\d{2}$/.test(data.snapshot.takenAt) && data.snapshot.surface.startsWith('https://'), 'Tathya snapshot is not a dated HTTPS read.')
assert(data.feed.handPickedCount === 0, 'Tathya feed records a hand-picked topic.')
assert(Array.isArray(data.caseFiles) && data.caseFiles.length >= 2 && data.caseFiles.length <= 8, 'Tathya case-file count is outside 2..8.')
for (const file of data.caseFiles) {
  const parts = file.composition.official + file.composition.media + file.composition.citizen
  assert(parts === file.sourceCount, `Tathya case file ${file.id} composition does not sum to its source count.`)
  assert(!(file.verifiableFacts && file.composition.official === 0), `Tathya case file ${file.id} claims verifiable facts with no official source.`)
}
assert(data.corpusBenchmark.available === false, 'Tathya world claims a corpus benchmark that does not exist.')
assert(data.openQuestions.length >= 1 && data.integrity.historyNeverRewritten === true, 'Tathya integrity record changed.')

// the world stays procedural and offline
assert(!scriptText.includes('Math.random'), 'Tathya renderer contains Math.random().')
assert(!worldHtml.includes('<audio'), 'Tathya world must not emit audio.')
for (const forbidden of [/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i, /[A-Z]:\\/, /raw prompt|seed|storage(?:-|_)?key|signed(?:-|_)?url/i]) {
  assert(!forbidden.test(worldHtml) && !forbidden.test(dataText), `Tathya output matches prohibited pattern ${forbidden}.`)
}

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
    const initial = await page.evaluate(() => ({ ready: document.querySelector('[data-world-root]')?.getAttribute('data-world-ready'), mode: document.querySelector('[data-world-root]')?.getAttribute('data-world-mode'), scenes: document.querySelectorAll('[data-world-scene]').length, h1: document.querySelectorAll('h1').length, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, canvasHidden: document.querySelector('[data-world-canvas]')?.getAttribute('aria-hidden'), staticAlt: document.querySelector('[data-world-static] img')?.getAttribute('alt')?.length ?? 0, ledgerRows: document.querySelectorAll('.world-file-ledger div').length }))
    const sceneStates = []
    const sceneList = page.locator('[data-world-scene]')
    for (let index = 0; index < await sceneList.count(); index += 1) {
      await sceneList.nth(index).evaluate((element) => element.scrollIntoView({ block: 'center' }))
      await page.waitForTimeout(220)
      sceneStates.push(await page.evaluate(() => ({ active: document.querySelector('.world-scene.is-current')?.getAttribute('data-scene-index'), overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth })))
      await page.screenshot({ path: path.join(output, `${viewport.name}-scene-${String(index + 1).padStart(2, '0')}.png`) })
    }
    const measured = await page.evaluate(() => { const node = document.querySelector('[data-world-root]'); const count = Number(node?.getAttribute('data-world-draw-count') ?? 0); const span = Number(node?.getAttribute('data-world-draw-span') ?? 0); return { rate: span ? count / (span / 1000) : 0, draw: Number(node?.getAttribute('data-world-max-draw') ?? 0) } })
    const passed = response?.ok() && initial.ready === 'true' && initial.mode === 'animated' && initial.scenes === 8 && initial.h1 === 1 && initial.overflow <= 1 && initial.canvasHidden === 'true' && initial.staticAlt >= 24 && initial.ledgerRows >= 3 && sceneStates.every((state) => state.overflow <= 1) && sceneStates.some((state) => state.active !== null && state.active !== undefined) && measured.rate <= 30.5 && measured.draw <= 50 && requests.length === 0 && errors.length === 0
    console.log(`${passed ? 'PASS' : 'FAIL'} ${viewport.name}: scenes=${initial.scenes} overflow=${initial.overflow}px drawRate=${measured.rate.toFixed(1)}/s maxDraw=${measured.draw.toFixed(1)}ms runtimeRequests=${requests.length} errors=${errors.join(' | ') || 'none'}`)
    if (!passed) failures.push(`${viewport.name} Tathya render failed.`)
    results.push({ viewport: viewport.name, initial, sceneStates, measured, requests, errors, passed })
    await context.close()
  }
  for (const check of [{ name: 'no-javascript', context: { javaScriptEnabled: false } }, { name: 'reduced-motion', context: { reducedMotion: 'reduce' } }]) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, ...check.context })
    const page = await context.newPage(); await page.goto(`${base}${route}`, { waitUntil: 'load' })
    const state = await page.evaluate(() => ({ scenes: document.querySelectorAll('[data-world-scene]').length, staticVisible: getComputedStyle(document.querySelector('[data-world-static]')).display !== 'none', stageHidden: getComputedStyle(document.querySelector('[data-world-stage]')).display === 'none', cta: document.querySelector('.world-deep-dive')?.getAttribute('href'), overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth }))
    const passed = state.scenes === 8 && state.staticVisible && state.stageHidden && state.cta === '/work/tathya/' && state.overflow <= 1
    console.log(`${passed ? 'PASS' : 'FAIL'} ${check.name}: ${JSON.stringify(state)}`); if (!passed) failures.push(`${check.name} fallback failed.`)
    await page.screenshot({ path: path.join(output, `${check.name}.png`), fullPage: true }); await context.close()
  }
  const canvasContext = await browser.newContext({ viewport: { width: 800, height: 1024 } }); await canvasContext.addInitScript(() => { HTMLCanvasElement.prototype.getContext = () => null })
  const canvasPage = await canvasContext.newPage(); await canvasPage.goto(`${base}${route}`, { waitUntil: 'load' })
  const canvasState = await canvasPage.evaluate(() => ({ ready: document.querySelector('[data-world-root]')?.getAttribute('data-world-ready'), mode: document.querySelector('[data-world-root]')?.getAttribute('data-world-mode'), staticVisible: getComputedStyle(document.querySelector('[data-world-static]')).display !== 'none' }))
  const canvasPassed = canvasState.ready === null && canvasState.mode === 'static' && canvasState.staticVisible
  console.log(`${canvasPassed ? 'PASS' : 'FAIL'} forced canvas failure: ${JSON.stringify(canvasState)}`); if (!canvasPassed) failures.push('Canvas fallback failed.'); await canvasContext.close()
  const navContext = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const navPage = await navContext.newPage()
  await navPage.goto(`${base}/work/`, { waitUntil: 'load' }); const link = navPage.locator('[data-paper-project][data-project-slug="tathya"]'); await link.scrollIntoViewIfNeeded(); const sourceScroll = await navPage.evaluate(() => window.scrollY); await link.press('Enter', { noWaitAfter: true }); await navPage.waitForURL(`**${route}`); await navPage.goBack({ waitUntil: 'load' }); await navPage.waitForTimeout(100)
  const returnState = await navPage.evaluate(() => ({ focus: document.activeElement?.getAttribute('data-project-slug'), scroll: window.scrollY, stage: document.documentElement.dataset.paperWorldStage ?? null, panels: document.querySelectorAll('.paper-fault-panel').length, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth }))
  const navPassed = returnState.focus === 'tathya' && Math.abs(returnState.scroll - sourceScroll) <= 2 && returnState.stage === null && returnState.panels === 0 && returnState.overflow <= 1
  console.log(`${navPassed ? 'PASS' : 'FAIL'} Tathya route and Back restoration: ${JSON.stringify(returnState)}`); if (!navPassed) failures.push('Tathya Back restoration failed.'); await navContext.close()
} finally { await browser.close(); await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())) }

const scripts = [...worldHtml.matchAll(/<script[^>]+src="([^"]+\.js)"/g)].map((match) => match[1])
const gzip = (await Promise.all(scripts.map((entry) => readFile(path.join(dist, entry.replace(/^\//, '')))))).reduce((total, bytes) => total + gzipSync(bytes).length, 0)
assert(gzip <= 30 * 1024, `Tathya eager route JavaScript is ${gzip} gzip bytes, above 30 kB.`)
await writeFile(path.join(output, 'metrics.json'), `${JSON.stringify({ route, data: { provenance: data.provenance, caseFiles: data.caseFiles.length, feedFiles: data.feed.caseFileCount, corpusBenchmark: data.corpusBenchmark.available }, gzip, results, failures }, null, 2)}\n`)
if (failures.length) { for (const failure of failures) console.error(`FAIL ${failure}`); process.exit(1) }
console.log(`PASS Tathya Long Table: ${data.provenance} data, ${data.caseFiles.length} real case files, no corpus benchmark, verdict leaves no mark, JS=${gzip} gzip bytes`)
