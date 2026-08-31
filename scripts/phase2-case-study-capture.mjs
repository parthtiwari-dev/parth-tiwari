/** Capture and check any validated paper case-study route. */

import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'
import { chromiumLaunchOptions } from './browser.mjs'

const args = process.argv.slice(2)
const argOf = (flag, fallback) => {
  const index = args.indexOf(flag)
  return index !== -1 && args[index + 1] ? args[index + 1] : fallback
}
const base = argOf('--url', 'http://127.0.0.1:4323').replace(/\/$/, '')
const slug = argOf('--slug', 'beatmind')
const expectedTitle = argOf('--title', slug === 'beatmind' ? 'BeatMind' : slug.charAt(0).toUpperCase() + slug.slice(1))
const output = path.resolve('.shots', argOf('--tag', `${slug}-case`))
const viewports = [
  { name: 'phone-390', width: 390, height: 844, touch: true },
  { name: 'tablet-800', width: 800, height: 1024, touch: true },
  { name: 'desktop-1440', width: 1440, height: 900, touch: false },
]

await mkdir(output, { recursive: true })
const browser = await chromium.launch(chromiumLaunchOptions())
let failures = 0

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    hasTouch: viewport.touch,
    isMobile: viewport.touch,
    reducedMotion: 'no-preference',
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  const response = await page.goto(`${base}/work/${slug}/`, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; } .skip-link { display: none !important; }' })

  const state = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    h1: document.querySelector('h1')?.textContent?.trim(),
    h1Count: document.querySelectorAll('h1').length,
    chapters: document.querySelectorAll('[data-case-chapter]').length,
    measurements: document.querySelectorAll('.measurement-ledger article').length,
    videos: document.querySelectorAll('video source[type="video/webm"]').length,
    proofs: document.querySelectorAll('[data-proof-surface]').length,
    workflowSteps: document.querySelectorAll('[data-workflow-step]').length,
    records: document.querySelectorAll('[data-evidence-record]').length,
    videosWithoutPoster: document.querySelectorAll('video:not([poster])').length,
    videosWithoutControls: document.querySelectorAll('video:not([controls])').length,
    missingAlt: document.querySelectorAll('img:not([alt])').length,
    unnamedControls: [...document.querySelectorAll('a[href],button')].filter((element) => {
      const name = element.getAttribute('aria-label') || element.textContent || ''
      return !name.trim()
    }).length,
    darkHero: document.querySelectorAll('.case-world').length,
    paperSurface: document.querySelectorAll('.case-paper').length,
  }))

  const captureViewport = async (selector, label) => {
    const offset = viewport.width <= 820 ? 145 : 100
    await page.locator(selector).evaluate((element, scrollOffset) => {
      window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY - scrollOffset)
    }, offset)
    await page.waitForTimeout(120)
    await page.screenshot({ path: path.join(output, `${viewport.name}-${label}.png`) })
  }

  await page.screenshot({ path: path.join(output, `${viewport.name}-arrival.png`) })
  await captureViewport('#product-demo', 'product-demo')
  await captureViewport('#research', 'research')
  await captureViewport('#architecture', 'architecture')
  await captureViewport('#evidence', 'evidence')
  await captureViewport('#failures', 'failures')
  await captureViewport('#limits', 'limits')
  await captureViewport('.case-ending', 'ending')

  await page.locator('#evidence').evaluate((element, scrollOffset) => {
    window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY - scrollOffset)
  }, viewport.width <= 820 ? 145 : 100)
  await page.waitForTimeout(120)
  const progress = await page.locator('progress').first().evaluate((element) => element.value)
  const passed = response?.ok() && state.overflow <= 1 && state.h1 === expectedTitle
    && state.h1Count === 1 && state.chapters === 10 && state.measurements >= 1
    && state.proofs === 4 && state.workflowSteps === 3 && state.missingAlt === 0
    && state.videosWithoutPoster === 0 && state.videosWithoutControls === 0
    && state.unnamedControls === 0 && state.darkHero === 0 && state.paperSurface === 1
    && progress > 0 && errors.length === 0
  console.log(`${passed ? 'PASS' : 'FAIL'} ${viewport.name}: status=${response?.status() ?? 'none'} overflow=${state.overflow}px chapters=${state.chapters} measurements=${state.measurements} proofs=${state.proofs} records=${state.records} progress=${progress.toFixed(1)} errors=${errors.join(' | ')}`)
  if (!passed) failures += 1
  await context.close()
}

const noScriptContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } })
const noScriptPage = await noScriptContext.newPage()
const noScriptResponse = await noScriptPage.goto(`${base}/work/${slug}/`, { waitUntil: 'load' })
const noScript = await noScriptPage.evaluate(() => ({
  chapters: document.querySelectorAll('[data-case-chapter]').length,
  measurements: document.querySelectorAll('.measurement-ledger article').length,
  links: document.querySelectorAll('.case-ending a[href]').length,
  stills: document.querySelectorAll('img[alt]').length,
  videos: document.querySelectorAll('video source[type="video/webm"]').length,
  proofs: document.querySelectorAll('[data-proof-surface]').length,
  records: document.querySelectorAll('[data-evidence-record]').length,
  darkHero: document.querySelectorAll('.case-world').length,
}))
const noScriptPassed = noScriptResponse?.ok() && noScript.chapters === 10 && noScript.measurements >= 1
  && noScript.links >= 3 && noScript.proofs === 4 && noScript.darkHero === 0
console.log(`${noScriptPassed ? 'PASS' : 'FAIL'} no-JavaScript: chapters=${noScript.chapters} measurements=${noScript.measurements} endingLinks=${noScript.links} stills=${noScript.stills} videos=${noScript.videos} proofs=${noScript.proofs} records=${noScript.records}`)
if (!noScriptPassed) failures += 1
await noScriptContext.close()

const reducedContext = await browser.newContext({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
  reducedMotion: 'reduce',
})
const reducedPage = await reducedContext.newPage()
const reducedErrors = []
reducedPage.on('pageerror', (error) => reducedErrors.push(error.message))
const reducedResponse = await reducedPage.goto(`${base}/work/${slug}/`, { waitUntil: 'load' })
const reduced = await reducedPage.evaluate(() => ({
  preference: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  chapters: document.querySelectorAll('[data-case-chapter]').length,
  proofs: document.querySelectorAll('[data-proof-surface]').length,
}))
const reducedPassed = reducedResponse?.ok() && reduced.preference && reduced.overflow <= 1
  && reduced.chapters === 10 && reduced.proofs === 4 && reducedErrors.length === 0
console.log(`${reducedPassed ? 'PASS' : 'FAIL'} reduced-motion: overflow=${reduced.overflow}px chapters=${reduced.chapters} proofs=${reduced.proofs} errors=${reducedErrors.join(' | ')}`)
if (!reducedPassed) failures += 1
await reducedContext.close()

const keyboardContext = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const keyboardPage = await keyboardContext.newPage()
const keyboardResponse = await keyboardPage.goto(`${base}/work/${slug}/`, { waitUntil: 'load' })
await keyboardPage.keyboard.press('Tab')
const keyboard = await keyboardPage.evaluate(() => {
  const active = document.activeElement
  const bounds = active?.getBoundingClientRect()
  const style = active ? getComputedStyle(active) : null
  return {
    name: active?.getAttribute('aria-label') || active?.textContent?.trim() || '',
    visible: Boolean(bounds && bounds.width > 0 && bounds.height > 0
      && bounds.bottom > 0 && bounds.right > 0
      && bounds.top < window.innerHeight && bounds.left < window.innerWidth),
    styled: Boolean(style && (style.outlineStyle !== 'none' || style.boxShadow !== 'none')),
  }
})
const keyboardPassed = keyboardResponse?.ok() && keyboard.visible && keyboard.styled && keyboard.name.length > 0
console.log(`${keyboardPassed ? 'PASS' : 'FAIL'} keyboard-focus: name=${JSON.stringify(keyboard.name)} visible=${keyboard.visible} styled=${keyboard.styled}`)
if (!keyboardPassed) failures += 1
await keyboardContext.close()

const printContext = await browser.newContext({ viewport: { width: 800, height: 1024 } })
const printPage = await printContext.newPage()
const printResponse = await printPage.goto(`${base}/work/${slug}/`, { waitUntil: 'load' })
await printPage.emulateMedia({ media: 'print', colorScheme: 'light' })
const printState = await printPage.evaluate(() => ({
  overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  chapters: document.querySelectorAll('[data-case-chapter]').length,
  proofs: document.querySelectorAll('[data-proof-surface]').length,
}))
await printPage.screenshot({ path: path.join(output, 'print-800.png'), fullPage: true })
const printPassed = printResponse?.ok() && printState.overflow <= 1
  && printState.chapters === 10 && printState.proofs === 4
console.log(`${printPassed ? 'PASS' : 'FAIL'} print: overflow=${printState.overflow}px chapters=${printState.chapters} proofs=${printState.proofs}`)
if (!printPassed) failures += 1
await printContext.close()

await browser.close()
console.log(`Case-study screenshots: ${output}`)
process.exit(failures === 0 ? 0 : 1)
