import { createServer } from 'node:http'
import { readFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'
import { chromiumLaunchOptions } from './browser.mjs'

const ROOT = process.cwd()
const OUT = path.join(ROOT, '.shots', 'phase2-beatmind-world-study')
const ENTRY = '/design/directions/beatmind-world.html'

const TYPES = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.jpg', 'image/jpeg'],
  ['.png', 'image/png'],
  ['.woff2', 'font/woff2'],
])

function startServer(port = 0) {
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url || '/', 'http://local').pathname)
      const resolved = path.resolve(ROOT, `.${pathname}`)
      if (!resolved.startsWith(`${ROOT}${path.sep}`)) {
        response.writeHead(403).end('Forbidden')
        return
      }
      const body = await readFile(resolved)
      response.writeHead(200, {
        'content-type': TYPES.get(path.extname(resolved)) || 'application/octet-stream',
        'cache-control': 'no-store',
      })
      response.end(body)
    } catch {
      response.writeHead(404).end('Not found')
    }
  })

  return new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(port, '127.0.0.1', () => {
      const address = server.address()
      if (!address || typeof address === 'string') return reject(new Error('Could not resolve study server port'))
      resolve({ server, origin: `http://127.0.0.1:${address.port}` })
    })
  })
}

if (process.argv.includes('--serve')) {
  const portFlag = process.argv.indexOf('--port')
  const requestedPort = portFlag >= 0 ? Number(process.argv[portFlag + 1]) : 4324
  const { server, origin } = await startServer(Number.isFinite(requestedPort) ? requestedPort : 4324)
  console.log(`${origin}${ENTRY}`)

  await new Promise((resolve) => {
    const close = () => server.close(resolve)
    process.once('SIGINT', close)
    process.once('SIGTERM', close)
  })
  process.exit(0)
}

async function settle(page) {
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(240)
}

async function captureWidth(browser, origin, name, viewport) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, colorScheme: 'dark' })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })

  await page.goto(`${origin}${ENTRY}`, { waitUntil: 'commit' })
  await settle(page)

  const states = [
    ['chamber', 0],
    ['separation', 1],
    ['failure', 2],
    ['recovery', 3],
    ['analysis', 4],
    ['arrangement', 5],
    ['mix', 6],
    ['render', 7],
    ['ending', 8],
  ]

  for (const [label, index] of states) {
    await page.locator('[data-scene]').nth(index).evaluate((element) => {
      const top = window.scrollY + element.getBoundingClientRect().top
      window.scrollTo({ top, behavior: 'instant' })
    })
    await page.waitForTimeout(900)
    await page.screenshot({ path: path.join(OUT, `${name}-${label}.png`) })

    if (name === 'desktop-1440' && label === 'chamber') {
      const hiddenChrome = await page.addStyleTag({ content: '.study-bar { display: none !important; }' })
      await page.locator('.world-stage').screenshot({
        path: path.join(ROOT, 'public', 'media', 'beatmind-world-still.jpg'),
        type: 'jpeg',
        quality: 78,
      })
      await hiddenChrome.evaluate((element) => element.remove())
    }
  }

  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    sceneCount: document.querySelectorAll('[data-scene]').length,
    endingCta: document.querySelector('#world-ending .world-deep-dive')?.textContent?.trim(),
    paperHandoff: Boolean(document.querySelector('.paper-handoff')),
  }))

  console.log(`${name}: ${metrics.sceneCount} scenes, overflow ${metrics.scrollWidth - metrics.clientWidth}px, ending ${metrics.endingCta ? 'present' : 'missing'}, paper ${metrics.paperHandoff ? 'present' : 'absent'}, errors ${errors.length}`)
  errors.forEach((error) => console.error(`  ${error}`))
  await context.close()
  return { errors, metrics }
}

async function captureNoJs(browser, origin) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(`${origin}${ENTRY}`, { waitUntil: 'load' })
  const result = await page.evaluate(() => ({
    scenes: document.querySelectorAll('[data-scene]').length,
    ending: Boolean(document.querySelector('#world-ending .world-deep-dive')),
    paper: Boolean(document.querySelector('.paper-handoff')),
    canvasVisible: getComputedStyle(document.querySelector('.world-stage')).display !== 'none',
  }))
  await page.screenshot({ path: path.join(OUT, 'phone-no-js.png'), fullPage: true })
  console.log(`no-js: ${result.scenes} scenes, ending ${result.ending ? 'present' : 'missing'}, paper ${result.paper ? 'present' : 'absent'}, canvas ${result.canvasVisible ? 'visible' : 'removed'}`)
  await context.close()
  return result
}

async function captureReduced(browser, origin) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'dark',
    reducedMotion: 'reduce',
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto(`${origin}${ENTRY}`, { waitUntil: 'commit' })
  await settle(page)
  const result = await page.evaluate(() => ({
    scenes: document.querySelectorAll('[data-scene]').length,
    activePlate: document.querySelectorAll('.foundry-plate.is-active').length,
    worldHeight: document.querySelector('[data-world]')?.getBoundingClientRect().height || 0,
  }))
  await page.screenshot({ path: path.join(OUT, 'desktop-reduced-motion.png') })
  console.log(`reduced-motion: ${result.scenes} scenes, ${result.activePlate} final plate, world ${Math.round(result.worldHeight)}px, errors ${errors.length}`)
  await context.close()
  return { errors, result }
}

await mkdir(OUT, { recursive: true })
const { server, origin } = await startServer()
const browser = await chromium.launch(chromiumLaunchOptions())

try {
  const results = []
  results.push(await captureWidth(browser, origin, 'phone-390', { width: 390, height: 844 }))
  results.push(await captureWidth(browser, origin, 'tablet-800', { width: 800, height: 900 }))
  results.push(await captureWidth(browser, origin, 'desktop-1440', { width: 1440, height: 900 }))
  const noJs = await captureNoJs(browser, origin)
  const reducedMotion = await captureReduced(browser, origin)

  const failed = results.some(({ errors, metrics }) => errors.length > 0 || metrics.scrollWidth > metrics.clientWidth)
    || results.some(({ metrics }) => !metrics.endingCta || metrics.paperHandoff)
    || !noJs.ending || noJs.paper || noJs.canvasVisible || reducedMotion.errors.length > 0 || reducedMotion.result.activePlate !== 1
  if (failed) process.exitCode = 1
} finally {
  await browser.close()
  await new Promise((resolve) => server.close(resolve))
}
