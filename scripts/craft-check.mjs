/** Phase-aware checks for a complete static foundation and honest fallback. */

import { chromium } from 'playwright'
import { chromiumLaunchOptions } from './browser.mjs'

const args = process.argv.slice(2)
const urlIndex = args.indexOf('--url')
const base = (urlIndex !== -1 && args[urlIndex + 1]
  ? args[urlIndex + 1]
  : 'http://127.0.0.1:4321').replace(/\/$/, '')

const browser = await chromium.launch(chromiumLaunchOptions())
let failures = 0
const check = (label, condition, detail = '') => {
  console.log(`${condition ? 'PASS' : 'FAIL'} ${label}${detail ? `: ${detail}` : ''}`)
  if (!condition) failures += 1
}

async function readPage(javaScriptEnabled, reducedMotion = 'no-preference') {
  const context = await browser.newContext({ javaScriptEnabled, reducedMotion })
  const page = await context.newPage()
  const response = await page.goto(`${base}/`, { waitUntil: 'load' })
  const state = await page.evaluate(() => ({
    title: document.title.trim(),
    h1: document.querySelector('h1')?.textContent?.trim() ?? '',
    mainText: document.querySelector('main')?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
    canvases: document.querySelectorAll('canvas').length,
    scripts: document.scripts.length,
    vueRoots: document.querySelectorAll('#app,[data-v-app]').length,
  }))
  await context.close()
  return { ok: response?.ok() === true, ...state }
}

const normal = await readPage(true)
const noJavaScript = await readPage(false)
const reducedMotion = await readPage(true, 'reduce')

check('page title is meaningful', normal.title.length >= 10, normal.title)
check('page has a named h1', normal.h1.length > 0, normal.h1)
check('main copy is meaningful', normal.mainText.length >= 100, `${normal.mainText.length} characters`)
check('Phase 0 has no canvas', normal.canvases === 0, String(normal.canvases))
check('Phase 0 ships no client script', normal.scripts === 0, String(normal.scripts))
check('Vue mount contracts are gone', normal.vueRoots === 0, String(normal.vueRoots))
check('no-JavaScript page returns successfully', noJavaScript.ok)
check('no-JavaScript page keeps the complete copy', noJavaScript.mainText === normal.mainText)
check('reduced-motion page keeps the complete copy', reducedMotion.mainText === normal.mainText)

await browser.close()
process.exit(failures === 0 ? 0 : 1)
