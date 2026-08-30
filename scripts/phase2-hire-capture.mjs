/** Capture and verify the Phase 2 Hire route. */

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
const output = path.resolve('.shots', argOf('--tag', 'phase2-hire-review'))
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
  const response = await page.goto(`${base}/hire/`, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.addStyleTag({ content: '.skip-link { display: none !important; }' })

  const audit = await page.evaluate(() => {
    const text = document.body.textContent?.replace(/\s+/g, ' ').trim() ?? ''
    const hrefs = [...document.querySelectorAll('a[href]')].map((link) => link.getAttribute('href'))
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      h1: document.querySelector('h1')?.textContent?.trim(),
      h1Count: document.querySelectorAll('h1').length,
      services: document.querySelectorAll('.hire-service-ledger > li').length,
      steps: document.querySelectorAll('.hire-process-path > li').length,
      goodFit: document.querySelectorAll('.hire-fit-ledger > section:first-child li').length,
      notFit: document.querySelectorAll('.hire-fit-ledger > section:last-child li').length,
      booking: hrefs.filter((href) => href === 'https://cal.com/parth-tiwari').length,
      email: hrefs.filter((href) => href === 'mailto:parthti2003@gmail.com').length,
      whatsapp: hrefs.filter((href) => href === 'https://wa.me/917000181882').length,
      unsupportedSalesProof: /testimonial|trusted by|clients include|limited time|spots left/i.test(text),
      publicPrice: /(?:\$|₹|£|€|price band|starting at|per hour|per day)/i.test(text),
      missingAlt: document.querySelectorAll('img:not([alt])').length,
      unnamedControls: [...document.querySelectorAll('a[href],button,input')].filter((element) => !((element.getAttribute('aria-label') || element.textContent || '').trim())).length,
      scripts: document.scripts.length,
    }
  })

  await page.screenshot({ path: path.join(output, `${viewport.name}-first-screen.png`) })
  await page.locator('.hire-services').screenshot({ path: path.join(output, `${viewport.name}-services.png`) })
  await page.locator('.hire-process').screenshot({ path: path.join(output, `${viewport.name}-process.png`) })
  await page.locator('.hire-fit').screenshot({ path: path.join(output, `${viewport.name}-fit.png`) })
  await page.locator('.hire-close').screenshot({ path: path.join(output, `${viewport.name}-contact.png`) })

  const passed = response?.ok() && audit.overflow <= 1 && audit.h1 === 'Have something real to build?'
    && audit.h1Count === 1 && audit.services === 3 && audit.steps === 4
    && audit.goodFit === 4 && audit.notFit === 4 && audit.booking === 2
    && audit.email === 2 && audit.whatsapp === 2 && !audit.unsupportedSalesProof
    && !audit.publicPrice && audit.missingAlt === 0 && audit.unnamedControls === 0
    && audit.scripts === 0 && errors.length === 0
  console.log(`${passed ? 'PASS' : 'FAIL'} ${viewport.name}: status=${response?.status() ?? 'none'} overflow=${audit.overflow}px services=${audit.services} steps=${audit.steps} fit=${audit.goodFit}/${audit.notFit} contact=${audit.booking}/${audit.email}/${audit.whatsapp} price=${audit.publicPrice} scripts=${audit.scripts} errors=${errors.join(' | ')}`)
  if (!passed) failures += 1
  await context.close()
}

const noScriptContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } })
const noScriptPage = await noScriptContext.newPage()
const noScriptResponse = await noScriptPage.goto(`${base}/hire/`, { waitUntil: 'load' })
const noScript = await noScriptPage.evaluate(() => ({
  h1: document.querySelector('h1')?.textContent?.trim(),
  services: document.querySelectorAll('.hire-service-ledger > li').length,
  steps: document.querySelectorAll('.hire-process-path > li').length,
  contact: document.querySelectorAll('.hire-close a[href]').length,
}))
const noScriptPassed = noScriptResponse?.ok() && noScript.h1 === 'Have something real to build?'
  && noScript.services === 3 && noScript.steps === 4 && noScript.contact === 3
console.log(`${noScriptPassed ? 'PASS' : 'FAIL'} no-JavaScript: h1=${noScript.h1} services=${noScript.services} steps=${noScript.steps} contact=${noScript.contact}`)
if (!noScriptPassed) failures += 1
await noScriptContext.close()

const homeContext = await browser.newContext({ viewport: { width: 390, height: 844 } })
const homePage = await homeContext.newPage()
const homeResponse = await homePage.goto(`${base}/`, { waitUntil: 'load' })
const homeHireLinks = await homePage.locator('a[href="/hire"], a[href="/hire/"]').count()
const homePassed = homeResponse?.ok() && homeHireLinks >= 2
console.log(`${homePassed ? 'PASS' : 'FAIL'} home-to-hire: links=${homeHireLinks}`)
if (!homePassed) failures += 1
await homeContext.close()

await browser.close()
console.log(`Hire screenshots: ${output}`)
process.exit(failures === 0 ? 0 : 1)
