/**
 * Viewport matrix screenshots.
 *
 * Exists because the browser tooling used during Phase 2 could move the OS
 * window but never changed the captured viewport — screenshots at 390, 500 and
 * 1552 came back identical — and Chrome on Windows will not go below ~500px
 * wide. So the one change that most needed a phone (2.5, deleting the separate
 * mobile scene) was the one that could not be tested on one.
 *
 * Playwright emulates the viewport properly, including device scale factor and
 * a touch/coarse pointer, which matters here: `qualityTier.ts` keys off
 * `(pointer: coarse)` and viewport width to decide the tier, so a plain narrow
 * desktop window would take the wrong branch and prove nothing.
 *
 *   node scripts/shots.mjs                  # against http://localhost:4400
 *   node scripts/shots.mjs --url <url>
 *   node scripts/shots.mjs --tag before     # names the output folder
 *
 * Output: .shots/<tag>/<name>.png, gitignored. Console prints any page error
 * or failed request, which is how a shader that fails to compile surfaces —
 * silently black pixels otherwise.
 */

import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const args = process.argv.slice(2)
const argOf = (flag, fallback) => {
  const i = args.indexOf(flag)
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback
}

const BASE = argOf('--url', 'http://localhost:4400')
const TAG = argOf('--tag', 'now')
const OUT = path.resolve('.shots', TAG)

/**
 * The 800 entry is not padding. DESIGN §9 records a dead zone between 768 and
 * 820 where the desktop scene rendered behind mobile navigation; 2.5 was
 * supposed to remove it, and this is the width that proves it.
 */
const VIEWPORTS = [
  { name: 'phone-390', width: 390, height: 844, dsf: 3, touch: true },
  { name: 'phone-430', width: 430, height: 932, dsf: 3, touch: true },
  { name: 'deadzone-800', width: 800, height: 1000, dsf: 2, touch: true },
  { name: 'tablet-834', width: 834, height: 1112, dsf: 2, touch: true },
  { name: 'desktop-1440', width: 1440, height: 900, dsf: 1, touch: false },
]

const ROUTES = [
  { name: 'home', path: '/' },
  { name: 'plain', path: '/?plain=1' },
]

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  let problems = 0

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.dsf,
      hasTouch: vp.touch,
      isMobile: vp.touch,
      // WebGL in headless Chromium needs this or the canvas silently no-ops.
      ignoreHTTPSErrors: true,
    })

    for (const route of ROUTES) {
      const page = await context.newPage()
      const errors = []
      page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
      page.on('console', (m) => {
        if (m.type() === 'error') errors.push(`console: ${m.text()}`)
      })
      // "Failed to load resource" with no URL is unactionable. requestfailed
      // carries the URL, which is how the external font CDNs were identified as
      // the only network dependency the page has.
      page.on('requestfailed', (r) => {
        errors.push(`request: ${r.failure()?.errorText ?? 'failed'} ${r.url()}`)
      })

      await page.goto(`${BASE}${route.path}`, { waitUntil: 'load', timeout: 45_000 })
      // The scene is async-imported and the boot sequence types itself out.
      await page.waitForTimeout(route.name === 'plain' ? 1500 : 9000)

      const file = path.join(OUT, `${vp.name}--${route.name}.png`)
      await page.screenshot({ path: file, fullPage: false })

      const label = `${vp.name} ${route.name}`.padEnd(26)
      if (errors.length) {
        problems += errors.length
        console.log(`✗ ${label} ${errors.length} error(s)`)
        for (const e of errors.slice(0, 4)) console.log(`    ${e}`)
      } else {
        console.log(`✓ ${label} clean`)
      }
      await page.close()
    }
    await context.close()
  }

  await browser.close()
  console.log(`\n${OUT}`)
  console.log(problems ? `${problems} problem(s) found` : 'no page errors at any viewport')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
