/**
 * Builds design/directions/register.html from register.template.html.
 *
 * Two jobs, both of which were defects in the last artifact:
 *
 *   1. Repeated markup is generated from ONE data structure. landing.html had
 *      five window screens hand-written, two of which silently pointed at
 *      elements that did not exist, so the frame froze while the caption moved.
 *   2. Images are inlined by filename. A missing file throws here rather than
 *      rendering an empty box in the published artifact.
 *
 * The rows are emitted as static HTML, not built by client script, because
 * REBUILD_BRIEF §3 requires every page to read with JavaScript off.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(here, '..')

const projects = JSON.parse(readFileSync(path.join(repo, '.projects.json'), 'utf8'))

/* Captures that exist on disk and are confirmed real, keyed by project id.
   Anything not listed renders the honest data panel instead of a mock-up. */
const SHOTS = {
  'beatmind':      { file: 'beatmind-arrangement-clean.png', alt: 'BeatMind arrangement view: 68 bars as section cards with chord names, above per-stem lanes.' },
  'stick-and-dot': { file: 'stick-and-dot-desktop.jpg', alt: 'Vivid’s storyboard tool: a scene prompt field, seed and style controls, and a four-shot grid waiting to render.' },
  'tathya':        { file: 'tathya-desktop.jpg',        alt: 'Tathya’s record feed: dated government stories, each with its source count and named entities beneath.' },
  'querypilot':    { file: 'querypilot-desktop.jpg',    alt: 'QueryPilot’s OpenAPI 3.1 documentation, listing the query and health endpoints and their request and response schemas.' },
  'support-core':  { file: 'support-core-desktop.jpg',  alt: 'Spur Chat’s support widget: an opening message from the assistant above four suggested questions and a message field.' },
}

const CASE_SHOTS = ['beatmind-arrangement-clean.png', 'beatmind-stems-clean.png', 'beatmind-desktop.jpg']

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const when = (s) => {
  const [y, m] = s.split('-')
  return `${MONTHS[Number(m) - 1]} ${y}`
}

const STATE = {
  active:        { label: 'Live', live: true },
  'in-progress': { label: 'In progress', live: false },
  complete:      { label: 'Shipped', live: false },
  experience:    { label: 'Running', live: false },
}
const TIER = { flagship: 'Flagship', major: 'Major', minor: 'Minor' }

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/* the ordering the page opens on: what it cost, then most recent first */
const WEIGHT = { flagship: 0, major: 1, minor: 2 }
const opening = [...projects].sort(
  (a, b) => WEIGHT[a.weight] - WEIGHT[b.weight] || b.started.localeCompare(a.started)
)

const rows = opening.map((p, i) => {
  const st = STATE[p.status] || { label: p.status, live: false }
  const shot = SHOTS[p.id]
  const stack = p.stack.slice(0, 5).join('  ·  ')
  const plate = shot
    ? `\n        <div class="row-plate has"><img src="__IMG_${shot.file}__" alt="${esc(shot.alt)}"></div>`
    : ''
  return `      <li>
        <button type="button" class="row"
          data-id="${p.id}" data-name="${esc(p.name)}"
          data-weight="${p.weight}" data-status="${p.status}" data-started="${p.started}"
          aria-label="Show the ${esc(p.name)} preview">
          <span class="no">${String(i + 1).padStart(2, '0')}</span>
          <span class="row-main">
            <span class="row-top">
              <span class="nm">${esc(p.name)}</span>
              <span class="meta"><span${st.live ? ' class="live"' : ''}>${st.label}</span></span>
            </span>
            <span class="tag">${esc(p.tag)}</span>
            <span class="meta">
              <span>${TIER[p.weight]}</span>
              <span>${when(p.started)}</span>
            </span>
            <span class="stk">${esc(stack)}</span>
          </span>
        </button>${plate}
      </li>`
}).join('\n')

const frames = opening.map((p) => {
  const shot = SHOTS[p.id]
  if (shot) {
    return `          <figure data-id="${p.id}"><img src="__IMG_${shot.file}__" alt="${esc(shot.alt)}"></figure>`
  }
  /* five lines is what the panel holds at its smallest; more overflowed and
     took the note with it. The count tells the reader there is more. */
  const shown = p.stack.slice(0, 5)
  const rest  = p.stack.length - shown.length
  const stack = shown.map((s, k) =>
    k === 0 ? `<em>${esc(s)}</em>` : esc(s))
    .concat(rest > 0 ? [`+ ${rest} more`] : [])
    .join('<br>')
  return `          <figure data-id="${p.id}" class="no-shot">
            <div class="ns-stack">${stack}</div>
            <div class="ns-note">No capture yet.<br>An empty slot beats a mocked-up one.</div>
          </figure>`
}).join('\n')

/* ---- assemble ---- */
let html = readFileSync(path.join(here, 'directions', 'register.template.html'), 'utf8')
html = html.replace('<!--REGISTER-->', rows.trimStart())
html = html.replace('<!--VIEWER-->', frames.trimStart())

/* ---- inline every capture, failing loudly on a missing file ---- */
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' }
const wanted = new Set([...html.matchAll(/__IMG_([^_]+(?:_[^_]+)*?)__/g)].map((m) => m[1]))
let bytes = 0
for (const file of wanted) {
  const p = path.join(repo, 'public', 'media', file)
  if (!existsSync(p)) throw new Error(`capture missing on disk: ${p}`)
  const buf = readFileSync(p)
  bytes += buf.length
  const uri = `data:${MIME[path.extname(file).toLowerCase()]};base64,${buf.toString('base64')}`
  html = html.split(`__IMG_${file}__`).join(uri)
}
if (/__IMG_/.test(html)) throw new Error('an image placeholder was left unresolved')

const out = path.join(here, 'directions', 'register.html')
writeFileSync(out, html)

console.log(`rows      ${opening.length}`)
console.log(`captures  ${wanted.size}  (${(bytes / 1024).toFixed(0)} KB raw)`)
console.log(`no shot   ${opening.filter((p) => !SHOTS[p.id]).map((p) => p.id).join(', ')}`)
console.log(`written   ${out}  ${(html.length / 1024 / 1024).toFixed(2)} MB`)
console.log(`unused    ${CASE_SHOTS.filter((f) => !wanted.has(f)).join(', ') || '-'}`)
