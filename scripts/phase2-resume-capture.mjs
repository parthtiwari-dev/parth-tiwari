/** Capture and verify the Phase 2 HTML Resume route and local PDF delivery. */

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
const output = path.resolve('.shots', argOf('--tag', 'phase2-resume-review'))
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
  const response = await page.goto(`${base}/resume/`, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.addStyleTag({ content: '.skip-link { display: none !important; }' })
  const audit = await page.evaluate(() => {
    const text = document.querySelector('#resume-document')?.textContent?.replace(/\s+/g, ' ').trim() ?? ''
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      h1: document.querySelector('h1')?.textContent?.trim(),
      h1Count: document.querySelectorAll('h1').length,
      documentName: document.querySelector('#resume-name')?.textContent?.trim(),
      experience: document.querySelectorAll('#resume-experience-title + .resume-records > .resume-record').length,
      projects: document.querySelectorAll('.resume-project').length,
      skills: document.querySelectorAll('.resume-skills > div').length,
      education: document.querySelectorAll('.resume-education-records > .resume-record').length,
      pdfHref: document.querySelector('.resume-download')?.getAttribute('href'),
      driveLinks: [...document.querySelectorAll('a')].filter((link) => link.textContent?.includes('Drive copy')).length,
      printVisible: !document.querySelector('[data-print-resume]')?.hasAttribute('hidden'),
      staleClaims: ['24 days', '500 seconds', '95.7%', '1000 seconds'].filter((claim) => text.includes(claim)),
      missingAlt: document.querySelectorAll('img:not([alt])').length,
      unnamedControls: [...document.querySelectorAll('a[href],button,input')].filter((element) => !((element.getAttribute('aria-label') || element.textContent || '').trim())).length,
      scripts: document.scripts.length,
    }
  })
  const pdfResponse = await page.request.get(`${base}${audit.pdfHref}`)

  await page.screenshot({ path: path.join(output, `${viewport.name}-first-screen.png`) })
  await page.locator('.resume-identity').screenshot({ path: path.join(output, `${viewport.name}-identity.png`) })
  await page.locator('#resume-projects-title').scrollIntoViewIfNeeded()
  await page.locator('#resume-projects-title').evaluate((heading) => heading.parentElement?.scrollIntoView({ block: 'start' }))
  await page.screenshot({ path: path.join(output, `${viewport.name}-selected-work.png`) })

  const passed = response?.ok() && audit.overflow <= 1 && audit.h1 === 'Resume.' && audit.h1Count === 1
    && audit.documentName === 'Parth Tiwari' && audit.experience === 1 && audit.projects === 4
    && audit.skills === 4 && audit.education === 2 && audit.pdfHref === '/resume/Parth_Tiwari_Resume_B.pdf'
    && pdfResponse.ok() && Number(pdfResponse.headers()['content-length']) === 48997
    && audit.driveLinks === 0 && audit.printVisible && audit.staleClaims.length === 0
    && audit.missingAlt === 0 && audit.unnamedControls === 0 && audit.scripts === 1 && errors.length === 0
  console.log(`${passed ? 'PASS' : 'FAIL'} ${viewport.name}: status=${response?.status() ?? 'none'} overflow=${audit.overflow}px experience=${audit.experience} projects=${audit.projects} skills=${audit.skills} education=${audit.education} pdf=${pdfResponse.status()}/${pdfResponse.headers()['content-length']} drive=${audit.driveLinks} stale=${audit.staleClaims.join(',')} errors=${errors.join(' | ')}`)
  if (!passed) failures += 1

  if (viewport.name === 'desktop-1440') {
    await page.pdf({ path: path.join(output, 'resume-print.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true })
  }
  await context.close()
}

const noScriptContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } })
const noScriptPage = await noScriptContext.newPage()
const noScriptResponse = await noScriptPage.goto(`${base}/resume/`, { waitUntil: 'load' })
const noScript = await noScriptPage.evaluate(() => ({
  name: document.querySelector('#resume-name')?.textContent?.trim(),
  experience: document.querySelectorAll('#resume-experience-title + .resume-records > .resume-record').length,
  projects: document.querySelectorAll('.resume-project').length,
  skills: document.querySelectorAll('.resume-skills > div').length,
  education: document.querySelectorAll('.resume-education-records > .resume-record').length,
  printHidden: document.querySelector('[data-print-resume]')?.hasAttribute('hidden'),
}))
const noScriptPassed = noScriptResponse?.ok() && noScript.name === 'Parth Tiwari' && noScript.experience === 1
  && noScript.projects === 4 && noScript.skills === 4 && noScript.education === 2 && noScript.printHidden
console.log(`${noScriptPassed ? 'PASS' : 'FAIL'} no-JavaScript: name=${noScript.name} experience=${noScript.experience} projects=${noScript.projects} skills=${noScript.skills} education=${noScript.education} printHidden=${noScript.printHidden}`)
if (!noScriptPassed) failures += 1
await noScriptContext.close()

await browser.close()
console.log(`Resume screenshots: ${output}`)
process.exit(failures === 0 ? 0 : 1)
