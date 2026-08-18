/**
 * Eager-entry bundle budget.
 *
 * The entry chunk is what every visitor downloads before first paint — plain
 * mode, every phone, every reduced-motion user, every crawler. The 3D engine is
 * behind `defineAsyncComponent` in `App.vue` specifically so that none of them
 * pay for it (PLAN.md 0.1).
 *
 * That guarantee has now broken twice, silently, both times because a module in
 * the eager import graph reached something that transitively imports `three`:
 *
 *   - a `manualChunks` rule for three made Rolldown emit a `modulepreload` for
 *     it, so the lazy boundary was bypassed at the network layer (vite.config.ts)
 *   - `data/layout.ts` imported `three` for `Vector3` and three `MathUtils`
 *     helpers, and `ProjectIndex` — a static import — reads `layoutFor()`. The
 *     entry chunk was 796.96 kB.
 *
 * Neither failed typecheck, neither failed the build, and neither showed up in a
 * screenshot. A number is the only thing that catches this, so here it is.
 *
 *   npm run budget          # after npm run build
 *
 * Exits non-zero on a breach. Raising a ceiling is a deliberate decision that
 * belongs in a commit message, not a silent drift.
 */

import { readFile, readdir } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
import path from 'node:path'

const ASSETS = path.resolve('dist/assets')

/**
 * Gzip, not raw: it is what crosses the wire. Ceilings sit a little above the
 * current figures so ordinary feature work does not trip them, and far below
 * the regression they exist to catch.
 */
const BUDGETS = [
  { label: 'eager entry (index)', match: /^index-.*\.js$/, maxGzipKb: 60 },
  { label: 'lazy scene (SceneRoot)', match: /^SceneRoot-.*\.js$/, maxGzipKb: 40 },
]

/**
 * Modules that must never reach the eager entry. `WebGLRenderer` is the marker
 * for three itself: it survives minification because it is a class name used in
 * error strings, and nothing else in the app defines it.
 */
const FORBIDDEN_IN_ENTRY = [
  { needle: 'WebGLRenderer', why: 'three.js is in the eager entry chunk' },
]

async function main() {
  let files
  try {
    files = await readdir(ASSETS)
  } catch {
    console.error(`No build found at ${ASSETS}. Run \`npm run build\` first.`)
    process.exit(1)
  }

  let failures = 0

  for (const budget of BUDGETS) {
    const name = files.find((f) => budget.match.test(f))
    if (!name) {
      console.error(`FAIL  ${budget.label}: no chunk matched ${budget.match}`)
      failures += 1
      continue
    }

    const source = await readFile(path.join(ASSETS, name))
    const gzipKb = gzipSync(source).length / 1024
    const ok = gzipKb <= budget.maxGzipKb

    console.log(
      `${ok ? 'ok  ' : 'FAIL'}  ${budget.label.padEnd(24)} `
      + `${gzipKb.toFixed(2)} kB gzip / ${budget.maxGzipKb} kB budget  (${name})`,
    )
    if (!ok) failures += 1
  }

  const entryName = files.find((f) => /^index-.*\.js$/.test(f))
  if (entryName) {
    const entry = await readFile(path.join(ASSETS, entryName), 'utf8')
    for (const { needle, why } of FORBIDDEN_IN_ENTRY) {
      if (entry.includes(needle)) {
        console.error(`FAIL  ${why} — found "${needle}" in ${entryName}`)
        failures += 1
      } else {
        console.log(`ok    "${needle}" absent from the eager entry`)
      }
    }
  }

  if (failures > 0) {
    console.error(
      `\n${failures} budget failure(s). Something in the eager import graph is `
      + 'reaching the scene layer — check what a static import in App.vue pulls in.',
    )
    process.exit(1)
  }

  console.log('\nAll bundle budgets met.')
}

main()
