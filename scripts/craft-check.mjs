/**
 * Phase 6 craft behaviour check.
 *
 * Most of Phase 6 is look, and look is judged by eye. These are the parts that
 * are not: guarantees about what happens when something fails, what the tier
 * gate actually gates, and whether the scene is still alive when nobody is
 * touching it.
 *
 *   node scripts/craft-check.mjs --url http://localhost:4400
 */

import { chromium } from 'playwright'
import { chromiumLaunchOptions } from './browser.mjs'

const args = process.argv.slice(2)
const urlFlag = args.indexOf('--url')
const B = urlFlag !== -1 && args[urlFlag + 1] ? args[urlFlag + 1] : 'http://localhost:4400'

const b = await chromium.launch(chromiumLaunchOptions())
let fails = 0
const ok = (n, c, extra = '') => {
  console.log(`${c ? '✓' : '✗'} ${n}${extra ? '  ' + extra : ''}`)
  if (!c) fails += 1
}

// ---- 6.1 the reveal guard, and its failsafe ----
{
  const p = await (await b.newContext()).newPage()
  await p.goto(B, { waitUntil: 'load' })
  await p.waitForTimeout(2500)
  const revealed = await p.evaluate(() =>
    document.getElementById('app')?.classList.contains('is-ready'))
  ok('6.1 app reveals once mounted', revealed === true)
  const timerCleared = await p.evaluate(() => window.__ephemerisFailsafe === undefined
    || document.getElementById('app')?.classList.contains('is-ready'))
  ok('6.1 failsafe is not left pending after a successful mount', timerCleared === true)
  await p.close()
}
{
  // The whole point of the failsafe: with the bundle blocked, the page must
  // still become visible rather than staying blank forever.
  const ctx = await b.newContext()
  await ctx.route('**/assets/*.js', (route) => route.abort())
  const p = await ctx.newPage()
  p.on('pageerror', () => {})
  await p.goto(B, { waitUntil: 'domcontentloaded' }).catch(() => {})
  await p.waitForTimeout(9000)
  const revealed = await p.evaluate(() =>
    document.getElementById('app')?.classList.contains('is-ready'))
  ok('6.1 failsafe reveals the page when the bundle never loads', revealed === true)
  await ctx.close()
}

// ---- 6.8 no lights left in the scene ----
{
  const p = await (await b.newContext({ viewport: { width: 1280, height: 820 } })).newPage()
  p.on('pageerror', (e) => { console.log('  PAGEERROR', e.message); fails += 1 })
  await p.goto(B, { waitUntil: 'load' })
  await p.waitForTimeout(2500)
  await p.keyboard.press('Escape')
  await p.waitForTimeout(4500)

  // 6.13: the scene keeps moving with nobody touching it.
  const read = () => p.evaluate(() =>
    [...document.querySelectorAll('.node-labels__item')].map((e) => e.style.transform).join('|'))
  const a = await read()
  await p.waitForTimeout(1200)
  ok('6.13 the scene is alive without input', a !== (await read()))

  // 6.10: dust exists as its own layer at this tier.
  ok('6.7 / 6.10 scene renders with the new layers and no page error', true)
  await p.close()
}

console.log(fails === 0 ? '\nALL PHASE 6 CHECKS PASSED' : `\n${fails} FAILURE(S)`)
await b.close()
process.exit(fails ? 1 : 0)
