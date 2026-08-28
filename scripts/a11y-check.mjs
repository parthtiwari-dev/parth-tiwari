/** Dependency-free browser assertions for the static accessibility baseline. */

import { chromium } from 'playwright'
import { chromiumLaunchOptions } from './browser.mjs'

const args = process.argv.slice(2)
const urlIndex = args.indexOf('--url')
const base = (urlIndex !== -1 && args[urlIndex + 1]
  ? args[urlIndex + 1]
  : 'http://127.0.0.1:4321').replace(/\/$/, '')
const viewports = [
  { name: '390', width: 390, height: 844, touch: true },
  { name: '800', width: 800, height: 1000, touch: true },
  { name: '1440', width: 1440, height: 900, touch: false },
]

const browser = await chromium.launch(chromiumLaunchOptions())
let failures = 0
const check = (label, condition, detail = '') => {
  console.log(`${condition ? 'PASS' : 'FAIL'} ${label}${detail ? `: ${detail}` : ''}`)
  if (!condition) failures += 1
}

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    hasTouch: viewport.touch,
    isMobile: viewport.touch,
  })
  const page = await context.newPage()
  const pageErrors = []
  page.on('pageerror', (error) => pageErrors.push(error.message))

  const response = await page.goto(`${base}/`, { waitUntil: 'load' })
  const audit = await page.evaluate(() => {
    const headingLevels = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
      .map((heading) => Number(heading.tagName.slice(1)))
    const headingSkips = headingLevels.filter((level, index) =>
      index > 0 && level - headingLevels[index - 1] > 1)
    const unnamedControls = [...document.querySelectorAll('a[href],button,input,select,textarea')]
      .filter((element) => {
        const labelledBy = element.getAttribute('aria-labelledby')
        const labelledText = labelledBy
          ? document.getElementById(labelledBy)?.textContent
          : ''
        const label = element.id
          ? document.querySelector(`label[for="${element.id}"]`)?.textContent
          : ''
        return !(element.getAttribute('aria-label') || labelledText || label
          || element.getAttribute('alt') || element.textContent || '').trim()
      })
    return {
      language: document.documentElement.lang,
      mainCount: document.querySelectorAll('main').length,
      h1Count: document.querySelectorAll('h1').length,
      headingSkips: headingSkips.length,
      missingAlt: document.querySelectorAll('img:not([alt])').length,
      unnamedControls: unnamedControls.length,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }
  })

  check(`${viewport.name} returns HTML`, response?.ok() === true, `${response?.status() ?? 'no response'}`)
  check(`${viewport.name} has no page error`, pageErrors.length === 0, pageErrors.join(' | '))
  check(`${viewport.name} declares a language`, Boolean(audit.language), audit.language)
  check(`${viewport.name} has one main landmark`, audit.mainCount === 1, String(audit.mainCount))
  check(`${viewport.name} has one h1`, audit.h1Count === 1, String(audit.h1Count))
  check(`${viewport.name} has no heading skip`, audit.headingSkips === 0, String(audit.headingSkips))
  check(`${viewport.name} images declare alt`, audit.missingAlt === 0, String(audit.missingAlt))
  check(`${viewport.name} controls are named`, audit.unnamedControls === 0, String(audit.unnamedControls))
  check(`${viewport.name} has no horizontal overflow`, audit.overflow <= 1, `${audit.overflow}px`)
  await context.close()
}

await browser.close()
process.exit(failures === 0 ? 0 : 1)
