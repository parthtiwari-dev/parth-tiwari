/** Capture and check the Phase 2 BeatMind case-study structure. */

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
const output = path.resolve('.shots', argOf('--tag', 'phase2-beatmind-case'))
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
  const response = await page.goto(`${base}/work/beatmind/`, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.addStyleTag({ content: '.skip-link { display: none !important; }' })

  const state = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    h1: document.querySelector('h1')?.textContent?.trim(),
    h1Count: document.querySelectorAll('h1').length,
    chapters: document.querySelectorAll('[data-case-chapter]').length,
    measurements: document.querySelectorAll('.measurement-ledger article').length,
    missingAlt: document.querySelectorAll('img:not([alt])').length,
    unnamedControls: [...document.querySelectorAll('a[href],button')].filter((element) => {
      const name = element.getAttribute('aria-label') || element.textContent || ''
      return !name.trim()
    }).length,
    audioDisabled: document.querySelector('.case-audio-invitation button')?.hasAttribute('disabled'),
  }))

  await page.screenshot({ path: path.join(output, `${viewport.name}-arrival.png`) })
  await page.locator('#case-reading').screenshot({ path: path.join(output, `${viewport.name}-reading.png`) })
  await page.locator('#architecture').screenshot({ path: path.join(output, `${viewport.name}-architecture.png`) })
  await page.locator('#measurement').screenshot({ path: path.join(output, `${viewport.name}-measurement.png`) })
  await page.locator('#what-broke').screenshot({ path: path.join(output, `${viewport.name}-erratum.png`) })
  await page.locator('.case-ending').screenshot({ path: path.join(output, `${viewport.name}-ending.png`) })

  await page.locator('#measurement').scrollIntoViewIfNeeded()
  const progress = await page.locator('progress').first().evaluate((element) => element.value)
  const passed = response?.ok() && state.overflow <= 1 && state.h1 === 'BeatMind'
    && state.h1Count === 1 && state.chapters === 7 && state.measurements === 2
    && state.missingAlt === 0 && state.unnamedControls === 0 && state.audioDisabled
    && progress > 0 && errors.length === 0
  console.log(`${passed ? 'PASS' : 'FAIL'} ${viewport.name}: status=${response?.status() ?? 'none'} overflow=${state.overflow}px chapters=${state.chapters} measurements=${state.measurements} progress=${progress.toFixed(1)} errors=${errors.join(' | ')}`)
  if (!passed) failures += 1
  await context.close()
}

const noScriptContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } })
const noScriptPage = await noScriptContext.newPage()
const noScriptResponse = await noScriptPage.goto(`${base}/work/beatmind/`, { waitUntil: 'load' })
const noScript = await noScriptPage.evaluate(() => ({
  chapters: document.querySelectorAll('[data-case-chapter]').length,
  measurements: document.querySelectorAll('.measurement-ledger article').length,
  links: document.querySelectorAll('.case-ending a[href]').length,
  stills: document.querySelectorAll('img[alt]').length,
}))
const noScriptPassed = noScriptResponse?.ok() && noScript.chapters === 7 && noScript.measurements === 2
  && noScript.links >= 6 && noScript.stills === 2
console.log(`${noScriptPassed ? 'PASS' : 'FAIL'} no-JavaScript: chapters=${noScript.chapters} measurements=${noScript.measurements} endingLinks=${noScript.links} stills=${noScript.stills}`)
if (!noScriptPassed) failures += 1
await noScriptContext.close()

await browser.close()
console.log(`Case-study screenshots: ${output}`)
process.exit(failures === 0 ? 0 : 1)
