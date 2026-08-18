/**
 * Screenshots and short silent screen recordings of the live demos
 * (PLAN.md 1.5.1).
 *
 * "Show before telling" is a rule in CLAUDE.md, and until this ran the site had
 * nothing to show: twelve projects opening on a tagline, zero pixels of any of
 * them actually working. A screenshot outranks a paragraph and a demo outranks a
 * screenshot, so this captures both.
 *
 * ---------------------------------------------------------------------------
 * ONLY capture a URL already confirmed public, auth-free and ours.
 * ---------------------------------------------------------------------------
 * Same rule as linking (CLAUDE.md). Every target here is a `liveUI` already in
 * `projects.ts` and re-verified 200 without auth before capture. A screenshot of
 * a login wall is not evidence, and a screenshot of a stranger's site claimed as
 * ours is worse than no screenshot. `--verify-only` re-checks without capturing.
 *
 * Deliberately NOT captured:
 *   - `querypilot`'s Render `/docs` — free tier, spun down, did not answer in
 *     240s. A cold-start endpoint is not a demo (same call as tathya's API).
 *   - anything behind sign-up. BeatMind's editor is invite-only for the pilot,
 *     so only its public marketing surface is captured, and the caption says so.
 *
 *   node scripts/capture-demos.mjs                 # shots + video
 *   node scripts/capture-demos.mjs --no-video
 *   node scripts/capture-demos.mjs --only tathya
 *   node scripts/capture-demos.mjs --verify-only
 *
 * Output: public/media/<id>-<variant>.jpg and public/media/<id>.webm.
 *
 * JPEG rather than PNG, and no image library: `sharp` would be a new dependency
 * for one build step, and Chromium already encodes JPEG. Quality 88 at device
 * scale 2 is visually lossless for UI at the sizes the overlay renders.
 */

import { chromium, devices } from 'playwright'
import { chromiumLaunchOptions } from './browser.mjs'
import { mkdir, rename, rm, readdir } from 'node:fs/promises'
import path from 'node:path'

const args = process.argv.slice(2)
const has = (flag) => args.includes(flag)
const argOf = (flag, fallback) => {
  const i = args.indexOf(flag)
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback
}

const OUT = path.resolve('public/media')
const WITH_VIDEO = !has('--no-video')
const VERIFY_ONLY = has('--verify-only')
const ONLY = argOf('--only', null)

/**
 * `settle` is per-target because these are other people's apps, not ours: a
 * marketing page is painted on load, a dashboard fetches first. Too short and
 * the capture is of a skeleton, which reads as a broken product.
 */
const TARGETS = [
  {
    id: 'beatmind',
    url: 'https://www.beatmind.tech',
    settle: 3200,
    scrollTo: 0.55,
  },
  {
    id: 'stick-and-dot',
    url: 'https://vivid-alpha.vercel.app',
    settle: 3200,
    scrollTo: 0.5,
  },
  {
    id: 'support-core',
    url: 'https://support-core-nine.vercel.app',
    settle: 3600,
    scrollTo: 0,
    /**
     * Captured as the greeting state, deliberately, and the caption says so.
     *
     * An idle chat window is weak evidence for a chat agent, so this target had
     * an `interact` hook that asked "What's your return policy?" and waited for
     * the streamed reply. It never arrived.
     *
     * **The backend is down.** The Vercel frontend POSTs to
     * `support-core.onrender.com/api/chat/message`, and that host returned
     * nothing at all in 200s, twice, on two separate paths — which is not a
     * free-tier cold start, that resolves in 30-60s. So the linked demo loads,
     * accepts a question, and sits on "Lumi is typing…" forever.
     *
     * Nothing here can honestly show the agent answering until the backend is
     * back. Capturing the greeting is the truthful option: it is exactly what a
     * visitor sees. Restore the `interact` hook once the API responds — the
     * machinery is still in `shoot()` and `record()`.
     */
  },
  {
    id: 'tathya',
    url: 'https://tathya-1.vercel.app',
    settle: 4200,
    scrollTo: 0.45,
    /**
     * The site opens on a full-screen statement of intent with an ENTER
     * affordance. Recording without dismissing it spent the first seconds of a
     * twelve-second clip on a near-empty frame, while the poster showed the
     * feed — so the still and the video disagreed about what the product is.
     *
     * Best-effort: if the splash is not there (it may be shown once), the click
     * fails and the scroll pass runs against the feed anyway.
     */
    async prepare(page) {
      await page.getByText('Enter', { exact: false }).first().click({ timeout: 6000 })
      await page.waitForTimeout(2200)
    },
  },
  {
    // Render free tier: sleeps after 15 minutes and takes 30-60s to wake. The
    // `verify` fetch above doubles as the warm-up, which is why this one is
    // captured at all — `tathya`'s Render API stays unlinked and uncaptured
    // because nothing on the site sends a visitor there. This URL is already
    // in `projects.ts` as `apiDocs`, so a visitor can already land on it.
    id: 'querypilot',
    url: 'https://querypilot-backend.onrender.com/docs',
    settle: 5000,
    scrollTo: 0.3,
    noVideo: true,
  },
]

const DESKTOP = { width: 1440, height: 900 }
const MOBILE = devices['iPhone 13']

async function verify(url) {
  // 4 minutes: long enough to double as the wake-up call for a sleeping free tier.
  const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(240_000) })
  return { ok: res.ok && !/sign-?in|log-?in|auth/i.test(new URL(res.url).pathname), status: res.status, final: res.url }
}

async function settleIn(page, ms) {
  await page.waitForLoadState('domcontentloaded')
  await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => {})
  // Kill motion so two runs of this script produce comparable frames.
  await page.emulateMedia({ reducedMotion: 'reduce' }).catch(() => {})
  await page.waitForTimeout(ms)
}

async function shoot(browser, target) {
  for (const [variant, ctxOptions, full] of [
    ['desktop', { viewport: DESKTOP, deviceScaleFactor: 2 }, false],
    ['mobile', { ...MOBILE }, false],
  ]) {
    const context = await browser.newContext({ ...ctxOptions, colorScheme: 'dark' })
    const page = await context.newPage()
    try {
      await page.goto(target.url, { waitUntil: 'commit', timeout: 60_000 })
      await settleIn(page, target.settle)
      if (target.prepare) await target.prepare(page).catch(() => {})
      if (target.interact) {
        try {
          await target.interact(page)
        } catch (error) {
          // A capture of the idle state is worth more than no capture, but it
          // must be visible that the interaction did not happen.
          console.error(`  warn   ${target.id} ${variant}: interaction skipped (${error.message.split('\n')[0]})`)
        }
      }
      const file = path.join(OUT, `${target.id}-${variant}.jpg`)
      await page.screenshot({ path: file, type: 'jpeg', quality: 88, fullPage: full })
      console.log(`  shot   ${path.basename(file)}`)
    } catch (error) {
      console.error(`  FAIL   ${target.id} ${variant}: ${error.message}`)
    } finally {
      await context.close()
    }
  }
}

async function record(browser, target) {
  const raw = path.join(OUT, `.raw-${target.id}`)
  const context = await browser.newContext({
    viewport: DESKTOP,
    deviceScaleFactor: 1,
    colorScheme: 'dark',
    recordVideo: { dir: raw, size: DESKTOP },
  })
  const page = await context.newPage()
  try {
    await page.goto(target.url, { waitUntil: 'commit', timeout: 60_000 })
    await settleIn(page, target.settle)
    if (target.prepare) await target.prepare(page).catch(() => {})

    // An app with an interaction records the interaction. Scrolling a chat
    // window shows nothing that a screenshot does not already show.
    if (target.interact) {
      await target.interact(page).catch(() => {})
      await page.waitForTimeout(1200)
      await context.close()
      const [only] = await readdir(raw)
      if (only) {
        await rename(path.join(raw, only), path.join(OUT, `${target.id}.webm`))
        console.log(`  video  ${target.id}.webm`)
      }
      await rm(raw, { recursive: true, force: true })
      return
    }

    // A slow, even scroll: enough to show the page is real and has depth,
    // short enough that nobody has to sit through it.
    const steps = 24
    for (let i = 1; i <= steps; i += 1) {
      await page.evaluate(
        (y) => window.scrollTo({ top: document.body.scrollHeight * y, behavior: 'instant' }),
        (target.scrollTo || 0.6) * (i / steps),
      )
      await page.waitForTimeout(90)
    }
    await page.waitForTimeout(700)
    await context.close()

    const [produced] = await readdir(raw)
    if (produced) {
      await rename(path.join(raw, produced), path.join(OUT, `${target.id}.webm`))
      console.log(`  video  ${target.id}.webm`)
    }
  } catch (error) {
    console.error(`  FAIL   ${target.id} video: ${error.message}`)
    await context.close().catch(() => {})
  } finally {
    await rm(raw, { recursive: true, force: true })
  }
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const targets = ONLY ? TARGETS.filter((t) => t.id === ONLY) : TARGETS
  let refused = 0

  const browser = VERIFY_ONLY ? null : await chromium.launch(chromiumLaunchOptions())

  for (const target of targets) {
    const check = await verify(target.url).catch((e) => ({ ok: false, status: e.message }))
    if (!check.ok) {
      console.error(`REFUSE ${target.id}: ${target.url} -> ${check.status} ${check.final ?? ''}`)
      console.error('       Not captured. A screenshot of an auth wall or an error is not evidence.')
      refused += 1
      continue
    }
    console.log(`${target.id}  ${target.url}  ${check.status}`)
    if (VERIFY_ONLY) continue

    await shoot(browser, target)
    if (WITH_VIDEO && !target.noVideo) await record(browser, target)
  }

  await browser?.close()
  if (refused > 0) process.exitCode = 1
}

main()
