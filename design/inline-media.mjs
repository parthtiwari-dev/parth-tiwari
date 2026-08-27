/**
 * Inlines __IMG_<file>__ placeholders from public/media into a template.
 *
 * A published artifact cannot fetch external images, so every asset has to be a
 * data URI. Doing it here rather than by hand means a missing file throws at
 * build time instead of rendering an empty box in the published page.
 *
 *   node design/inline-media.mjs <template.html> <out.html>
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import path from 'node:path'

const [tpl, out] = process.argv.slice(2)
if (!tpl || !out) throw new Error('usage: inline-media.mjs <template> <out>')

const MIME = { '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.avif':'image/avif' }
let html = readFileSync(tpl, 'utf8')
const wanted = new Set([...html.matchAll(/__IMG_([^_]+(?:_[^_]+)*?)__/g)].map(m => m[1]))
let bytes = 0
for (const file of wanted) {
  const p = path.resolve('public/media', file)
  if (!existsSync(p)) throw new Error(`asset missing on disk: ${p}`)
  const buf = readFileSync(p)
  bytes += buf.length
  html = html.split(`__IMG_${file}__`).join(
    `data:${MIME[path.extname(file).toLowerCase()]};base64,${buf.toString('base64')}`)
}
if (/__IMG_/.test(html)) throw new Error('an image placeholder was left unresolved')
writeFileSync(out, html)
console.log(`inlined ${wanted.size} asset(s), ${(bytes/1024).toFixed(0)} KB raw -> ${out} ${(html.length/1024/1024).toFixed(2)} MB`)
