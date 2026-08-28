/** Small, explicit transfer baseline for the maintained Phase 2 root landing. */

import { chromium } from 'playwright'
import { chromiumLaunchOptions } from './browser.mjs'

const args = process.argv.slice(2)
const argOf = (flag, fallback) => {
  const index = args.indexOf(flag)
  return index !== -1 && args[index + 1] ? args[index + 1] : fallback
}
const base = argOf('--url', 'http://127.0.0.1:4321').replace(/\/$/, '')
const maxScriptBytes = Number(argOf('--max-script-kb', '30')) * 1024

const browser = await chromium.launch(chromiumLaunchOptions())
const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage()
const errors = []
page.on('pageerror', (error) => errors.push(error.message))
page.on('requestfailed', (request) => errors.push(`${request.failure()?.errorText} ${request.url()}`))

const response = await page.goto(`${base}/`, { waitUntil: 'load' })
const result = await page.evaluate(() => {
  const resources = performance.getEntriesByType('resource')
  const scripts = resources.filter((entry) => entry.initiatorType === 'script')
  const navigation = performance.getEntriesByType('navigation')[0]
  return {
    domContentLoadedMs: Math.round(navigation?.domContentLoadedEventEnd ?? 0),
    totalBytes: Math.round(resources.reduce((sum, entry) => sum + (entry.encodedBodySize || 0), 0)),
    scriptBytes: Math.round(scripts.reduce((sum, entry) => sum + (entry.encodedBodySize || 0), 0)),
    scriptCount: scripts.length,
  }
})

const checks = [
  ['page response is successful', response?.ok() === true],
  ['browser reports no load failure', errors.length === 0],
  [`script transfer is at most ${maxScriptBytes} bytes`, result.scriptBytes <= maxScriptBytes],
]
let failures = 0
for (const [label, condition] of checks) {
  console.log(`${condition ? 'PASS' : 'FAIL'} ${label}`)
  if (!condition) failures += 1
}
console.log(`INFO DOMContentLoaded ${result.domContentLoadedMs}ms`)
console.log(`INFO resource transfer ${result.totalBytes} bytes`)
console.log(`INFO scripts ${result.scriptCount} / ${result.scriptBytes} bytes`)
if (errors.length) console.log(`INFO errors ${errors.join(' | ')}`)

await browser.close()
process.exit(failures === 0 ? 0 : 1)
