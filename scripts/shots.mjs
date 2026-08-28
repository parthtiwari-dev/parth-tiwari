/** Capture the real first frame at the three required review widths. */

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
const tag = argOf('--tag', 'now')
const output = path.resolve('.shots', tag)
const viewports = [
  { name: 'phone-390', width: 390, height: 844, touch: true, scale: 3 },
  { name: 'tablet-800', width: 800, height: 1000, touch: true, scale: 2 },
  { name: 'desktop-1440', width: 1440, height: 900, touch: false, scale: 1 },
]

await mkdir(output, { recursive: true })
const browser = await chromium.launch(chromiumLaunchOptions())
let failures = 0

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: viewport.scale,
    hasTouch: viewport.touch,
    isMobile: viewport.touch,
  })
  const page = await context.newPage()
  const errors = []

  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`)
  })
  page.on('requestfailed', (request) => {
    errors.push(`request: ${request.failure()?.errorText ?? 'failed'} ${request.url()}`)
  })

  const response = await page.goto(`${base}/`, { waitUntil: 'load', timeout: 45_000 })
  if (!response?.ok()) errors.push(`response: ${response?.status() ?? 'missing'}`)
  await page.screenshot({ path: path.join(output, `${viewport.name}.png`) })

  if (errors.length === 0) {
    console.log(`PASS ${viewport.name}: clean first frame`)
  } else {
    failures += errors.length
    console.log(`FAIL ${viewport.name}: ${errors.join(' | ')}`)
  }

  await context.close()
}

await browser.close()
console.log(`Screenshots: ${output}`)
process.exit(failures === 0 ? 0 : 1)
