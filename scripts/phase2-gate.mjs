/** Prove the complete Phase 2 design-system and route-architecture gate. */

import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'
import { chromiumLaunchOptions } from './browser.mjs'

const args = process.argv.slice(2)
const argOf = (flag, fallback) => {
  const index = args.indexOf(flag)
  return index !== -1 && args[index + 1] ? args[index + 1] : fallback
}

const base = argOf('--url', 'http://127.0.0.1:4321').replace(/\/$/, '')
const output = path.resolve('.shots', argOf('--tag', 'phase2-gate'))
const part = argOf('--part', 'all')
if (!['all', 'render', 'states', 'contracts'].includes(part)) {
  throw new Error(`Unknown gate part "${part}". Use render, states or contracts.`)
}
const routes = [
  { name: 'home', path: '/' },
  { name: 'work', path: '/work/' },
  { name: 'case-study', path: '/work/beatmind/' },
  { name: 'notes', path: '/notes/' },
  { name: 'note-article', path: '/notes/querypilot-denominator/' },
  { name: 'about', path: '/about/' },
  { name: 'resume', path: '/resume/' },
  { name: 'hire', path: '/hire/' },
]
const viewports = [
  { name: 'phone-390', width: 390, height: 844, touch: true },
  { name: 'tablet-800', width: 800, height: 1024, touch: true },
  { name: 'desktop-1440', width: 1440, height: 900, touch: false },
]

const relativeLuminance = (hex) => {
  const channels = hex.match(/[a-f\d]{2}/gi).map((value) => Number.parseInt(value, 16) / 255)
    .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}
const contrast = (foreground, background) => {
  const first = relativeLuminance(foreground)
  const second = relativeLuminance(background)
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05)
}

await mkdir(output, { recursive: true })
const browser = await chromium.launch(chromiumLaunchOptions())
let failures = 0
const results = []

if (part === 'all' || part === 'render') for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    hasTouch: viewport.touch,
    isMobile: viewport.touch,
  })
  for (const route of routes) {
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    const response = await page.goto(`${base}${route.path}`, { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    await page.addStyleTag({ content: '.skip-link { display: none !important; } .unfurl-intro { display: none !important; }' })

    const audit = await page.evaluate(() => {
      const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
      const headingLevels = headings.map((heading) => Number(heading.tagName.slice(1)))
      const headingSkips = headingLevels.filter((level, index) => index > 0 && level > headingLevels[index - 1] + 1).length
      const controls = [...document.querySelectorAll('a[href],button,input,select,textarea,summary')]
      const mainText = document.querySelector('main')?.textContent?.replace(/\s+/g, ' ').trim() ?? ''
      return {
        lang: document.documentElement.lang,
        overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
        h1Count: document.querySelectorAll('h1').length,
        mainCount: document.querySelectorAll('main').length,
        mainTextLength: mainText.length,
        headingSkips,
        missingAlt: document.querySelectorAll('img:not([alt])').length,
        unnamedControls: controls.filter((element) => !((element.getAttribute('aria-label') || element.textContent || element.getAttribute('title') || '').trim())).length,
        canvas: document.querySelectorAll('canvas').length,
        displayFont: document.fonts.check('700 24px "Bricolage Grotesque"'),
        bodyFont: document.fonts.check('400 16px Archivo'),
        monoFont: document.fonts.check('400 12px "DM Mono"'),
      }
    })

    await page.screenshot({ path: path.join(output, `${viewport.name}-${route.name}.png`) })
    const passed = response?.ok() && audit.lang === 'en' && audit.overflow <= 1 && audit.h1Count === 1
      && audit.mainCount === 1 && audit.mainTextLength >= 180 && audit.headingSkips === 0
      && audit.missingAlt === 0 && audit.unnamedControls === 0 && audit.canvas === 0
      && audit.displayFont && audit.bodyFont && audit.monoFont && errors.length === 0
    results.push({ viewport: viewport.name, route: route.path, status: response?.status(), passed, ...audit, errors })
    console.log(`${passed ? 'PASS' : 'FAIL'} ${viewport.name} ${route.path}: status=${response?.status() ?? 'none'} overflow=${audit.overflow}px h1/main=${audit.h1Count}/${audit.mainCount} text=${audit.mainTextLength} headings=${audit.headingSkips} canvas=${audit.canvas} errors=${errors.length}`)
    if (!passed) failures += 1
    await page.close()
  }
  await context.close()
}

if (part === 'all' || part === 'states') {
const noScriptContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } })
for (const route of routes) {
  const page = await noScriptContext.newPage()
  const response = await page.goto(`${base}${route.path}`, { waitUntil: 'load' })
  const audit = await page.evaluate(() => ({
    h1Count: document.querySelectorAll('h1').length,
    mainTextLength: document.querySelector('main')?.textContent?.replace(/\s+/g, ' ').trim().length ?? 0,
    overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
  }))
  const passed = response?.ok() && audit.h1Count === 1 && audit.mainTextLength >= 180 && audit.overflow <= 1
  console.log(`${passed ? 'PASS' : 'FAIL'} no-JavaScript ${route.path}: h1=${audit.h1Count} text=${audit.mainTextLength} overflow=${audit.overflow}px`)
  if (!passed) failures += 1
  await page.close()
}
await noScriptContext.close()

const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
for (const route of routes) {
  const page = await reducedContext.newPage()
  await page.goto(`${base}${route.path}`, { waitUntil: 'load' })
  await page.waitForTimeout(80)
  const runningAnimations = await page.evaluate(() => document.getAnimations()
    .filter((animation) => animation.playState === 'running')
    .map((animation) => ({ duration: Number(animation.effect?.getComputedTiming().duration ?? Infinity), target: animation.effect?.target?.className ?? '' })))
  const passed = runningAnimations.every((animation) => animation.duration <= 1)
  console.log(`${passed ? 'PASS' : 'FAIL'} reduced-motion ${route.path}: running=${runningAnimations.length} meaningful=${runningAnimations.filter((animation) => animation.duration > 1).length}`)
  if (!passed) failures += 1
  await page.close()
}
await reducedContext.close()

const touchContext = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
for (const route of routes) {
  const page = await touchContext.newPage()
  await page.goto(`${base}${route.path}`, { waitUntil: 'load' })
  const menu = page.locator('.paper-mobile-menu').first()
  let passed = await menu.count() === 1
  if (passed) {
    if (route.path === '/') {
      await page.locator('[data-nav-sentinel]').scrollIntoViewIfNeeded()
      await page.evaluate(() => window.scrollBy(0, 8))
      await page.waitForTimeout(450)
    }
    await menu.locator('summary').click()
    const box = await menu.locator('nav').boundingBox()
    passed = Boolean(box && box.x >= -1 && box.x + box.width <= 391 && box.height > 0)
  }
  console.log(`${passed ? 'PASS' : 'FAIL'} touch-menu ${route.path}`)
  if (!passed) failures += 1
  await page.close()
}
await touchContext.close()

const keyboardContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
for (const route of routes) {
  const page = await keyboardContext.newPage()
  await page.goto(`${base}${route.path}`, { waitUntil: 'load' })
  await page.keyboard.press('Tab')
  const focus = await page.evaluate(() => ({
    className: document.activeElement?.className,
    outlineStyle: getComputedStyle(document.activeElement).outlineStyle,
    outlineWidth: getComputedStyle(document.activeElement).outlineWidth,
  }))
  const passed = String(focus.className).includes('skip-link') && focus.outlineStyle !== 'none' && focus.outlineWidth !== '0px'
  console.log(`${passed ? 'PASS' : 'FAIL'} keyboard-focus ${route.path}: ${focus.className} ${focus.outlineStyle}/${focus.outlineWidth}`)
  if (!passed) failures += 1
  await page.close()
}
await keyboardContext.close()
}

if (part === 'all' || part === 'contracts') {
const tokenContext = await browser.newContext()
const tokenPage = await tokenContext.newPage()
await tokenPage.goto(`${base}/`, { waitUntil: 'load' })
const tokens = await tokenPage.evaluate(() => {
  const styles = getComputedStyle(document.documentElement)
  const names = ['--paper', '--paper-light', '--ink', '--ink-secondary', '--ink-quiet', '--oxblood', '--void', '--world-ink', '--world-secondary']
  return Object.fromEntries(names.map((name) => [name, styles.getPropertyValue(name).trim()]))
})
await tokenContext.close()
const contrastPairs = [
  ['--ink', '--paper'], ['--ink-secondary', '--paper'], ['--ink-quiet', '--paper'], ['--oxblood', '--paper'],
  ['--world-ink', '--void'], ['--world-secondary', '--void'],
]
for (const [foreground, background] of contrastPairs) {
  const ratio = contrast(tokens[foreground], tokens[background])
  const passed = ratio >= 4.5
  console.log(`${passed ? 'PASS' : 'FAIL'} contrast ${foreground}/${background}: ${ratio.toFixed(2)}:1`)
  if (!passed) failures += 1
}

const notesContext = await browser.newContext()
const notesPage = await notesContext.newPage()
await notesPage.goto(`${base}/notes/`, { waitUntil: 'load' })
const comingSoon = await notesPage.evaluate(() => ({
  copy: /coming soon/i.test(document.body.textContent ?? ''),
  emptyPostCards: document.querySelectorAll('[data-writing-section] article').length,
}))
const notesPassed = comingSoon.copy && comingSoon.emptyPostCards === 0
console.log(`${notesPassed ? 'PASS' : 'FAIL'} writing-coming-soon: copy=${comingSoon.copy} emptyCards=${comingSoon.emptyPostCards}`)
if (!notesPassed) failures += 1
await notesContext.close()
}

await browser.close()

if (part === 'all' || part === 'contracts') {
const fontFiles = ['archivo-400.woff2', 'archivo-600.woff2', 'bricolage-grotesque-700.woff2', 'dm-mono-400.woff2']
const fontBytes = (await Promise.all(fontFiles.map((file) => stat(path.resolve('public/fonts', file))))).reduce((total, file) => total + file.size, 0)
const packageJson = JSON.parse(await readFile('package.json', 'utf8'))
const dependencyNames = Object.keys(packageJson.dependencies ?? {})
const sourceFiles = ['src/components/LandingPage.astro', 'src/components/WorkRegister.astro', 'src/components/CaseStudyReview.astro']
const source = (await Promise.all(sourceFiles.map((file) => readFile(file, 'utf8')))).join('\n')
const staticBoundary = dependencyNames.length === 1 && dependencyNames[0] === 'astro' && !/<canvas\b/i.test(source)
const fontsPassed = fontBytes === 55916
console.log(`${fontsPassed ? 'PASS' : 'FAIL'} font-budget: ${fontBytes} bytes`)
console.log(`${staticBoundary ? 'PASS' : 'FAIL'} static-boundary: dependencies=${dependencyNames.join(',')} sourceCanvas=${/<canvas\b/i.test(source)}`)
if (!fontsPassed) failures += 1
if (!staticBoundary) failures += 1

await readFile('src/styles/paper-system.css', 'utf8').then((css) => {
  const requiredTokens = ['--paper:', '--ink:', '--font-display:', '--space-4:', '--grid-content:', '--focus-color:', '--duration-default:', '--world-ink:']
  const missing = requiredTokens.filter((token) => !css.includes(token))
  const passed = missing.length === 0
  console.log(`${passed ? 'PASS' : 'FAIL'} token-contract: missing=${missing.join(',') || 'none'}`)
  if (!passed) failures += 1
})
}

await writeFile(path.resolve(output, `${part}-results.json`), `${JSON.stringify({ base, part, failures, results }, null, 2)}\n`)

console.log(`Phase 2 gate screenshots: ${output}`)
console.log(`${failures === 0 ? `PHASE 2 ${part.toUpperCase()} GATE PASSED` : `PHASE 2 ${part.toUpperCase()} GATE FAILED (${failures})`}`)
process.exit(failures === 0 ? 0 : 1)
