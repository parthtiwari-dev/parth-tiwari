/** Capture the Phase 2 /work register architecture and its real control states. */

import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'
import { chromiumLaunchOptions } from './browser.mjs'

const args = process.argv.slice(2)
const argOf = (flag, fallback) => {
  const index = args.indexOf(flag)
  return index !== -1 && args[index + 1] ? args[index + 1] : fallback
}
const base = argOf('--url', 'http://127.0.0.1:4321').replace(/\/$/, '')
const output = path.resolve('.shots', argOf('--tag', 'phase2-work-register'))
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
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  const response = await page.goto(`${base}/work/`, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.addStyleTag({ content: '.skip-link { display: none !important; }' })

  const state = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    rows: document.querySelectorAll('[data-project-row]').length,
    visible: document.querySelectorAll('[data-project-row]:not([hidden])').length,
    h1: document.querySelector('h1')?.textContent?.trim(),
    h1Count: document.querySelectorAll('h1').length,
    missingAlt: document.querySelectorAll('img:not([alt])').length,
    unnamedControls: [...document.querySelectorAll('a[href],button,input')].filter((element) => {
      const text = element.getAttribute('aria-label') || element.textContent || ''
      return !text.trim() && element.getAttribute('type') !== 'checkbox'
    }).length,
  }))

  await page.screenshot({ path: path.join(output, `${viewport.name}-first-screen.png`) })
  await page.mouse.move(1, 1)
  await page.locator('#work-register').screenshot({ path: path.join(output, `${viewport.name}-register-default.png`) })

  await page.locator('[data-active-filter]').check()
  const activeVisible = await page.locator('[data-project-row]:visible').count()
  await page.mouse.move(1, 1)
  await page.locator('#work-register').screenshot({ path: path.join(output, `${viewport.name}-register-active.png`) })

  await page.locator('[data-active-filter]').uncheck()
  await page.locator('[data-sort="recent"]').click()
  const firstRecent = await page.locator('[data-project-row]:visible').first().getAttribute('data-started')

  if (!viewport.touch) {
    const firstVisibleRow = page.locator('[data-project-row]:visible').first()
    await firstVisibleRow.evaluate((row) => row.classList.add('is-review-hover'))
    await firstVisibleRow.screenshot({ path: path.join(output, `${viewport.name}-row-hover.png`) })
  }

  const passed = response?.ok() && state.overflow <= 1 && state.rows === 12 && state.visible === 12
    && state.h1Count === 1 && state.missingAlt === 0 && state.unnamedControls === 0
    && activeVisible === 6 && firstRecent === '2026-07' && errors.length === 0
  console.log(`${passed ? 'PASS' : 'FAIL'} ${viewport.name}: status=${response?.status() ?? 'none'} overflow=${state.overflow}px rows=${state.rows} active=${activeVisible} recent=${firstRecent} errors=${errors.join(' | ')}`)
  if (!passed) failures += 1
  await context.close()
}

const noScriptContext = await browser.newContext({ javaScriptEnabled: false })
const noScriptPage = await noScriptContext.newPage()
await noScriptPage.goto(`${base}/work/`, { waitUntil: 'load' })
const noScript = await noScriptPage.evaluate(() => ({
  rows: document.querySelectorAll('[data-project-row]').length,
  controls: getComputedStyle(document.querySelector('[data-work-controls]')).display,
}))
const noScriptPassed = noScript.rows === 12 && noScript.controls === 'none'
console.log(`${noScriptPassed ? 'PASS' : 'FAIL'} no-JavaScript: rows=${noScript.rows} controls=${noScript.controls}`)
if (!noScriptPassed) failures += 1
await noScriptContext.close()

await browser.close()
console.log(`Work screenshots: ${output}`)
process.exit(failures === 0 ? 0 : 1)
