/**
 * Full-site screenshot audit for the 2026-09-01 review.
 *
 * Not a gate. This drives a dense visual pass: every route at the three review
 * widths (full page + segmented scroll), the landing unfurl loading animation as
 * a frame sequence, and the two standalone design/directions worlds
 * (BeatMind Sound Foundry, Vivid Story Loom) as scroll frame sequences.
 *
 *   node scripts/audit-capture.mjs --base http://127.0.0.1:4321 --tag full-audit-2026-09-01
 *
 * The Astro routes are read from a running `astro preview` (built output). The
 * worlds are served from a throwaway static server rooted at the repo so their
 * relative asset paths resolve.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import path from 'node:path'
import { chromium } from 'playwright'
import { chromiumLaunchOptions } from './browser.mjs'

const args = process.argv.slice(2)
const argOf = (flag, fallback) => {
  const i = args.indexOf(flag)
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback
}

const BASE = argOf('--base', 'http://127.0.0.1:4321').replace(/\/$/, '')
const TAG = argOf('--tag', 'full-audit')
const ONLY = argOf('--only', '') // 'routes' | 'unfurl' | 'worlds' | ''
const OUT = path.resolve('.shots', TAG)
const ROOT = process.cwd()

const VIEWPORTS = [
  { name: 'phone-390', width: 390, height: 844, dsf: 2, touch: true },
  { name: 'tablet-800', width: 800, height: 1000, dsf: 1, touch: true },
  { name: 'desktop-1440', width: 1440, height: 900, dsf: 1, touch: false },
]

// [slug, path, segmented?]
const ROUTES = [
  ['home', '/', true],
  ['work', '/work/', true],
  ['work-beatmind', '/work/beatmind/', true],
  ['work-vivid', '/work/vivid/', true],
  ['work-tathya', '/work/tathya/', false],
  ['work-medrag', '/work/medrag/', false],
  ['work-order-supervisor', '/work/order-supervisor/', false],
  ['work-querypilot', '/work/querypilot/', false],
  ['work-secondself', '/work/secondself/', false],
  ['work-oncoverse', '/work/oncoverse/', false],
  ['work-upi-fraud-engine', '/work/upi-fraud-engine/', false],
  ['work-spur-chat', '/work/spur-chat/', false],
  ['notes', '/notes/', true],
  ['notes-medrag', '/notes/medrag-refusal-is-a-feature/', false],
  ['notes-upi', '/notes/upi-two-precisions/', false],
  ['notes-beatmind', '/notes/beatmind-copyright-consent/', false],
  ['about', '/about/', true],
  ['resume', '/resume/', true],
  ['hire', '/hire/', true],
]

const MIME = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.png', 'image/png'],
  ['.webm', 'video/webm'],
  ['.svg', 'image/svg+xml'],
  ['.woff2', 'font/woff2'],
])

function startRootServer() {
  const server = createServer(async (req, res) => {
    try {
      let pathname = decodeURIComponent(new URL(req.url || '/', 'http://local').pathname)
      // beatmind-world.css asks for /fonts/*; map that to /public/fonts/*
      if (pathname.startsWith('/fonts/')) pathname = `/public${pathname}`
      if (pathname.startsWith('/media/')) pathname = `/public${pathname}`
      const resolved = path.resolve(ROOT, `.${pathname}`)
      if (!resolved.startsWith(ROOT + path.sep)) return res.writeHead(403).end('no')
      const body = await readFile(resolved)
      res.writeHead(200, { 'content-type': MIME.get(path.extname(resolved)) || 'application/octet-stream', 'cache-control': 'no-store' })
      res.end(body)
    } catch {
      res.writeHead(404).end('not found')
    }
  })
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address()
      resolve({ server, origin: `http://127.0.0.1:${port}` })
    })
  })
}

async function settle(page, ms = 350) {
  try { await page.waitForLoadState('networkidle', { timeout: 8000 }) } catch {}
  try { await page.evaluate(() => document.fonts && document.fonts.ready) } catch {}
  await page.waitForTimeout(ms)
}

async function shot(page, file) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await page.screenshot({ path: file })
      return
    } catch (e) {
      if (attempt === 2) { console.log(`  shot failed ${path.basename(file)}: ${e.message}`); return }
      await page.waitForTimeout(300)
    }
  }
}

const report = []

async function captureRoute(browser, slug, route, segmented) {
  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.dsf,
      hasTouch: vp.touch,
      isMobile: vp.touch,
    })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
    page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`) })
    page.on('requestfailed', (r) => errors.push(`reqfail: ${r.failure()?.errorText} ${r.url()}`))

    let status = 0
    try {
      const resp = await page.goto(`${BASE}${route}`, { waitUntil: 'load', timeout: 45000 })
      status = resp?.status() ?? 0
    } catch (e) {
      errors.push(`goto: ${e.message}`)
    }
    await settle(page)
    // dismiss the one-shot unfurl intro so route shots aren't covered by it
    await page.evaluate(() => {
      const el = document.querySelector('.unfurl-intro')
      if (el) el.remove()
    })

    const metrics = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      scrollHeight: document.documentElement.scrollHeight,
      clientHeight: document.documentElement.clientHeight,
      title: document.title,
    }))

    const dir = path.join(OUT, 'routes', slug)
    await mkdir(dir, { recursive: true })
    await page.screenshot({ path: path.join(dir, `${vp.name}-full.png`), fullPage: true })

    if (segmented) {
      const step = Math.round(vp.height * 0.82)
      const maxY = Math.max(0, metrics.scrollHeight - vp.height)
      let y = 0
      let idx = 0
      while (idx < 18) {
        await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y)
        await page.waitForTimeout(180)
        await page.screenshot({ path: path.join(dir, `${vp.name}-seg${String(idx).padStart(2, '0')}.png`) })
        if (y >= maxY) break
        y = Math.min(y + step, maxY)
        idx += 1
      }
    }

    report.push({ slug, route, viewport: vp.name, status, overflow: metrics.overflow, scrollHeight: metrics.scrollHeight, errors })
    const flag = errors.length || metrics.overflow > 1 || status !== 200 ? 'FAIL' : 'ok'
    console.log(`${flag} ${slug} ${vp.name} status=${status} overflow=${metrics.overflow} h=${metrics.scrollHeight} err=${errors.length}`)
    await context.close()
  }
}

async function captureUnfurl(browser) {
  const widths = [
    { name: 'desktop-1440', width: 1440, height: 900 },
    { name: 'phone-390', width: 390, height: 844 },
  ]
  const stops = [0, 90, 160, 240, 340, 460, 620, 800, 1000, 1250, 1500, 1750, 2100, 2600]
  for (const w of widths) {
    const context = await browser.newContext({ viewport: { width: w.width, height: w.height }, deviceScaleFactor: 1 })
    const page = await context.newPage()
    const dir = path.join(OUT, 'unfurl')
    await mkdir(dir, { recursive: true })
    await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 45000 })
    await page.waitForTimeout(30)
    const start = Date.now()
    for (const target of stops) {
      const wait = target - (Date.now() - start)
      if (wait > 0) await page.waitForTimeout(wait)
      await shot(page, path.join(dir, `${w.name}-t${String(target).padStart(4, '0')}.png`))
    }
    // nav fold appearing after the hero
    await settle(page)
    await page.evaluate(() => {
      const s = document.querySelector('[data-nav-sentinel]')
      if (s) s.scrollIntoView()
      window.scrollBy(0, 24)
    })
    for (const t of [0, 120, 260, 420, 650]) {
      await page.waitForTimeout(t === 0 ? 0 : 130)
      await shot(page, path.join(dir, `${w.name}-navfold-t${String(t).padStart(4, '0')}.png`))
    }
    console.log(`ok unfurl ${w.name}`)
    await context.close()
  }
}

async function captureWorld(browser, origin, slug, entry) {
  const widths = [
    { name: 'desktop-1440', width: 1440, height: 900 },
    { name: 'phone-390', width: 390, height: 844 },
  ]
  for (const w of widths) {
    const context = await browser.newContext({ viewport: { width: w.width, height: w.height }, deviceScaleFactor: 1, colorScheme: 'dark' })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
    page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`) })
    page.on('requestfailed', (r) => errors.push(`reqfail: ${r.failure()?.errorText} ${r.url()}`))

    const dir = path.join(OUT, 'worlds', slug)
    await mkdir(dir, { recursive: true })
    await page.goto(`${origin}${entry}`, { waitUntil: 'load', timeout: 45000 })
    await settle(page, 600)

    const h = await page.evaluate(() => document.documentElement.scrollHeight)
    const steps = 16
    for (let i = 0; i <= steps; i++) {
      const top = Math.round((h - w.height) * (i / steps))
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), top)
      await page.waitForTimeout(420)
      await shot(page, path.join(dir, `${w.name}-seg${String(i).padStart(2, '0')}.png`))
    }
    console.log(`${errors.length ? 'FAIL' : 'ok'} world ${slug} ${w.name} h=${h} err=${errors.length}`)
    report.push({ slug: `world-${slug}`, route: entry, viewport: w.name, scrollHeight: h, errors })
    await context.close()
  }

  // reduced-motion + no-js final states at desktop
  for (const mode of ['reduced', 'nojs']) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      colorScheme: 'dark',
      reducedMotion: mode === 'reduced' ? 'reduce' : undefined,
      javaScriptEnabled: mode !== 'nojs',
    })
    const page = await context.newPage()
    const dir = path.join(OUT, 'worlds', slug)
    await page.goto(`${origin}${entry}`, { waitUntil: 'load', timeout: 45000 })
    await settle(page, 500)
    await shot(page, path.join(dir, `desktop-1440-${mode}.png`))
    console.log(`ok world ${slug} ${mode}`)
    await context.close()
  }
}

await mkdir(OUT, { recursive: true })
const browser = await chromium.launch(chromiumLaunchOptions())
const { server, origin } = await startRootServer()

try {
  if (!ONLY || ONLY === 'routes') {
    for (const [slug, route, segmented] of ROUTES) await captureRoute(browser, slug, route, segmented)
  }
  if (!ONLY || ONLY === 'unfurl') {
    await captureUnfurl(browser)
  }
  if (!ONLY || ONLY === 'worlds') {
    await captureWorld(browser, origin, 'beatmind-sound-foundry', '/design/directions/beatmind-world.html')
    await captureWorld(browser, origin, 'vivid-story-loom', '/design/directions/vivid-world.html')
  }
} finally {
  await writeFile(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2))
  await browser.close()
  await new Promise((r) => server.close(r))
}

const fails = report.filter((r) => (r.errors && r.errors.length) || r.overflow > 1 || (r.status && r.status !== 200))
console.log(`\n${report.length} captures, ${fails.length} flagged`)
for (const f of fails) console.log(`  ${f.slug} ${f.viewport}: overflow=${f.overflow} status=${f.status ?? '-'} ${(f.errors || []).join(' | ')}`)
console.log(`\nOutput: ${OUT}`)
