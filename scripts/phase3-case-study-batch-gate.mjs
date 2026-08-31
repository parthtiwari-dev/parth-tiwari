import assert from 'node:assert/strict'
import { access, readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const dist = path.join(root, 'dist')
const published = [
  'beatmind', 'vivid', 'tathya', 'medrag', 'order-supervisor', 'querypilot',
  'secondself', 'oncoverse', 'upi-fraud-engine', 'spur-chat',
]
const deferred = ['fraud-risk-intelligence', 'oracle-auto-provision']

const exists = async (target) => access(target).then(() => true).catch(() => false)
const read = (target) => readFile(target, 'utf8')
const count = (text, pattern) => [...text.matchAll(pattern)].length

assert(await exists(dist), 'dist must exist; run npm run build first')

for (const slug of published) {
  const file = path.join(dist, 'work', slug, 'index.html')
  assert(await exists(file), `published route missing: /work/${slug}/`)
  const html = await read(file)
  assert.equal(count(html, /<section\b[^>]*data-case-chapter/g), 10, `${slug} must keep all ten reading chapters`)
  assert.equal(count(html, /<figure\b[^>]*data-proof-surface/g), 4, `${slug} must expose one lead and three workflow proofs`)
  assert(count(html, /class="measurement-ledger"/g) === 1, `${slug} must render an evidence ledger`)
  for (const tag of html.match(/<img\b[^>]*>/g) ?? []) {
    assert(/\balt="[^"]+"/.test(tag), `${slug} contains an image without useful alt text`)
    assert(/\bwidth="\d+"/.test(tag) && /\bheight="\d+"/.test(tag), `${slug} contains an image without intrinsic dimensions`)
  }
  for (const tag of html.match(/<video\b[^>]*>/g) ?? []) {
    assert(/\bcontrols\b/.test(tag), `${slug} video must retain controls`)
    assert(/\bposter="[^"]+"/.test(tag), `${slug} video must retain a poster`)
  }
}

for (const slug of deferred) {
  assert.equal(await exists(path.join(dist, 'work', slug, 'index.html')), false, `deferred route must not emit: ${slug}`)
}

const htmlFiles = []
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) await collect(target)
    else if (entry.name.endsWith('.html')) htmlFiles.push(target)
  }
}
await collect(dist)

const privatePatterns = [
  /C:\\great learning self paced/i,
  /C:\/great learning self paced/i,
  /sk-[A-Za-z0-9]{20,}/,
  /BEGIN (?:RSA |OPENSSH )?PRIVATE KEY/,
]

for (const file of htmlFiles) {
  const html = await read(file)
  for (const pattern of privatePatterns) assert.equal(pattern.test(html), false, `${path.relative(dist, file)} exposes private source material`)
  for (const href of html.matchAll(/href="(\/[^"]*)"/g)) {
    const raw = href[1]
    if (raw.startsWith('/_astro/') || raw.startsWith('/media/')) continue
    const pathname = raw.split('#')[0].split('?')[0]
    if (!pathname) continue
    const target = pathname.endsWith('/')
      ? path.join(dist, pathname, 'index.html')
      : path.extname(pathname)
        ? path.join(dist, pathname)
        : path.join(dist, pathname, 'index.html')
    assert(await exists(target), `${path.relative(dist, file)} links to missing ${raw}`)
  }
}

const register = await read(path.join(dist, 'work', 'index.html'))
assert.equal(count(register, /class="row-availability"/g), 2, 'work register must show exactly two deferred states')
for (const slug of deferred) {
  assert.equal(register.includes(`/work/${slug}/`), false, `${slug} must not be linked from the register`)
}

console.log(`PASS ${published.length} published case-study routes emit with complete proof and chapter contracts`)
console.log(`PASS ${deferred.length} deferred projects emit no route and no register anchor`)
console.log(`PASS ${htmlFiles.length} built HTML pages contain no missing internal links or private-path patterns`)
