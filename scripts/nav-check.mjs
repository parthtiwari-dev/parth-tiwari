/**
 * Phase 4 navigation behaviour check.
 *
 * `shots.mjs` proves nothing rendered an error; this proves the scene actually
 * *behaves*. Every item in PLAN.md Phase 4 is a claim about what happens when
 * someone drags, taps, or opens a link, and none of that shows up in a
 * screenshot — the first run of this caught two real defects that typecheck,
 * build and the viewport matrix were all happy with: the scale readout reported
 * "constellation" for the whole guided path because nothing fed it outside free
 * mode, and the comparison label never appeared from the keyboard rail because
 * focus was wired to the scene click handler rather than to the overlay.
 *
 *   npm run dev &            # or vite preview
 *   node scripts/nav-check.mjs --url http://localhost:4400
 *
 * Exits non-zero on any failure. Run it after anything touching the camera,
 * the rig, the overlay or the project index.
 */

import { chromium } from 'playwright'
import { chromiumLaunchOptions } from './browser.mjs'
const args = process.argv.slice(2)
const urlFlag = args.indexOf('--url')
const B = urlFlag !== -1 && args[urlFlag + 1] ? args[urlFlag + 1] : 'http://localhost:4400'
const b = await chromium.launch(chromiumLaunchOptions())
let fails = 0
const ok = (name, cond, extra='') => { console.log(`${cond?'✓':'✗'} ${name}${extra?'  '+extra:''}`); if(!cond) fails++ }

async function boot(ctxOpts = {}) {
  const p = await (await b.newContext({viewport:{width:1280,height:820}, ...ctxOpts})).newPage()
  p.on('pageerror', e => { console.log('  PAGEERROR', e.message); fails++ })
  return p
}

// ---- 4.1 guided is the default arrival ----
{
  const p = await boot()
  await p.goto(B, {waitUntil:'load'}); await p.waitForTimeout(2500)
  await p.keyboard.press('Escape'); await p.waitForTimeout(3500)
  ok('4.1 arrives in guided mode', (await p.locator('.nav-controls__hint').count()) === 1)
  ok('4.1 no resume affordance yet', (await p.locator('.nav-controls__resume').count()) === 0)
  const scaleA = await p.locator('.nav-controls__scale-value').innerText()

  // ---- 4.2 drag unlocks free mode + resume tour appears ----
  const box = await p.locator('canvas').boundingBox()
  const cx = box.x+box.width/2, cy = box.y+box.height/2
  await p.mouse.move(cx, cy); await p.mouse.down()
  await p.mouse.move(cx+240, cy+40, {steps:20}); await p.mouse.up()
  await p.waitForTimeout(1200)
  ok('4.2 drag enters free mode', (await p.locator('.nav-controls__resume').count()) === 1)

  // ---- 4.5 three zoom scales ----
  await p.locator('button[aria-label="Zoom in one scale"]').click(); await p.waitForTimeout(1600)
  const scaleB = await p.locator('.nav-controls__scale-value').innerText()
  await p.locator('button[aria-label="Zoom in one scale"]').click(); await p.waitForTimeout(1600)
  const scaleC = await p.locator('.nav-controls__scale-value').innerText()
  ok('4.5 scale readout steps', scaleA!==scaleB && scaleB!==scaleC, `${scaleA} -> ${scaleB} -> ${scaleC}`)
  await p.screenshot({path:'.shots/p4-project-scale.png'})

  // ---- 4.2 resume tour returns to guided ----
  await p.locator('.nav-controls__resume').click(); await p.waitForTimeout(1400)
  ok('4.2 resume tour returns to guided', (await p.locator('.nav-controls__hint').count()) === 1)
  await p.close()
}

// ---- 4.7 deep link ----
{
  const p = await boot()
  await p.goto(`${B}/?project=tathya`, {waitUntil:'load'}); await p.waitForTimeout(4500)
  const dlg = await p.locator('[role="dialog"]').count()
  ok('4.7 ?project= opens that overlay', dlg === 1)
  ok('4.7 shows the right project', (await p.locator('[role="dialog"]').innerText()).includes('Tathya'))
  await p.keyboard.press('Escape'); await p.waitForTimeout(900)
  ok('4.7 closing clears the param', !p.url().includes('project='), p.url())
  await p.close()
}
{
  const p = await boot()
  await p.goto(`${B}/?project=not-a-real-id`, {waitUntil:'load'}); await p.waitForTimeout(4000)
  ok('4.7 unknown id is ignored', (await p.locator('[role="dialog"]').count()) === 0)
  await p.close()
}
{
  const p = await boot()
  await p.goto(`${B}/?plain=1&project=beatmind`, {waitUntil:'load'}); await p.waitForTimeout(2000)
  ok('4.7 preserves ?plain=1', (await p.locator('.plain-experience__section').count()) > 0)
  await p.close()
}

// ---- 8.18 closing a project is an undo ----
//
// This block used to assert 4.6's pairwise comparison — that closing a panel
// left its project focused so the previously-focused one stayed labelled and
// receding. That behaviour and the bug in 8.18 are the same thing seen from two
// sides: a project can only be focused by opening its panel, so "focus persists
// after close" *is* "the camera stays parked at SINGLE SYSTEM zoom on a star you
// did not ask to be parked at". The exit contract won; the ghost is gone with
// it, and the comparison machinery it drove is dead code pending removal.
{
  const p = await boot()
  await p.goto(B, {waitUntil:'load'}); await p.waitForTimeout(2500)
  await p.keyboard.press('Escape'); await p.waitForTimeout(3500)

  const scale = () => p.locator('.nav-controls__scale-value').innerText()
  const before = await scale()

  await p.locator('.project-index__toggle').click(); await p.waitForTimeout(600)
  await p.locator('.project-index__item').filter({hasText:/Tathya/i}).first().click()
  await p.waitForTimeout(1500); await p.keyboard.press('Escape'); await p.waitForTimeout(1800)

  ok('8.18 closing restores the scale it was opened from', (await scale()) === before, `${before} -> ${await scale()}`)
  ok('8.18 closing from guided does not strand free mode',
    (await p.locator('.nav-controls__resume').count()) === 0)
  ok('8.18 no ghost label survives the close',
    (await p.locator('.node-labels__item--comparison').count()) === 0)

  // A second project must unwind to the same place, not to the first one.
  await p.locator('.project-index__toggle').click(); await p.waitForTimeout(600)
  await p.locator('.project-index__item').filter({hasText:/BeatMind/i}).first().click()
  await p.waitForTimeout(1500); await p.keyboard.press('Escape'); await p.waitForTimeout(1800)
  ok('8.18 a second open unwinds to the same place', (await scale()) === before, `${before} -> ${await scale()}`)
  ok('8.18 still no ghost', (await p.locator('.node-labels__item--comparison').count()) === 0)

  await p.screenshot({path:'.shots/p4-panel-exit.png'})
  await p.close()
}

// ---- 4.8 explicit controls on a phone, with touch ----
{
  const p = await boot({viewport:{width:390,height:844}, hasTouch:true, isMobile:true, deviceScaleFactor:3})
  await p.goto(B, {waitUntil:'load'}); await p.waitForTimeout(2500)
  await p.keyboard.press('Escape'); await p.waitForTimeout(3500)
  const zin = p.locator('button[aria-label="Zoom in one scale"]')
  ok('4.8 zoom controls exist on phone', await zin.count() === 1)
  const bb = await zin.boundingBox()
  ok('4.8 target is thumb-sized', bb.width >= 40 && bb.height >= 40, `${Math.round(bb.width)}x${Math.round(bb.height)}`)
  await zin.tap(); await p.waitForTimeout(1500)
  ok('4.8 tap enters free mode', (await p.locator('.nav-controls__resume').count()) === 1)
  await p.screenshot({path:'.shots/p4-phone.png'})
  await p.close()
}

// ---- 8.16 a phone can actually scroll the page ----
//
// The one thing 300 captured frames could never show. `frames.mjs` moves the
// page with `window.scrollTo`, which bypasses touch handling entirely — so a
// canvas that refuses every touch gesture looks identical in every frame to one
// that does not. `@tresjs/core` sets `touch-action: none` inline on its canvas,
// and that canvas is sticky at full height for the first four screens of this
// document, so the page could not be scrolled by touch at all.
//
// It has to be a synthesised *touch* gesture through CDP: Playwright's
// `mouse.wheel` and `tap` both go around the code path that broke.
{
  const p = await boot({viewport:{width:390,height:844}, hasTouch:true, isMobile:true, deviceScaleFactor:3})
  const cdp = await p.context().newCDPSession(p)
  await p.goto(B, {waitUntil:'load'}); await p.waitForTimeout(2500)
  await p.keyboard.press('Escape'); await p.waitForTimeout(3500)

  const touchAction = await p.evaluate(() => getComputedStyle(document.querySelector('canvas')).touchAction)
  ok('8.16 canvas leaves the vertical axis to the page', touchAction.includes('pan-y'), touchAction)

  async function swipe(dx, dy) {
    const x = 195, y0 = 480
    await cdp.send('Input.dispatchTouchEvent', {type:'touchStart', touchPoints:[{x, y:y0}]})
    for (let i = 1; i <= 15; i++) {
      await cdp.send('Input.dispatchTouchEvent', {
        type:'touchMove',
        touchPoints:[{x: x + dx * i / 15, y: y0 + dy * i / 15}],
      })
      await p.waitForTimeout(16)
    }
    await cdp.send('Input.dispatchTouchEvent', {type:'touchEnd', touchPoints:[]})
    await p.waitForTimeout(1100)
    return p.evaluate(() => ({
      y: Math.round(window.scrollY),
      free: (document.querySelectorAll('.nav-controls__resume').length > 0),
    }))
  }

  const down = await swipe(0, -300)
  ok('8.16 a vertical swipe scrolls the page', down.y > 100, `scrollY ${down.y}`)
  // And it must not steal the tour: `pan-y` still delivers a few pointermoves
  // before the browser claims the gesture, which was enough to flip the scene
  // into free orbit on every swipe and stop the camera following scroll.
  ok('8.16 scrolling does not leave guided mode', !down.free)

  await p.evaluate(() => window.scrollTo({top: 0, behavior: 'instant'}))
  await p.waitForTimeout(900)
  const across = await swipe(260, 0)
  ok('8.16 a horizontal swipe still orbits', across.free && across.y === 0, `scrollY ${across.y}`)
  await p.close()
}

console.log(fails === 0 ? '\nALL PHASE 4 CHECKS PASSED' : `\n${fails} FAILURE(S)`)
await b.close()
process.exit(fails ? 1 : 0)
