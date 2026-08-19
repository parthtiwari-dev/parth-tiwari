/**
 * Phase 7 frame budget and sustained-load check (PLAN.md 7.5, 7.7).
 *
 * **What this can and cannot tell you.** It measures frame intervals in a real
 * browser over a real render loop, which is the honest half. It cannot measure
 * heat, and a headless Chromium on a server GPU is not a phone — so the absolute
 * numbers here are not a phone's numbers and are never reported as if they were.
 *
 * What it *is* good for is the thing a thermal test actually looks for:
 * **degradation over time.** A scene that holds 60fps for ten seconds and 38fps
 * after two minutes has a leak, an unbounded allocation, or a growing scene
 * graph — and that shape of failure reproduces anywhere, including here. The
 * check compares the last third of a two-minute run against the first third.
 *
 *   node scripts/perf-check.mjs --url http://localhost:4400
 *   node scripts/perf-check.mjs --url ... --seconds 120
 */

import { chromium } from 'playwright'
import { chromiumLaunchOptions } from './browser.mjs'

const args = process.argv.slice(2)
const argOf = (flag, fallback) => {
  const i = args.indexOf(flag)
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback
}
const B = argOf('--url', 'http://localhost:4400')
const SECONDS = Number(argOf('--seconds', '120'))

const b = await chromium.launch(chromiumLaunchOptions())
let fails = 0
const ok = (n, c, extra = '') => {
  console.log(`${c ? '✓' : '✗'} ${n}${extra ? '  ' + extra : ''}`)
  if (!c) fails += 1
}

/**
 * Each tier is forced by the conditions `qualityTier.ts` actually detects, not
 * by reaching into the module — testing the real detection path is the point.
 * A coarse pointer under 820px is a handset; reduced motion forces low.
 */
const TIERS = [
  { name: 'high', viewport: { width: 1440, height: 900 }, touch: false, dsf: 1, reducedMotion: 'no-preference' },
  { name: 'handset', viewport: { width: 390, height: 844 }, touch: true, dsf: 3, reducedMotion: 'no-preference' },
  { name: 'low (reduced motion)', viewport: { width: 1440, height: 900 }, touch: false, dsf: 1, reducedMotion: 'reduce' },
]

async function measure(tier, seconds) {
  const ctx = await b.newContext({
    viewport: tier.viewport,
    hasTouch: tier.touch,
    isMobile: tier.touch,
    deviceScaleFactor: tier.dsf,
    reducedMotion: tier.reducedMotion,
  })
  const p = await ctx.newPage()
  p.on('pageerror', (e) => { console.log('  PAGEERROR', e.message); fails += 1 })
  await p.goto(B, { waitUntil: 'load' })
  await p.waitForTimeout(2200)
  await p.keyboard.press('Escape')
  await p.waitForTimeout(3500)

  const environment = await p.evaluate(() => {
    const c = document.createElement('canvas')
    const gl = c.getContext('webgl2') || c.getContext('webgl')
    const info = gl && gl.getExtension('WEBGL_debug_renderer_info')
    return {
      renderer: info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : 'unknown',
      sceneMounted: document.querySelectorAll('canvas').length > 0,
    }
  })

  await p.evaluate(() => {
    window.__frames = []
    let last = performance.now()
    const tick = (now) => {
      window.__frames.push(now - last)
      last = now
      window.__raf = requestAnimationFrame(tick)
    }
    window.__raf = requestAnimationFrame(tick)
  })

  await p.waitForTimeout(seconds * 1000)

  const stats = await p.evaluate(() => {
    cancelAnimationFrame(window.__raf)
    const f = window.__frames.filter((d) => d > 0 && d < 500)
    const slice = (from, to) => f.slice(Math.floor(f.length * from), Math.floor(f.length * to))
    const mean = (a) => a.reduce((s, x) => s + x, 0) / Math.max(a.length, 1)
    const pct = (a, q) => {
      const sorted = [...a].sort((x, y) => x - y)
      return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * q))] ?? 0
    }
    return {
      frames: f.length,
      meanAll: mean(f),
      p95: pct(f, 0.95),
      meanFirst: mean(slice(0, 0.33)),
      meanLast: mean(slice(0.67, 1)),
      heap: performance.memory ? performance.memory.usedJSHeapSize : null,
    }
  })

  await ctx.close()
  return { ...stats, ...environment }
}

console.log(`Sustained load: ${SECONDS}s per tier\n`)

let softwareRendered = false

for (const tier of TIERS) {
  const s = await measure(tier, SECONDS)
  const fps = 1000 / s.meanAll
  const firstFps = 1000 / s.meanFirst
  const lastFps = 1000 / s.meanLast
  const drift = (lastFps / firstFps) * 100
  const software = /swiftshader|llvmpipe|software/i.test(s.renderer)
  if (software) softwareRendered = true

  console.log(`— ${tier.name}: ${fps.toFixed(1)} fps mean, p95 frame ${s.p95.toFixed(1)}ms, `
    + `${firstFps.toFixed(1)} → ${lastFps.toFixed(1)} fps`
    + `${s.sceneMounted ? '' : '  [no WebGL scene — reduced motion renders the static experience]'}`)

  /*
   * The absolute frame rate is only a gate on real hardware.
   *
   * This runner rasterises through SwiftShader — WebGL on the CPU, no GPU at
   * all — so a 63-noise sky shader at DPR 1.25 measures single-digit frames
   * here and would measure nothing like that on the mid-tier Android this
   * project actually targets. Failing the build on that number would be
   * reporting a fact about the CI box as if it were a fact about the site.
   */
  if (software) {
    console.log(`  · frame-rate gate skipped: ${s.renderer.slice(0, 60)}`)
  } else {
    ok(`7.7 ${tier.name} holds a usable frame rate`, fps >= 30, `${fps.toFixed(1)} fps`)
  }

  /*
   * Degradation *is* assertable anywhere, and it is the question a thermal test
   * is really asking. Leaks, unbounded allocation and a growing scene graph all
   * show up as "slower at the end than at the start" regardless of what is doing
   * the rasterising.
   */
  ok(`7.5 ${tier.name} does not degrade under sustained load`, drift >= 88,
    `${drift.toFixed(1)}% of opening rate retained`)
}

if (softwareRendered) {
  console.log('\nNote: absolute frame rates above are CPU-rasterised and are not '
    + 'representative of any real device. Only the degradation check is a gate here.')
}

console.log(fails === 0 ? '\nALL PHASE 7 PERF CHECKS PASSED' : `\n${fails} FAILURE(S)`)
await b.close()
process.exit(fails ? 1 : 0)
