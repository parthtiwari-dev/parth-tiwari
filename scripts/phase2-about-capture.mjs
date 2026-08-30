/** Capture and verify the Phase 2 About route. */

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
const output = path.resolve('.shots', argOf('--tag', 'phase2-about-review'))
const viewports = [
  { name: 'phone-390', width: 390, height: 844, touch: true },
  { name: 'tablet-800', width: 800, height: 1024, touch: true },
  { name: 'desktop-1440', width: 1440, height: 900, touch: false },
]

await mkdir(output, { recursive: true })
const browser = await chromium.launch(chromiumLaunchOptions())
let failures = 0

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, hasTouch: viewport.touch, isMobile: viewport.touch })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  const response = await page.goto(`${base}/about/`, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.addStyleTag({ content: '.skip-link { display: none !important; }' })
  const audit = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    h1: document.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim(),
    h1Count: document.querySelectorAll('h1').length,
    portraitCount: document.querySelectorAll('.about-portrait img[alt][width][height]').length,
    pathEntries: document.querySelectorAll('.path-ledger > li').length,
    workLines: document.querySelectorAll('.work-lines > li').length,
    rules: document.querySelectorAll('.rules-ledger > li').length,
    missingAlt: document.querySelectorAll('img:not([alt])').length,
    unnamedControls: [...document.querySelectorAll('a[href],button,input')].filter((element) => !((element.getAttribute('aria-label') || element.textContent || '').trim())).length,
    scripts: document.scripts.length,
  }))

  await page.screenshot({ path: path.join(output, `${viewport.name}-first-screen.png`) })
  await page.locator('.path-section').screenshot({ path: path.join(output, `${viewport.name}-path.png`) })
  await page.locator('.rules-section').screenshot({ path: path.join(output, `${viewport.name}-rules.png`) })

  const passed = response?.ok() && audit.overflow <= 1 && audit.h1 === 'Hi, I am Parth.' && audit.h1Count === 1
    && audit.portraitCount === 1 && audit.pathEntries === 3 && audit.workLines === 3 && audit.rules === 5
    && audit.missingAlt === 0 && audit.unnamedControls === 0 && audit.scripts === 0 && errors.length === 0
  console.log(`${passed ? 'PASS' : 'FAIL'} ${viewport.name}: status=${response?.status() ?? 'none'} overflow=${audit.overflow}px h1=${audit.h1Count} portrait=${audit.portraitCount} path=${audit.pathEntries} work=${audit.workLines} rules=${audit.rules} scripts=${audit.scripts} errors=${errors.join(' | ')}`)
  if (!passed) failures += 1
  await context.close()
}

const noScriptContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } })
const noScriptPage = await noScriptContext.newPage()
const noScriptResponse = await noScriptPage.goto(`${base}/about/`, { waitUntil: 'load' })
const noScript = await noScriptPage.evaluate(() => ({
  h1: document.querySelectorAll('h1').length,
  path: document.querySelectorAll('.path-ledger > li').length,
  work: document.querySelectorAll('.work-lines > li').length,
  rules: document.querySelectorAll('.rules-ledger > li').length,
}))
const noScriptPassed = noScriptResponse?.ok() && noScript.h1 === 1 && noScript.path === 3 && noScript.work === 3 && noScript.rules === 5
console.log(`${noScriptPassed ? 'PASS' : 'FAIL'} no-JavaScript: h1=${noScript.h1} path=${noScript.path} work=${noScript.work} rules=${noScript.rules}`)
if (!noScriptPassed) failures += 1
await noScriptContext.close()

await browser.close()
console.log(`About screenshots: ${output}`)
process.exit(failures === 0 ? 0 : 1)
