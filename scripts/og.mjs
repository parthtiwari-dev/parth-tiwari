/**
 * Regenerates `public/og.png`, the Open Graph / Twitter card.
 *
 * It exists as a script rather than a one-off export because the card carries
 * the site's *name*, and the name has already gone stale once: the committed
 * card still read EVIDENCEBOUND months after the rename to EPHEMERIS
 * (CLAUDE.md), on the image every share, every unfurl and every search preview
 * shows. A binary nobody can regenerate is a binary nobody updates.
 *
 *   node scripts/og.mjs
 *
 * 1200x630 is the size Open Graph, Twitter and LinkedIn all read. The palette is
 * pasted from `tokens.css` rather than imported — this renders in a bare page
 * with no build step — so if the tokens move, move them here in the same commit.
 *
 * The constellation is drawn from a seeded pseudo-random walk, not hand-placed
 * points. That is the same rule the site itself runs on: positions are computed,
 * never authored. The seed is fixed so re-running produces the identical file.
 */

import { chromium } from 'playwright'
import { chromiumLaunchOptions } from './browser.mjs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const OUT = path.resolve('public/og.png')
const FONT = path.resolve('public/fonts/GeistMono-Variable.woff2')

const T = {
  bg: '#010409',
  bgNebula: '#071d34',
  ice: '#d8eaf0',
  iceMuted: '#7fa8b8',
  iceFaint: '#2e4f5e',
  gold: '#c9a84c',
}

const NAME = 'EPHEMERIS'
const OWNER = 'Parth Tiwari'
const THESIS = 'Systems that act only after the evidence agrees.'

const html = (fontDataUrl) => `
<style>
  @font-face {
    font-family: 'Geist Mono';
    src: url('${fontDataUrl}') format('woff2');
    font-weight: 100 900;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; }
  .card {
    position: relative;
    width: 1200px;
    height: 630px;
    background:
      radial-gradient(120% 90% at 88% 8%, ${T.bgNebula} 0%, transparent 58%),
      linear-gradient(150deg, #0b2029 0%, ${T.bg} 62%);
    font-family: 'Spectral', Georgia, serif;
    overflow: hidden;
  }
  svg { position: absolute; inset: 0; }
  .text { position: absolute; left: 96px; bottom: 84px; }
  .name {
    color: ${T.ice};
    font-size: 92px;
    font-weight: 300;
    letter-spacing: 0.045em;
    line-height: 1;
  }
  .owner {
    margin-top: 14px;
    color: ${T.gold};
    font-size: 44px;
    font-weight: 300;
    line-height: 1;
  }
  .thesis {
    margin-top: 24px;
    color: ${T.iceMuted};
    font-family: 'Geist Mono', ui-monospace, monospace;
    font-size: 20px;
    letter-spacing: 0.055em;
  }
</style>
<div class="card">
  <svg viewBox="0 0 1200 630" id="sky"></svg>
  <div class="text">
    <div class="name">${NAME}</div>
    <div class="owner">${OWNER}</div>
    <div class="thesis">${THESIS}</div>
  </div>
</div>
<script>
  // Mulberry32 — small, deterministic, and the same idea the star field uses.
  function seeded(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed)
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
      return ((t ^ t >>> 14) >>> 0) / 4294967296
    }
  }
  const rand = seeded(20260818)
  const ns = 'http://www.w3.org/2000/svg'
  const sky = document.getElementById('sky')

  // Background field.
  for (let i = 0; i < 190; i += 1) {
    const c = document.createElementNS(ns, 'circle')
    c.setAttribute('cx', (rand() * 1200).toFixed(1))
    c.setAttribute('cy', (rand() * 630).toFixed(1))
    c.setAttribute('r', (0.5 + rand() * 1.5).toFixed(2))
    c.setAttribute('fill', '${T.ice}')
    c.setAttribute('opacity', (0.06 + rand() * 0.4).toFixed(2))
    sky.appendChild(c)
  }

  // A walk across the upper half, evenly spaced in x, wandering in y.
  const COUNT = 7
  const points = []
  for (let i = 0; i < COUNT; i += 1) {
    const x = 150 + (i * 900) / (COUNT - 1)
    const y = 150 + rand() * 190
    points.push([x, y])
  }

  const line = document.createElementNS(ns, 'polyline')
  line.setAttribute('points', points.map((p) => p.join(',')).join(' '))
  line.setAttribute('fill', 'none')
  line.setAttribute('stroke', '${T.iceFaint}')
  line.setAttribute('stroke-width', '1.4')
  sky.appendChild(line)

  for (const [x, y] of points) {
    const halo = document.createElementNS(ns, 'circle')
    halo.setAttribute('cx', x); halo.setAttribute('cy', y)
    halo.setAttribute('r', '13')
    halo.setAttribute('fill', '${T.gold}')
    halo.setAttribute('opacity', '0.14')
    sky.appendChild(halo)

    const dot = document.createElementNS(ns, 'circle')
    dot.setAttribute('cx', x); dot.setAttribute('cy', y)
    dot.setAttribute('r', '6')
    dot.setAttribute('fill', '${T.gold}')
    sky.appendChild(dot)
  }
</script>
`

const browser = await chromium.launch(chromiumLaunchOptions())
const page = await (await browser.newContext({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
})).newPage()

// Spectral comes from Google Fonts; Geist Mono is self-hosted and inlined so the
// card never depends on a CDN that might 404 the way the jsDelivr path did.
await page.setContent(
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Spectral:wght@300;400&display=swap">'
  + html(`data:font/woff2;base64,${(await readFile(FONT)).toString('base64')}`),
  { waitUntil: 'load' },
)
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(1200)
await page.screenshot({ path: OUT })
console.log(`wrote ${OUT}`)
await browser.close()
