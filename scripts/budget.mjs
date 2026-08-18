/**
 * Eager-entry bundle budget.
 *
 * What every visitor downloads before first paint — plain mode, every phone,
 * every reduced-motion user, every crawler. The 3D engine is behind
 * `defineAsyncComponent` in `App.vue` specifically so that none of them pay for
 * it (PLAN.md 0.1).
 *
 * That guarantee has broken twice, silently, both times because something in the
 * eager import graph reached a module that transitively imports `three`:
 *
 *   - a `manualChunks` rule for three made Rolldown emit a `modulepreload` for
 *     it, so the lazy boundary was bypassed at the network layer (vite.config.ts)
 *   - `data/layout.ts` imported `three` for `Vector3` and three `MathUtils`
 *     helpers, and `ProjectIndex` — a static import — reads `layoutFor()`. The
 *     entry chunk was 796.96 kB.
 *
 * Neither failed typecheck, neither failed the build, and neither showed up in a
 * screenshot. A number is the only thing that catches this.
 *
 *   npm run budget          # after npm run build
 *
 * ---------------------------------------------------------------------------
 * The eager graph is read from index.html, not guessed from chunk names.
 * ---------------------------------------------------------------------------
 * An earlier version of this file put a ceiling on the `SceneRoot-*` chunk by
 * name. That measured an accident: at the time the bundler happened to split
 * three into its own chunk, and a Vite bump later merged it back into
 * SceneRoot's, which tripped the check even though the lazy boundary was
 * perfectly intact. How the bundler splits *lazily loaded* code is its business.
 * What matters is the set of files index.html tells the browser to fetch
 * immediately — the entry script plus every `modulepreload` — because that set
 * is exactly what a visitor pays for before anything renders.
 *
 * Exits non-zero on a breach. Raising a ceiling is a deliberate decision that
 * belongs in a commit message, not a silent drift.
 */

import { readFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
import path from 'node:path'

const DIST = path.resolve('dist')

/** Gzip, because it is what crosses the wire. */
const EAGER_GZIP_BUDGET_KB = 130

/**
 * Modules that must never be reachable eagerly. `WebGLRenderer` is the marker
 * for three itself: it survives minification because it is a class name used in
 * error strings, and nothing else in the app defines it.
 */
const FORBIDDEN = [
  { needle: 'WebGLRenderer', why: 'three.js is in the eager graph' },
]

/** The entry script and everything index.html preloads alongside it. */
async function eagerGraph() {
  const html = await readFile(path.join(DIST, 'index.html'), 'utf8')
  const hrefs = [
    ...html.matchAll(/<script[^>]+src="([^"]+\.js)"/g),
    ...html.matchAll(/<link[^>]+rel="modulepreload"[^>]+href="([^"]+\.js)"/g),
  ].map((match) => match[1])
  return [...new Set(hrefs)]
}

async function main() {
  let files
  try {
    files = await eagerGraph()
  } catch {
    console.error(`No build found at ${DIST}. Run \`npm run build\` first.`)
    process.exit(1)
  }

  if (files.length === 0) {
    console.error('FAIL  index.html references no JS at all — the build is wrong.')
    process.exit(1)
  }

  let failures = 0
  let totalGzip = 0

  for (const href of files) {
    const source = await readFile(path.join(DIST, href.replace(/^\//, '')))
    const gzipKb = gzipSync(source).length / 1024
    totalGzip += gzipKb
    console.log(`  eager  ${path.basename(href).padEnd(32)} ${gzipKb.toFixed(2)} kB gzip`)

    const text = source.toString('utf8')
    for (const { needle, why } of FORBIDDEN) {
      if (text.includes(needle)) {
        console.error(`FAIL  ${why} — "${needle}" found in ${path.basename(href)}`)
        failures += 1
      }
    }
  }

  const ok = totalGzip <= EAGER_GZIP_BUDGET_KB
  console.log(
    `\n${ok ? 'ok  ' : 'FAIL'}  eager total ${totalGzip.toFixed(2)} kB gzip `
    + `/ ${EAGER_GZIP_BUDGET_KB} kB budget, across ${files.length} file(s)`,
  )
  if (!ok) failures += 1

  if (failures === 0) console.log('ok    three.js is absent from every eagerly-loaded file')

  if (failures > 0) {
    console.error(
      `\n${failures} budget failure(s). Something a static import in App.vue `
      + 'pulls in is reaching the scene layer.',
    )
    process.exit(1)
  }

  console.log('\nAll bundle budgets met.')
}

main()
