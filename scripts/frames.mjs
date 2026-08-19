/**
 * Frame-by-frame capture of the whole experience, desktop and mobile.
 *
 * Not a viewport matrix like `shots.mjs` — this walks the *scroll*, one step at
 * a time, and then walks every panel of every project overlay including its
 * internal scroll. The point is to be able to look at what a visitor actually
 * sees at each moment rather than at the two or three moments a screenshot test
 * happens to sample.
 *
 *   node scripts/frames.mjs --url http://localhost:4400 --steps 40
 *   node scripts/frames.mjs --url ... --only scroll
 *
 * Output: .frames/<tag>/<device>/<sequence>-<name>.jpg, gitignored.
 */

import { chromium, devices } from 'playwright'
import { chromiumLaunchOptions } from './browser.mjs'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const args = process.argv.slice(2)
const argOf = (f, d) => { const i = args.indexOf(f); return i !== -1 && args[i + 1] ? args[i + 1] : d }
const B = argOf('--url', 'http://localhost:4400')
const STEPS = Number(argOf('--steps', '32'))
const TAG = argOf('--tag', 'now')
const ONLY = argOf('--only', null)
const OUT = path.resolve('.frames', TAG)

const DEVICES = [
  { name: 'desktop', ctx: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 } },
  { name: 'mobile', ctx: { ...devices['iPhone 13'] } },
]

const report = []

async function settle(p, ms = 700) { await p.waitForTimeout(ms) }

async function boot(browser, device) {
  const p = await (await browser.newContext(device.ctx)).newPage()
  const errors = []
  p.on('pageerror', (e) => errors.push(e.message))
  await p.goto(B, { waitUntil: 'load' })
  await p.waitForTimeout(2200)
  await p.keyboard.press('Escape')
  await p.waitForTimeout(3600)
  return { page: p, errors }
}

/** Walks the whole document scroll in even steps. */
async function captureScroll(browser, device) {
  const { page, errors } = await boot(browser, device)
  const dir = path.join(OUT, device.name, 'scroll')
  await mkdir(dir, { recursive: true })

  const total = await page.evaluate(() =>
    document.documentElement.scrollHeight - window.innerHeight)

  for (let i = 0; i <= STEPS; i += 1) {
    const y = Math.round((total * i) / STEPS)
    await page.evaluate((to) => window.scrollTo({ top: to, behavior: 'instant' }), y)
    // Lenis interpolates and the camera is scrubbed against it, so a frame taken
    // immediately after a jump is mid-interpolation and not what anyone sees.
    await settle(page, 850)
    const file = path.join(dir, `${String(i).padStart(3, '0')}-y${y}.jpg`)
    await page.screenshot({ path: file, type: 'jpeg', quality: 82 })
  }

  report.push({ device: device.name, section: 'scroll', frames: STEPS + 1, scrollHeight: total, errors: [...errors] })
  await page.close()
}

/**
 * Every panel of every project overlay, plus the internal scroll of each panel.
 *
 * The reported bug is that scrolling *inside* an open project does nothing, so
 * this records the panel's own `scrollHeight` and `clientHeight` alongside the
 * frame — a panel that overflows but cannot scroll is the exact shape of that
 * complaint, and it is a number rather than an impression.
 */
async function captureProjects(browser, device) {
  const { page, errors } = await boot(browser, device)
  const dir = path.join(OUT, device.name, 'projects')
  await mkdir(dir, { recursive: true })

  await page.locator('.project-index__toggle').click()
  await settle(page, 700)
  const names = await page.locator('.project-index__item-name').allInnerTexts()

  for (let n = 0; n < names.length; n += 1) {
    const name = names[n].trim()
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

    if (await page.locator('.project-index__panel').count() === 0) {
      await page.locator('.project-index__toggle').click()
      await settle(page, 600)
    }
    await page.locator('.project-index__item').nth(n).click()
    await settle(page, 1500)

    const panelCount = await page.locator('.film-strip__nav button').count()
    for (let panel = 0; panel < panelCount; panel += 1) {
      await page.locator('.film-strip__nav button').nth(panel).click()
      await settle(page, 900)

      const label = (await page.locator('.film-strip__nav button').nth(panel).innerText())
        .replace(/\s+/g, '-').toLowerCase()

      // Overflow measurement: is there more content than box, and can it move?
      const metrics = await page.evaluate(() => {
        const frame = document.querySelector('.film-strip__frame')
          || document.querySelector('.film-strip')
        const overlay = document.querySelector('.project-overlay')
        const pick = (el) => el ? {
          cls: el.className,
          scrollH: el.scrollHeight,
          clientH: el.clientHeight,
          overflowY: getComputedStyle(el).overflowY,
          scrollTop: el.scrollTop,
        } : null
        return { frame: pick(frame), overlay: pick(overlay) }
      })

      const base = `${String(n).padStart(2, '0')}-${slug}-${String(panel)}-${label}`
      await page.screenshot({ path: path.join(dir, `${base}-top.jpg`), type: 'jpeg', quality: 82 })

      // Drive a *real* wheel gesture rather than assigning `scrollTop`.
      //
      // The first version set `scrollTop` on `.film-strip__frame`, which is
      // `overflow: visible` and has never been the scroller — so it reported
      // "nothing overflows" while every mobile panel was hiding up to 1146px.
      // The scroller is `.project-overlay`, and assigning to it would have
      // passed too: the whole defect is that Lenis cancels the wheel event
      // before the browser can act on it, which only a synthesised gesture
      // reproduces.
      const box = await page.locator('.project-overlay').boundingBox()
      const before = await page.evaluate(() =>
        document.querySelector('.project-overlay')?.scrollTop ?? null)
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 200)
        await page.mouse.wheel(0, 100)
        await settle(page, 600)
      }
      const moved = await page.evaluate((from) => {
        const el = document.querySelector('.project-overlay')
        if (!el) return null
        return {
          before: from,
          after: el.scrollTop,
          scrollH: el.scrollHeight,
          clientH: el.clientHeight,
        }
      }, before)
      await settle(page, 500)
      await page.screenshot({ path: path.join(dir, `${base}-bottom.jpg`), type: 'jpeg', quality: 82 })

      report.push({
        device: device.name, section: 'project', project: name, panel: label,
        metrics, moved, errors: [...errors],
      })
    }

    await page.keyboard.press('Escape')
    await settle(page, 900)
  }

  await page.close()
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch(chromiumLaunchOptions())
  for (const device of DEVICES) {
    if (!ONLY || ONLY === 'scroll') await captureScroll(browser, device)
    if (!ONLY || ONLY === 'projects') await captureProjects(browser, device)
    console.log(`captured ${device.name}`)
  }
  await browser.close()
  await writeFile(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2))
  console.log(`\n${OUT}`)
}

main()
