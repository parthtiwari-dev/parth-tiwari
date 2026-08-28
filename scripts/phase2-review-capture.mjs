/** Capture the lower landing-page sections that a first-frame screenshot cannot inspect. */

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
const output = path.resolve('.shots', argOf('--tag', 'phase2-sections'))
const directions = ['a', 'b', 'c']
const viewports = [
  { name: 'phone-390', width: 390, height: 844, touch: true, scale: 2 },
  { name: 'desktop-1440', width: 1440, height: 900, touch: false, scale: 1 },
]
const sections = [
  ['about', '#about'],
  ['projects', '#projects'],
  ['notes', '#notes'],
  ['contact', '#contact'],
]

await mkdir(output, { recursive: true })
const browser = await chromium.launch(chromiumLaunchOptions())
let failures = 0

for (const direction of directions) {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: viewport.scale,
      hasTouch: viewport.touch,
      isMobile: viewport.touch,
      reducedMotion: 'reduce',
    })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    const response = await page.goto(`${base}/review/phase-2/${direction}/`, { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)

    await page.addStyleTag({ content: '.review-rail, .skip-link { display: none !important; }' })

    const state = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      displayFont: getComputedStyle(document.querySelector('h1')).fontFamily,
      bodyFont: getComputedStyle(document.body).fontFamily,
    }))

    if (!response?.ok() || state.overflow > 1 || errors.length > 0) {
      failures += 1
      console.log(`FAIL ${direction.toUpperCase()} ${viewport.name}: status=${response?.status() ?? 'none'} overflow=${state.overflow}px errors=${errors.join(' | ')}`)
    } else {
      console.log(`PASS ${direction.toUpperCase()} ${viewport.name}: ${state.displayFont} / ${state.bodyFont}`)
    }

    const directionOutput = path.join(output, direction)
    await mkdir(directionOutput, { recursive: true })
    for (const [name, selector] of sections) {
      const section = page.locator(selector)
      await section.screenshot({ path: path.join(directionOutput, `${viewport.name}-${name}.png`) })
    }

    await context.close()
  }
}

await browser.close()
console.log(`Section screenshots: ${output}`)
process.exit(failures === 0 ? 0 : 1)
