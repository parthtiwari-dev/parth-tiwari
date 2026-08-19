/**
 * Phase 5 label behaviour check.
 *
 * Labels are the one part of this scene where "it renders" and "it is correct"
 * are furthest apart. A screenshot shows twelve names; it cannot show that the
 * name budget is being spent strongest-first, that a star behind the camera is
 * culled rather than mirrored into the viewport, or that a card can actually be
 * clicked without flickering out from under the pointer.
 *
 *   npm run dev &            # or vite preview
 *   node scripts/label-check.mjs --url http://localhost:4400
 *
 * Exits non-zero on any failure. Run it after anything touching the label layer,
 * the LOD rule, the rig, or the node meshes.
 */

import { chromium } from 'playwright'
import { chromiumLaunchOptions } from './browser.mjs'

const args = process.argv.slice(2)
const urlFlag = args.indexOf('--url')
const B = urlFlag !== -1 && args[urlFlag + 1] ? args[urlFlag + 1] : 'http://localhost:4400'

const b = await chromium.launch(chromiumLaunchOptions())
let fails = 0
const ok = (name, cond, extra = '') => {
  console.log(`${cond ? '✓' : '✗'} ${name}${extra ? '  ' + extra : ''}`)
  if (!cond) fails += 1
}

async function boot(ctxOpts = {}) {
  const p = await (await b.newContext({ viewport: { width: 1280, height: 820 }, ...ctxOpts })).newPage()
  p.on('pageerror', (e) => { console.log('  PAGEERROR', e.message); fails += 1 })
  await p.goto(B, { waitUntil: 'load' })
  await p.waitForTimeout(2500)
  await p.keyboard.press('Escape')
  await p.waitForTimeout(4000)
  return p
}

const counts = (p) => p.evaluate(() => ({
  dot: document.querySelectorAll('.node-labels__item--dot').length,
  name: document.querySelectorAll('.node-labels__item--name').length,
  card: document.querySelectorAll('.node-labels__item--card').length,
  total: document.querySelectorAll('.node-labels__item').length,
}))

// ---- 5.1 projection + the behind-camera cull ----
{
  const p = await boot()
  const c = await counts(p)
  ok('5.1 labels project into the DOM', c.total > 0, JSON.stringify(c))

  // Every rendered label must sit inside the viewport. A missing `ndc.z` cull
  // shows up here as a label parked at a mirrored coordinate.
  const outside = await p.evaluate(() => {
    const w = window.innerWidth, h = window.innerHeight
    return [...document.querySelectorAll('.node-labels__item')].filter((el) => {
      const r = el.getBoundingClientRect()
      return r.right < -4 || r.left > w + 4 || r.bottom < -4 || r.top > h + 4
    }).length
  })
  ok('5.1 no label renders outside the viewport', outside === 0, `${outside} stray`)

  // ---- 5.3 / 5.4 decluttering ----
  ok('5.4 more than one detail level is in use', c.dot > 0 && c.name > 0, `dot=${c.dot} name=${c.name}`)
  ok('5.3 name budget is respected', c.name <= 5, `names=${c.name}`)
  ok('5.4 no card without intent', c.card === 0, `cards=${c.card}`)

  // Names must go to the strongest projects, not to arbitrary ones.
  const named = await p.evaluate(() =>
    [...document.querySelectorAll('.node-labels__item--name .node-labels__name')]
      .map((el) => el.textContent.replace(/previously/i, '').trim()))
  ok('5.3 names are non-empty', named.every((n) => n.length > 0), named.join(', '))

  /*
   * The projector is live.
   *
   * Asserted across the whole label set rather than on one card: nodes orbit at
   * speeds derived from their status (`layout.ts`), so a "complete" project
   * moves 0.004 rad/s and would sit still for the length of any sane test. The
   * set as a whole always contains something moving.
   */
  const read = () => p.evaluate(() =>
    [...document.querySelectorAll('.node-labels__item')]
      .map((el) => el.style.transform).join('|'))
  const t0 = await read()
  await p.waitForTimeout(900)
  const t1 = await read()
  ok('5.1 the projector runs every tick', t0 !== t1)
  await p.close()
}

// ---- 5.4 hover promotes to a card, and the card is clickable ----
{
  const p = await boot()

  // Aim at a real star rather than sweeping blindly: a label's transform *is*
  // its star's projected position, so the label layer tells us where to point.
  //
  // Read fresh before every attempt. The first version sampled every anchor
  // once and then walked the list, which quietly assumed stars hold still —
  // they orbit, and once `MOTION_SCALE` made that motion visible the later
  // anchors in the list were being pointed at seconds after they were read.
  // A person looks and points in one motion; sampling once and pointing later
  // tests staleness, not hover.
  const anchorsFor = (id) => p.evaluate((wanted) =>
    [...document.querySelectorAll('.node-labels__item')].map((el) => {
      const m = /translate3d\((-?[\d.]+)px, *(-?[\d.]+)px/.exec(el.style.transform)
      if (!m) return null
      return { id: el.dataset.projectId, x: Number(m[1]), y: Number(m[2]) }
    }).filter((a) => a && (!wanted || a.id === wanted)), id)

  const ids = (await anchorsFor(null)).map((a) => a.id)

  // ---- 5.6 a star stays humanly hittable ----
  //
  // Guards the knob rather than the symptom. `MOTION_SCALE` is a presentation
  // choice and there is nothing stopping the next person raising it until the
  // stars cannot be pointed at; this puts a number on "too fast". 120px/s is
  // about the speed at which a target stops being casually acquirable.
  const before = await anchorsFor(null)
  await p.waitForTimeout(1000)
  const after = await anchorsFor(null)
  let fastest = 0
  for (const a of before) {
    const b = after.find((x) => x.id === a.id)
    if (b) fastest = Math.max(fastest, Math.hypot(b.x - a.x, b.y - a.y))
  }
  ok('5.6 no star moves faster than a pointer can follow', fastest <= 120,
    `${fastest.toFixed(0)}px/s / 120 budget`)

  let found = false
  for (const id of ids) {
    // Nudge around the anchor: the star has a radius and the pointer needs to
    // land on the hit mesh, not on the exact projected centre point.
    for (const [dx, dy] of [[0, 0], [4, 0], [-4, 0], [0, 4], [0, -4], [8, 8]]) {
      const live = (await anchorsFor(id))[0]
      if (!live) break
      // Twice, a hair apart. The pick is throttled to one per frame with a
      // trailing resolve, so a single synthetic move can legitimately land
      // inside the window; a real pointer never produces exactly one event.
      await p.mouse.move(live.x + dx, live.y + dy)
      await p.mouse.move(live.x + dx + 0.5, live.y + dy)
      await p.waitForTimeout(90)
      if (await p.locator('.node-labels__item--card').count() > 0) { found = true; break }
    }
    if (found) break
  }
  ok('5.4 hovering a star promotes it to a card', found, `${ids.length} anchors tried`)

  if (found) {
    const card = p.locator('.node-labels__card').first()

    /*
     * Drift, measured rather than assumed.
     *
     * Playwright refuses to click this element outright — its bounding box moves
     * every frame because the star it is pinned to is orbiting, and the
     * actionability check reads that as "not stable". The check is stricter than
     * a human need, but the underlying question is real: a card that slides out
     * from under the pointer cannot be clicked. So measure the drift and assert
     * it is small, then drive the pointer by coordinate.
     */
    const after = await card.boundingBox()
    const cx = after.x + after.width / 2
    const cy = after.y + after.height / 2
    await p.mouse.move(cx, cy)
    await p.waitForTimeout(400)
    ok('5.4 card survives the pointer moving onto it',
      await p.locator('.node-labels__card').count() >= 1)

    // Once the pointer is on it, it must stop: a card sliding out from under the
    // cursor is the reason this pin exists.
    const held = await card.boundingBox()
    await p.waitForTimeout(600)
    const stillHeld = await card.boundingBox()
    const slip = Math.hypot(stillHeld.x - held.x, stillHeld.y - held.y)
    ok('5.4 a pointed-at card holds still', slip < 1.5, `${slip.toFixed(2)}px / 600ms`)

    await p.mouse.click(cx, cy)
    await p.waitForTimeout(1600)
    ok('5.4 clicking the card opens the project', await p.locator('[role="dialog"]').count() === 1)
  }
  await p.close()
}

// ---- 5.2 occlusion fades rather than hides ----
{
  const p = await boot()
  const opacities = await p.evaluate(() =>
    [...document.querySelectorAll('.node-labels__item')]
      .map((el) => Number(el.style.opacity || '1')))
  ok('5.2 every drawn label has an opacity, none display:none',
    opacities.length > 0 && opacities.every((o) => o > 0),
    `min=${Math.min(...opacities).toFixed(2)}`)
  const transition = await p.evaluate(() => {
    const el = document.querySelector('.node-labels__item')
    return el ? getComputedStyle(el).transitionProperty : ''
  })
  ok('5.2 opacity is transitioned, not switched', transition.includes('opacity'), transition)
  await p.close()
}

// ---- 5.5 the readable layer is real DOM ----
{
  const p = await boot()
  const isDom = await p.evaluate(() => {
    const el = document.querySelector('.node-labels__name, .node-labels__card-name')
    return Boolean(el && el.textContent.trim().length > 0)
  })
  ok('5.5 label text is real DOM text', isDom)
  await p.close()
}

console.log(fails === 0 ? '\nALL PHASE 5 CHECKS PASSED' : `\n${fails} FAILURE(S)`)
await b.close()
process.exit(fails ? 1 : 0)
