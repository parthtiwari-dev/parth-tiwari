/** Capture and verify the Phase 2 Notes hub and concise Errata article structure. */

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
const output = path.resolve('.shots', argOf('--tag', 'phase2-notes-review'))
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
  const response = await page.goto(`${base}/notes/`, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.addStyleTag({ content: '.skip-link { display: none !important; }' })

  const hub = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    h1: document.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim(),
    h1Count: document.querySelectorAll('h1').length,
    entries: document.querySelectorAll('[data-note-entry]').length,
    links: [...document.querySelectorAll('[data-note-entry] a')].map((link) => link.getAttribute('href')),
    controls: getComputedStyle(document.querySelector('[data-notes-controls]')).display,
    missingAlt: document.querySelectorAll('img:not([alt])').length,
    unnamedControls: [...document.querySelectorAll('a[href],button,input')].filter((element) => {
      const text = element.getAttribute('aria-label') || element.textContent || ''
      return !text.trim()
    }).length,
  }))

  await page.screenshot({ path: path.join(output, `${viewport.name}-hub-first-screen.png`) })
  await page.locator('#notes-archive').screenshot({ path: path.join(output, `${viewport.name}-errata-register.png`) })

  await page.locator('[data-note-filter="post"]').click()
  const writingState = await page.evaluate(() => ({
    errataHidden: document.querySelector('[data-errata-section]')?.hasAttribute('hidden'),
    writingHidden: document.querySelector('[data-writing-section]')?.hasAttribute('hidden'),
    count: document.querySelector('[data-note-count]')?.textContent,
  }))
  await page.locator('[data-writing-section]').screenshot({ path: path.join(output, `${viewport.name}-writing-empty.png`) })

  const articleResponse = await page.goto(`${base}/notes/querypilot-denominator/`, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  const article = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    h1Count: document.querySelectorAll('h1').length,
    paragraphs: document.querySelectorAll('.article-prose p').length,
    sources: document.querySelectorAll('.article-sources li').length,
    measurements: document.querySelectorAll('.article-evidence dl > div').length,
    relatedProjects: document.querySelectorAll('.article-projects a').length,
    missingAlt: document.querySelectorAll('img:not([alt])').length,
  }))
  await page.screenshot({ path: path.join(output, `${viewport.name}-article-first-screen.png`) })
  await page.locator('#note-record').screenshot({ path: path.join(output, `${viewport.name}-article-record.png`) })
  await page.locator('.article-evidence').screenshot({ path: path.join(output, `${viewport.name}-article-evidence.png`) })

  const passed = response?.ok() && articleResponse?.ok() && hub.overflow <= 1 && article.overflow <= 1
    && hub.h1 === 'Things went wrong. I wrote them down.' && hub.h1Count === 1 && hub.entries === 12
    && hub.links.length === 12 && hub.controls !== 'none' && hub.missingAlt === 0 && hub.unnamedControls === 0
    && writingState.errataHidden === true && writingState.writingHidden === false && writingState.count === '0'
    && article.h1Count === 1 && article.paragraphs === 2 && article.sources === 1
    && article.measurements === 1 && article.relatedProjects === 1 && article.missingAlt === 0
    && errors.length === 0
  console.log(`${passed ? 'PASS' : 'FAIL'} ${viewport.name}: hub=${response?.status() ?? 'none'} article=${articleResponse?.status() ?? 'none'} overflow=${hub.overflow}/${article.overflow}px entries=${hub.entries} writing=${writingState.count} record=${article.paragraphs}p sources=${article.sources} evidence=${article.measurements} errors=${errors.join(' | ')}`)
  if (!passed) failures += 1
  await context.close()
}

const linkContext = await browser.newContext()
const linkPage = await linkContext.newPage()
await linkPage.goto(`${base}/notes/`, { waitUntil: 'load' })
const noteLinks = await linkPage.locator('[data-note-entry] a').evaluateAll((links) => links.map((link) => link.href))
let workingLinks = 0
for (const href of noteLinks) {
  const response = await linkPage.goto(href, { waitUntil: 'domcontentloaded' })
  if (response?.ok() && await linkPage.locator('main h1').count() === 1) workingLinks += 1
}
const linksPassed = workingLinks === 12
console.log(`${linksPassed ? 'PASS' : 'FAIL'} article routes: ${workingLinks}/12 return HTML with one h1`)
if (!linksPassed) failures += 1
await linkContext.close()

const noScriptContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } })
const noScriptPage = await noScriptContext.newPage()
await noScriptPage.goto(`${base}/notes/`, { waitUntil: 'load' })
const noScript = await noScriptPage.evaluate(() => ({
  entries: document.querySelectorAll('[data-note-entry]').length,
  controls: getComputedStyle(document.querySelector('[data-notes-controls]')).display,
  writingHidden: document.querySelector('[data-writing-section]')?.hasAttribute('hidden'),
}))
await noScriptPage.goto(`${base}/notes/querypilot-denominator/`, { waitUntil: 'load' })
const noScriptArticle = await noScriptPage.evaluate(() => ({
  paragraphs: document.querySelectorAll('.article-prose p').length,
  sources: document.querySelectorAll('.article-sources li').length,
  measurements: document.querySelectorAll('.article-evidence dl > div').length,
}))
const noScriptPassed = noScript.entries === 12 && noScript.controls === 'none' && noScript.writingHidden === false
  && noScriptArticle.paragraphs === 2 && noScriptArticle.sources === 1 && noScriptArticle.measurements === 1
console.log(`${noScriptPassed ? 'PASS' : 'FAIL'} no-JavaScript: entries=${noScript.entries} controls=${noScript.controls} writingHidden=${noScript.writingHidden} article=${noScriptArticle.paragraphs}p/${noScriptArticle.sources}s/${noScriptArticle.measurements}m`)
if (!noScriptPassed) failures += 1
await noScriptContext.close()

await browser.close()
console.log(`Notes screenshots: ${output}`)
process.exit(failures === 0 ? 0 : 1)
