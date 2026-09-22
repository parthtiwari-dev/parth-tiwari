/**
 * Gate for the illustrated DOM/SVG worlds ported from the owner-approved studies.
 * Each world contributes one spec in scripts/world-gates/<slug>.mjs; this harness runs them
 * against the built static output after the earlier phase gates.
 *
 *   node scripts/phase6-world-port-gate.mjs            verify every spec
 *   node scripts/phase6-world-port-gate.mjs --only=medrag
 *   node scripts/phase6-world-port-gate.mjs --stills   capture approved preview stills
 */
import { createServer } from 'node:http'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { gzipSync } from 'node:zlib'
import { chromium } from 'playwright'
import sharp from 'sharp'
import { chromiumLaunchOptions } from './browser.mjs'
import { worldSchema } from '../src/content/schemas.mjs'

const root = process.cwd()
const dist = path.resolve('dist')
const only = process.argv.find((argument) => argument.startsWith('--only='))?.split('=')[1]
const captureStills = process.argv.includes('--stills')
const viewports = [
  { name: 'phone-390', width: 390, height: 844, touch: true },
  { name: 'tablet-800', width: 800, height: 1024, touch: true },
  { name: 'desktop-1440', width: 1440, height: 900, touch: false },
]
const mime = new Map([['.html', 'text/html; charset=utf-8'], ['.css', 'text/css; charset=utf-8'], ['.js', 'text/javascript; charset=utf-8'], ['.jpg', 'image/jpeg'], ['.png', 'image/png'], ['.webp', 'image/webp'], ['.svg', 'image/svg+xml'], ['.woff2', 'font/woff2'], ['.xml', 'application/xml; charset=utf-8']])

const specDirectory = path.join(root, 'scripts', 'world-gates')
const specs = []
// Git drops the directory once every world is reverted, so a missing directory means none.
const specNames = await readdir(specDirectory).catch((error) => {
  if (error.code === 'ENOENT') return []
  throw error
})
for (const name of specNames.filter((file) => file.endsWith('.mjs')).sort()) {
  const spec = (await import(pathToFileURL(path.join(specDirectory, name)).href)).default
  if (!only || spec.slug === only) specs.push(spec)
}
if (only && !specs.length) throw new Error(`No world gate spec matched ${only}.`)
if (!specs.length) {
  // Every illustrated world reverts alone; with none published the gate has nothing to prove.
  console.log('PASS 0 illustrated worlds registered in scripts/world-gates')
  process.exit(0)
}

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
const base = `http://127.0.0.1:${server.address().port}`

const visibleText = (html) => html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<link[^>]*>/gi, ' ')
  .replace(/<meta[^>]*>/gi, ' ')

/** Scroll so the lifecycle selects `index`: offset worlds read 25% down, event worlds the centre. */
const scrollToScene = (page, spec, index) => page.evaluate(({ index, activation }) => {
  const scene = document.querySelectorAll('[data-world-scene]')[index]
  const top = scene.getBoundingClientRect().top + window.scrollY
  const y = activation === 'center'
    ? top + scene.offsetHeight / 2 - window.innerHeight / 2
    : top - window.innerHeight * 0.25 + Math.min(scene.offsetHeight * 0.45, window.innerHeight * 0.6)
  window.scrollTo({ top: Math.max(0, y), behavior: 'instant' })
}, { index, activation: spec.activation ?? 'offset' })

const browser = await chromium.launch(chromiumLaunchOptions())
const allFailures = []

try {
  for (const spec of specs) {
    const failures = []
    const assert = (condition, message) => { if (!condition) failures.push(message) }
    const route = `/work/${spec.slug}/world/`
    const output = path.resolve('.shots', 'phase6-worlds', spec.slug)
    await mkdir(output, { recursive: true })
    const settle = spec.settleMs ?? 260

    if (captureStills) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' })
      const page = await context.newPage()
      await page.goto(`${base}${route}`, { waitUntil: 'load' })
      await page.evaluate(() => document.fonts.ready)
      await scrollToScene(page, spec, spec.still.scene)
      await page.waitForTimeout(spec.still.wait ?? settle + 400)
      await page.addStyleTag({ content: `main, header, footer, .skip, .chapter-nav, .chapters, figcaption, .scene-note, .coordinate ${spec.still.hide ? `, ${spec.still.hide}` : ''} { visibility: hidden !important; }` })
      await page.waitForTimeout(120)
      const png = await page.screenshot({ type: 'png' })
      const target = path.join(root, 'public', 'media', 'worlds', `${spec.slug}-world-still.webp`)
      await mkdir(path.dirname(target), { recursive: true })
      await sharp(png).webp({ quality: 82, effort: 6 }).toFile(target)
      console.log(`STILL ${spec.slug}: ${path.relative(root, target)} (scene ${spec.still.scene + 1})`)
      await context.close()
      continue
    }

    // Static contract: records, routing, provenance and copy rules.
    const html = await readFile(path.join(dist, 'work', spec.slug, 'world', 'index.html'), 'utf8')
    const home = await readFile(path.join(dist, 'index.html'), 'utf8')
    const work = await readFile(path.join(dist, 'work', 'index.html'), 'utf8')
    const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8')
    const record = worldSchema.parse(JSON.parse(await readFile(path.join(root, 'src', 'content', 'worlds', `${spec.slug}.json`), 'utf8')))
    const dataText = await readFile(path.join(root, 'src', 'data', 'worlds', record.dataArtifact), 'utf8')
    const { dataSchema } = await import(pathToFileURL(path.join(root, 'src', 'worlds', spec.slug, 'schema.mjs')).href)
    const data = dataSchema.parse(JSON.parse(dataText))
    const scriptText = await readFile(path.join(root, 'src', 'worlds', spec.slug, 'world.ts'), 'utf8')
    const text = visibleText(html)

    assert(record.published && record.projectSlug === spec.slug, `${spec.slug} world record is not published for its project.`)
    assert(record.scenes.length === spec.scenes, `${spec.slug} record has ${record.scenes.length} scenes, expected ${spec.scenes}.`)
    assert(record.staticFrame.preview === true && record.staticFrame.src === `/media/worlds/${spec.slug}-world-still.webp`, `${spec.slug} preview still is not registered.`)
    assert(home.includes(`href="${route}"`), `Home does not route ${spec.slug} to its world.`)
    assert(work.includes(`href="${route}"`), `/work does not route ${spec.slug} to its world.`)
    assert(html.includes(`href="/work/${spec.slug}/"`), `${spec.slug} world does not hand off to its paper case study.`)
    assert(sitemap.includes(route), `Sitemap omits ${route}.`)
    assert(html.includes('rel="canonical"') && html.includes(`${route}"`), `${spec.slug} world lacks its canonical URL.`)
    assert(!/name="robots"[^>]*noindex/.test(html), `${spec.slug} world still carries the study noindex.`)
    assert(!/design\/directions|["(]assets\//.test(html), `${spec.slug} world references study-only paths.`)
    assert(!text.includes('—'), `${spec.slug} world contains an em dash in visitor-facing markup.`)
    assert(!/<audio|<video/i.test(html), `${spec.slug} world must not emit media elements.`)
    assert(!scriptText.includes('Math.random'), `${spec.slug} world script contains random drawing data.`)
    assert((html.match(/<h1\b/g) ?? []).length === 1 && html.includes('id="world-title"'), `${spec.slug} world needs one focusable #world-title heading.`)
    for (const fact of spec.facts(data)) assert(text.includes(fact), `${spec.slug} world is missing the sourced fact "${fact}".`)
    for (const check of spec.dataChecks?.(data, html) ?? []) assert(check.pass, `${spec.slug}: ${check.message}`)

    // Count every eagerly loaded module: entry scripts plus the chunks they statically import
    // (Vite splits the shared lifecycle into its own chunk once several worlds use it).
    const loaded = new Set()
    const queue = [...html.matchAll(/<script[^>]+src="([^"]+\.js)"/g)].map((match) => match[1])
    let gzip = 0
    while (queue.length) {
      const entry = queue.shift()
      if (loaded.has(entry)) continue
      loaded.add(entry)
      const bytes = await readFile(path.join(dist, entry.replace(/^\//, '')))
      gzip += gzipSync(bytes).length
      for (const match of bytes.toString('utf8').matchAll(/(?:import|from)\s*["']([^"']+\.js)["']/g)) {
        queue.push(path.posix.join(path.posix.dirname(entry), match[1]))
      }
    }
    assert(gzip <= 30 * 1024, `${spec.slug} eager route JavaScript is ${gzip} gzip bytes, above 30 kB.`)

    const results = []
    for (const viewport of viewports) {
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, hasTouch: viewport.touch, isMobile: viewport.touch, reducedMotion: 'no-preference' })
      const page = await context.newPage()
      const errors = []
      const requests = []
      const images = new Map()
      page.on('pageerror', (error) => errors.push(error.message))
      page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
      page.on('request', (request) => { if (['fetch', 'xhr', 'media', 'websocket'].includes(request.resourceType())) requests.push(`${request.resourceType()}:${request.url()}`) })
      page.on('response', async (response) => { if (response.request().resourceType() === 'image') images.set(response.url(), Number(response.headers()['content-length'] ?? (await response.body().catch(() => Buffer.alloc(0))).length)) })
      const response = await page.goto(`${base}${route}`, { waitUntil: 'load' })
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(120)
      const initial = await page.evaluate((enhancedClass) => ({
        mode: document.body.dataset.worldMode,
        ready: document.body.dataset.worldReady,
        enhanced: document.documentElement.classList.contains(enhancedClass),
        scenes: document.querySelectorAll('[data-world-scene]').length,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      }), spec.enhancedClass)

      const sceneStates = []
      for (let index = 0; index < initial.scenes; index += 1) {
        await scrollToScene(page, spec, index)
        await page.waitForTimeout(settle)
        const state = await page.evaluate(() => ({ scene: Number(document.body.dataset.scene), overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth }))
        sceneStates.push(state)
        await page.screenshot({ path: path.join(output, `${viewport.name}-scene-${String(index + 1).padStart(2, '0')}.png`) })
      }
      const activation = sceneStates.every((state, index) => state.scene === index)

      const controlResults = []
      const controls = typeof spec.controls === 'function' ? spec.controls(data) : spec.controls ?? []
      for (const control of controls) {
        await scrollToScene(page, spec, control.scene)
        await page.waitForTimeout(settle)
        const target = page.locator(control.click).first()
        await target.scrollIntoViewIfNeeded()
        if (control.fill !== undefined) {
          await target.evaluate((element, value) => {
            element.value = value
            element.dispatchEvent(new Event('input', { bubbles: true }))
          }, String(control.fill))
        }
        else await target.click()
        await page.waitForTimeout(120)
        const state = await page.evaluate(({ click, result, pressed }) => ({
          pressed: pressed ? document.querySelector(click)?.getAttribute('aria-pressed') : 'n/a',
          result: result ? document.querySelector(result)?.textContent?.trim() ?? '' : '',
        }), { click: control.click, result: control.result, pressed: control.pressed })
        const passed = (!control.pressed || state.pressed === 'true') && (!control.expect || control.expect.test(state.result))
        controlResults.push({ ...state, click: control.click, passed })
      }

      // Idle: once the scroll settles and any event completes, drawing stops.
      await page.waitForTimeout(spec.idleSettleMs ?? 400)
      const beforeIdle = await page.evaluate(() => Number(document.body.dataset.worldDrawCount ?? 0))
      await page.waitForTimeout(900)
      const afterIdle = await page.evaluate(() => Number(document.body.dataset.worldDrawCount ?? 0))

      // The handoff is reachable by keyboard and not covered at the final chapter.
      await scrollToScene(page, spec, initial.scenes - 1)
      await page.waitForTimeout(settle)
      const handoff = await page.evaluate((slug) => {
        const link = [...document.querySelectorAll(`[data-world-ending] a[href="/work/${slug}/"]`)][0]
        if (!link) return { found: false }
        link.focus()
        link.scrollIntoView({ block: 'center' })
        const bounds = link.getBoundingClientRect()
        const hit = document.elementFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2)
        return { found: true, focused: document.activeElement === link, unobstructed: Boolean(hit && (hit === link || link.contains(hit))) }
      }, spec.slug)

      const measured = await page.evaluate(() => {
        const count = Number(document.body.dataset.worldDrawCount ?? 0)
        const span = Number(document.body.dataset.worldDrawSpan ?? 0)
        return { draws: count, rate: span ? count / (span / 1000) : 0, maxDraw: Number(document.body.dataset.worldMaxDraw ?? 0), maxMeasure: Number(document.body.dataset.worldMaxMeasure ?? 0) }
      })

      // world:destroy removes every listener: scrolling afterwards draws nothing.
      const destroyed = await page.evaluate(async () => {
        const before = Number(document.body.dataset.worldDrawCount ?? 0)
        window.dispatchEvent(new Event('world:destroy'))
        window.scrollTo(0, 0)
        await new Promise((resolve) => setTimeout(resolve, 250))
        return { stopped: document.body.dataset.worldState === 'stopped', drewAfter: Number(document.body.dataset.worldDrawCount ?? 0) - before }
      })

      const imageBytes = [...images.values()].reduce((total, bytes) => total + bytes, 0)
      const passed = response?.ok() && initial.mode === 'animated' && initial.ready === 'true' && initial.enhanced && initial.scenes === spec.scenes && initial.overflow <= 1
        && activation && sceneStates.every((state) => state.overflow <= 1)
        && controlResults.every((control) => control.passed)
        && afterIdle === beforeIdle
        && handoff.found && handoff.focused && handoff.unobstructed
        && measured.rate <= 30.5 && measured.maxDraw <= 50
        && destroyed.stopped && destroyed.drewAfter === 0
        && requests.length === 0 && errors.length === 0
      console.log(`${passed ? 'PASS' : 'FAIL'} ${spec.slug} ${viewport.name}: scenes=${initial.scenes} active=${sceneStates.map((state) => state.scene).join('')} overflow=${Math.max(initial.overflow, ...sceneStates.map((state) => state.overflow))}px controls=${controlResults.filter((control) => control.passed).length}/${controlResults.length} idle=${afterIdle - beforeIdle} handoff=${handoff.unobstructed ? 'clear' : 'blocked'} drawRate=${measured.rate.toFixed(1)}/s maxDraw=${measured.maxDraw.toFixed(1)}ms layoutMeasure=${measured.maxMeasure.toFixed(1)}ms destroy=${destroyed.stopped && destroyed.drewAfter === 0 ? 'ok' : 'leak'} images=${Math.round(imageBytes / 1024)}KB requests=${requests.length} errors=${errors.join(' | ') || 'none'}`)
      if (!passed) failures.push(`${viewport.name} render failed: ${JSON.stringify({ initial, sceneStates, controlResults: controlResults.filter((control) => !control.passed), idle: afterIdle - beforeIdle, handoff, measured, destroyed, requests, errors })}`)
      results.push({ viewport: viewport.name, initial, sceneStates, controlResults, idle: afterIdle - beforeIdle, handoff, measured, destroyed, imageBytes, requests, errors, passed })
      await context.close()
    }

    for (const check of [
      { name: 'no-javascript-390', context: { viewport: { width: 390, height: 844 }, javaScriptEnabled: false } },
      { name: 'no-javascript-1440', context: { viewport: { width: 1440, height: 900 }, javaScriptEnabled: false } },
      { name: 'reduced-motion-390', context: { viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' } },
      { name: 'reduced-motion-1440', context: { viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' } },
    ]) {
      const context = await browser.newContext(check.context)
      const page = await context.newPage()
      const errors = []
      page.on('pageerror', (error) => errors.push(error.message))
      await page.goto(`${base}${route}`, { waitUntil: 'load' })
      await page.waitForTimeout(150)
      const state = await page.evaluate(({ slug, enhancedClass }) => {
        const still = document.querySelector('[data-world-static]')
        const box = still?.getBoundingClientRect()
        return {
          scenes: document.querySelectorAll('[data-world-scene]').length,
          enhanced: document.documentElement.classList.contains(enhancedClass),
          staticVisible: Boolean(still && getComputedStyle(still).display !== 'none' && box.width > 0 && box.height > 0),
          handoff: Boolean(document.querySelector(`[data-world-ending] a[href="/work/${slug}/"]`)),
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        }
      }, { slug: spec.slug, enhancedClass: spec.enhancedClass })
      const passed = state.scenes === spec.scenes && !state.enhanced && state.staticVisible && state.handoff && state.overflow <= 1 && errors.length === 0
      console.log(`${passed ? 'PASS' : 'FAIL'} ${spec.slug} ${check.name}: ${JSON.stringify(state)}`)
      if (!passed) failures.push(`${check.name} fallback failed.`)
      await page.screenshot({ path: path.join(output, `${check.name}.png`), fullPage: true })
      await context.close()
    }

    const printContext = await browser.newContext({ viewport: { width: 800, height: 1024 } })
    const printPage = await printContext.newPage()
    await printPage.goto(`${base}${route}`, { waitUntil: 'load' })
    await printPage.emulateMedia({ media: 'print' })
    const printState = await printPage.evaluate(() => ({
      scenes: [...document.querySelectorAll('[data-world-scene]')].filter((scene) => scene.getBoundingClientRect().height > 0).length,
      staticVisible: getComputedStyle(document.querySelector('[data-world-static]')).display !== 'none',
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }))
    const printPassed = printState.scenes === spec.scenes && printState.staticVisible && printState.overflow <= 1
    console.log(`${printPassed ? 'PASS' : 'FAIL'} ${spec.slug} print: ${JSON.stringify(printState)}`)
    if (!printPassed) failures.push('print fallback failed.')
    await printPage.pdf({ path: path.join(output, 'print.pdf'), format: 'A4' }).catch(() => {})
    await printContext.close()

    // Back restoration through the real paper door on /work.
    const navContext = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    const navPage = await navContext.newPage()
    await navPage.goto(`${base}/work/`, { waitUntil: 'load' })
    const link = navPage.locator(`[data-paper-project][data-project-slug="${spec.slug}"]`)
    await link.scrollIntoViewIfNeeded()
    const sourceScroll = await navPage.evaluate(() => window.scrollY)
    await link.press('Enter', { noWaitAfter: true })
    await navPage.waitForURL(`**${route}`)
    const arrived = await navPage.evaluate(async () => {
      await new Promise((resolve) => setTimeout(resolve, 150))
      return document.activeElement?.id ?? null
    })
    await navPage.goBack({ waitUntil: 'load' })
    await navPage.waitForTimeout(120)
    const returnState = await navPage.evaluate(() => ({ focus: document.activeElement?.getAttribute('data-project-slug'), scroll: window.scrollY, stage: document.documentElement.dataset.paperWorldStage ?? null, panels: document.querySelectorAll('.paper-fault-panel').length, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth }))
    const navPassed = arrived === 'world-title' && returnState.focus === spec.slug && Math.abs(returnState.scroll - sourceScroll) <= 2 && returnState.stage === null && returnState.panels === 0 && returnState.overflow <= 1
    console.log(`${navPassed ? 'PASS' : 'FAIL'} ${spec.slug} route, focus and Back restoration: ${JSON.stringify({ arrived, ...returnState })}`)
    if (!navPassed) failures.push('route focus or Back restoration failed.')
    await navContext.close()

    await writeFile(path.join(output, 'metrics.json'), `${JSON.stringify({ route, gzip, results, failures }, null, 2)}\n`)
    if (failures.length) allFailures.push(...failures.map((failure) => `${spec.slug}: ${failure}`))
    else console.log(`PASS ${spec.slug} world: ${spec.summary(data)}, JS=${gzip} gzip bytes`)
  }
} finally {
  await browser.close()
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
}

if (allFailures.length) {
  for (const failure of allFailures) console.error(`FAIL ${failure}`)
  process.exit(1)
}
if (!captureStills) console.log(`PASS ${specs.length} illustrated world${specs.length === 1 ? '' : 's'}; evidence in .shots/phase6-worlds`)
