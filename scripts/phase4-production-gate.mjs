/** Verify the production paper preview, selected Sheet Fault transition, and route handoff. */

import { createServer } from 'node:http'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'
import { chromiumLaunchOptions } from './browser.mjs'

const root = process.cwd()
const dist = path.resolve('dist')
const output = path.resolve('.shots/phase4-production')
const routes = ['/', '/work/']
const viewports = [
  { name: 'phone-390', width: 390, height: 844, touch: true, scale: 2 },
  { name: 'tablet-800', width: 800, height: 1024, touch: true, scale: 1 },
  { name: 'desktop-1440', width: 1440, height: 900, touch: false, scale: 1 },
]
const contentTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.jpg', 'image/jpeg'],
  ['.png', 'image/png'],
  ['.webm', 'video/webm'],
  ['.woff2', 'font/woff2'],
  ['.xml', 'application/xml; charset=utf-8'],
])

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

const percentile = (values, share) => {
  const ordered = [...values].sort((left, right) => left - right)
  return ordered[Math.min(ordered.length - 1, Math.floor(ordered.length * share))] ?? 0
}

const browser = await chromium.launch(chromiumLaunchOptions())
const results = []
let failures = 0

try {
  for (const viewport of viewports) {
    for (const route of routes) {
      const routeName = route === '/' ? 'home' : 'work'
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: viewport.scale,
        hasTouch: viewport.touch,
        isMobile: viewport.touch,
      })
      const page = await context.newPage()
      const errors = []
      page.on('pageerror', (error) => errors.push(error.message))
      const response = await page.goto(`${base}${route}`, { waitUntil: 'load' })
      await page.evaluate(() => document.fonts.ready)
      if (route === '/') await page.waitForTimeout(1700)

      const link = page.locator('[data-paper-project]').first()
      await link.scrollIntoViewIfNeeded()
      await page.evaluate(() => document.querySelector('[data-paper-project]')?.scrollIntoView({ block: 'center' }))
      await page.waitForTimeout(100)
      const slug = await link.getAttribute('data-project-slug')

      // Keyboard focus must expose the same truthful preview immediately.
      await link.focus()
      await page.waitForTimeout(30)
      const focusState = await page.evaluate((expectedSlug) => ({
        active: document.querySelector('[data-project-preview][data-active="true"]')?.getAttribute('data-project-preview'),
        row: document.activeElement?.getAttribute('data-project-slug'),
        visible: document.querySelector('[data-project-transition-stage]')?.getAttribute('data-visible'),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      }), slug)
      await page.screenshot({ path: path.join(output, `${viewport.name}-${routeName}-focus.png`) })

      if (viewport.touch) {
        await page.evaluate(() => (document.activeElement instanceof HTMLElement ? document.activeElement.blur() : undefined))
        await page.evaluate(() => window.scrollBy(0, 2))
        await page.waitForTimeout(120)
      } else {
        await link.hover()
        await page.waitForTimeout(210)
      }
      const pointerState = await page.evaluate((expectedSlug) => ({
        active: document.querySelector('[data-project-preview][data-active="true"]')?.getAttribute('data-project-preview'),
        row: document.querySelector('[data-paper-project][data-preview-active="true"]')?.getAttribute('data-project-slug'),
      }), slug)
      await page.screenshot({ path: path.join(output, `${viewport.name}-${routeName}-preview.png`) })

      await page.evaluate(() => {
        window.__paperWorldTestHold = true
        window.__phase4FrameDeltas = []
        let previous
        const started = performance.now()
        const tick = (now) => {
          if (previous !== undefined) window.__phase4FrameDeltas.push(now - previous)
          previous = now
          if (now - started < 540) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
        document.querySelector('[data-paper-project]')?.click()
      })
      await page.waitForTimeout(240)
      await page.screenshot({ path: path.join(output, `${viewport.name}-${routeName}-fault-mid.png`) })
      await page.waitForTimeout(330)
      const transitionState = await page.evaluate(() => ({
        stage: document.documentElement.dataset.paperWorldStage,
        frames: window.__phase4FrameDeltas ?? [],
        pieces: document.querySelectorAll('.paper-fault-panel').length,
      }))
      await page.screenshot({ path: path.join(output, `${viewport.name}-${routeName}-fault-final.png`) })
      const p95 = percentile(transitionState.frames, .95)
      const max = Math.max(...transitionState.frames)
      const over33 = transitionState.frames.filter((delta) => delta > 33.4).length
      const pass = response?.ok()
        && slug
        && focusState.active === slug
        && focusState.row === slug
        && focusState.visible === 'true'
        && focusState.overflow <= 1
        && pointerState.active === slug
        && pointerState.row === slug
        && transitionState.stage === 'open'
        && transitionState.pieces === 2
        && p95 <= 34
        && errors.length === 0
      console.log(`${pass ? 'PASS' : 'FAIL'} ${viewport.name} ${routeName}: slug=${slug} focus=${JSON.stringify(focusState)} pointer=${JSON.stringify(pointerState)} stage=${transitionState.stage || 'none'} pieces=${transitionState.pieces} p95=${p95.toFixed(1)}ms max=${max.toFixed(1)}ms >33ms=${over33} overflow=${focusState.overflow}px errors=${errors.join(' | ') || 'none'}`)
      if (!pass) failures += 1
      results.push({ viewport: viewport.name, route, slug, p95, max, over33, pass })
      const interruptedReset = await page.evaluate(() => {
        window.__paperWorldTransition?.reset()
        return {
          rootStage: document.documentElement.dataset.paperWorldStage ?? null,
          stageVisible: document.querySelector('[data-project-transition-stage]')?.hasAttribute('data-visible') ?? false,
          activePreview: document.querySelector('[data-project-preview][data-active="true"]')?.getAttribute('data-project-preview') ?? null,
          panels: document.querySelectorAll('.paper-fault-panel').length,
        }
      })
      const interruptedPass = interruptedReset.rootStage === null
        && interruptedReset.stageVisible === false
        && interruptedReset.activePreview === null
        && interruptedReset.panels === 0
      console.log(`${interruptedPass ? 'PASS' : 'FAIL'} ${viewport.name} ${routeName} interrupted reset: ${JSON.stringify(interruptedReset)}`)
      if (!interruptedPass) failures += 1
      await context.close()

      // A real navigation must focus the destination heading, and Back must restore the row.
      const navigationContext = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } })
      const navigationPage = await navigationContext.newPage()
      await navigationPage.goto(`${base}${route}`, { waitUntil: 'load' })
      if (route === '/') await navigationPage.waitForTimeout(1700)
      const navigationLink = navigationPage.locator('[data-paper-project]').first()
      const navigationSlug = await navigationLink.getAttribute('data-project-slug')
      const navigationHref = await navigationLink.getAttribute('href')
      await navigationLink.scrollIntoViewIfNeeded()
      const sourceScrollY = await navigationPage.evaluate(() => window.scrollY)
      await navigationLink.press('Enter', { noWaitAfter: true })
      await navigationPage.waitForURL(`**${navigationHref}`)
      await navigationPage.waitForTimeout(60)
      const destinationFocus = await navigationPage.evaluate(() => document.activeElement?.id)
      await navigationPage.goBack({ waitUntil: 'load' })
      if (route === '/') await navigationPage.waitForTimeout(1700)
      await navigationPage.waitForTimeout(60)
      const returnState = await navigationPage.evaluate(() => ({
        focus: document.activeElement?.getAttribute('data-project-slug') ?? null,
        scrollY: window.scrollY,
        rootStage: document.documentElement.dataset.paperWorldStage ?? null,
        stageVisible: document.querySelector('[data-project-transition-stage]')?.hasAttribute('data-visible') ?? false,
        activePreview: document.querySelector('[data-project-preview][data-active="true"]')?.getAttribute('data-project-preview') ?? null,
        panels: document.querySelectorAll('.paper-fault-panel').length,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      }))
      const navigationPass = ['case-title', 'world-title'].includes(destinationFocus)
        && returnState.focus === navigationSlug
        && Math.abs(returnState.scrollY - sourceScrollY) <= 2
        && returnState.rootStage === null
        && returnState.stageVisible === false
        && returnState.activePreview === null
        && returnState.panels === 0
        && returnState.overflow <= 1
      console.log(`${navigationPass ? 'PASS' : 'FAIL'} ${viewport.name} ${routeName} route: destinationFocus=${destinationFocus || 'none'} sourceScroll=${sourceScrollY} return=${JSON.stringify(returnState)}`)
      if (!navigationPass) failures += 1
      await navigationContext.close()

      // Reduced motion must use the real URL without asking View Transitions to run.
      const reducedContext = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        reducedMotion: 'reduce',
      })
      const reducedPage = await reducedContext.newPage()
      const transitionCalls = []
      reducedPage.on('console', (message) => {
        if (message.text() === '__PHASE4_VIEW_TRANSITION_CALLED__') transitionCalls.push(message.text())
      })
      await reducedPage.goto(`${base}${route}`, { waitUntil: 'load' })
      await reducedPage.evaluate(() => {
        const original = document.startViewTransition?.bind(document)
        if (!original) return
        document.startViewTransition = (...args) => {
          console.log('__PHASE4_VIEW_TRANSITION_CALLED__')
          return original(...args)
        }
      })
      const reducedLink = reducedPage.locator('[data-paper-project]').first()
      const reducedHref = await reducedLink.getAttribute('href')
      const reducedStarted = Date.now()
      await reducedLink.click({ noWaitAfter: true })
      await reducedPage.waitForURL(`**${reducedHref}`)
      const reducedElapsed = Date.now() - reducedStarted
      // This times the complete local document navigation, not added decorative motion.
      // The behavioral contract is zero transition calls; 700ms avoids treating local I/O as animation.
      const reducedPass = transitionCalls.length === 0 && reducedElapsed < 700
      console.log(`${reducedPass ? 'PASS' : 'FAIL'} ${viewport.name} ${routeName} reduced: transitionCalls=${transitionCalls.length} elapsed=${reducedElapsed}ms`)
      if (!reducedPass) failures += 1
      await reducedContext.close()

      // A failed enhancement must fall through to the real link destination.
      const failureContext = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } })
      const failurePage = await failureContext.newPage()
      await failurePage.goto(`${base}${route}`, { waitUntil: 'load' })
      if (route === '/') await failurePage.waitForTimeout(1700)
      await failurePage.evaluate(() => {
        Node.prototype.cloneNode = () => { throw new Error('__PHASE4_FORCED_CLONE_FAILURE__') }
      })
      const failureLink = failurePage.locator('[data-paper-project]').first()
      const failureHref = await failureLink.getAttribute('href')
      await failureLink.click({ noWaitAfter: true })
      await failurePage.waitForURL(`**${failureHref}`)
      const failurePass = await failurePage.locator('#case-title,#world-title').isVisible()
      console.log(`${failurePass ? 'PASS' : 'FAIL'} ${viewport.name} ${routeName} forced failure: destination=${failureHref}`)
      if (!failurePass) failures += 1
      await failureContext.close()

      // Without JavaScript, the same anchor remains crawlable and navigates normally.
      const noJsContext = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        javaScriptEnabled: false,
      })
      const noJsPage = await noJsContext.newPage()
      await noJsPage.goto(`${base}${route}`, { waitUntil: 'load' })
      const noJsLink = noJsPage.locator('[data-paper-project]').first()
      const noJsHref = await noJsLink.getAttribute('href')
      await Promise.all([
        noJsPage.waitForURL(`**${noJsHref}`),
        noJsLink.click(),
      ])
      const noJsPass = await noJsPage.locator('#case-title,#world-title').isVisible()
      console.log(`${noJsPass ? 'PASS' : 'FAIL'} ${viewport.name} ${routeName} no-JS: destination=${noJsHref}`)
      if (!noJsPass) failures += 1
      await noJsContext.close()
    }
  }
} finally {
  await browser.close()
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
}

await writeFile(path.join(output, 'metrics.json'), `${JSON.stringify(results, null, 2)}\n`)
console.log(`Phase 4 production evidence: ${output}`)
process.exit(failures === 0 ? 0 : 1)
