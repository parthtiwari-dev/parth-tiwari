import { readdir, readFile } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'

const root = process.cwd()
const dist = join(root, 'dist')
const siteUrl = 'https://parth-tiwari-1.vercel.app'
const publishedProjects = [
  'beatmind',
  'vivid',
  'tathya',
  'medrag',
  'order-supervisor',
  'querypilot',
  'secondself',
  'oncoverse',
  'upi-fraud-engine',
  'spur-chat',
]
const deferredProjects = ['fraud-risk-intelligence', 'oracle-auto-provision']
const worldsDir = join(root, 'src', 'content', 'worlds')
const publishedWorlds = new Set(
  (await Promise.all(
    (await readdir(worldsDir))
      .filter((name) => name.endsWith('.json'))
      .map(async (name) => JSON.parse(await readFile(join(worldsDir, name), 'utf8'))),
  ))
    .filter((world) => world.published)
    .map((world) => world.projectSlug),
)

const failures = []
const assert = (condition, message) => {
  if (!condition) failures.push(message)
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  return (await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? walk(path) : [path]
  }))).flat()
}

const htmlFiles = (await walk(dist)).filter((file) => file.endsWith('.html'))
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8')
  const label = relative(dist, file).split(sep).join('/')
  assert(html.includes('rel="canonical"'), `${label} is missing a canonical link`)
  assert(html.includes('property="og:title"'), `${label} is missing Open Graph title metadata`)
  assert(html.includes('name="twitter:card"'), `${label} is missing Twitter card metadata`)
  assert(html.includes('type="application/ld+json"'), `${label} is missing JSON-LD`)
  assert(html.includes('rel="icon"'), `${label} is missing a favicon link`)
  assert(!/Phase 2 architecture demo|The complete register \/ Phase 2 review/.test(html), `${label} contains owner-only Phase 2 scaffolding copy`)
}

const home = await readFile(join(dist, 'index.html'), 'utf8')
for (const slug of publishedProjects) {
  const expectedHref = publishedWorlds.has(slug) ? `/work/${slug}/world/` : `/work/${slug}/`
  assert(home.includes(`href="${expectedHref}"`), `home is missing the published ${slug} project door at ${expectedHref}`)
}
for (const slug of deferredProjects) {
  assert(!home.includes(`href="/work/${slug}/"`), `home links the deferred ${slug} route`)
}
assert((home.match(/class="project-row[^" ]*/g) ?? []).length === 12, 'home does not render exactly twelve project rows')
assert((home.match(/<a class="project-row/g) ?? []).length === 10, 'home does not render exactly ten linked project rows')

const notFound = await readFile(join(dist, '404.html'), 'utf8')
assert(notFound.includes('noindex,follow'), '404.html is missing noindex,follow')

const rss = await readFile(join(dist, 'rss.xml'), 'utf8')
assert((rss.match(/<item>/g) ?? []).length === 12, 'RSS does not contain exactly twelve published notes')

const sitemap = await readFile(join(dist, 'sitemap.xml'), 'utf8')
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
const expectedSitemapRoutes = htmlFiles
  .map((file) => relative(dist, file).split(sep).join('/'))
  .filter((path) => path === 'index.html' || path.endsWith('/index.html'))
  .filter((path) => path !== '404.html')
assert(
  sitemapUrls.length === expectedSitemapRoutes.length,
  `sitemap contains ${sitemapUrls.length} routes instead of ${expectedSitemapRoutes.length} emitted public HTML routes`,
)
assert(sitemapUrls.every((url) => url.startsWith(siteUrl)), 'sitemap contains a URL outside the verified preview origin')
for (const slug of publishedProjects) {
  assert(sitemapUrls.includes(`${siteUrl}/work/${slug}/`), `sitemap is missing /work/${slug}/`)
}
for (const slug of deferredProjects) {
  assert(!sitemapUrls.includes(`${siteUrl}/work/${slug}/`), `sitemap includes deferred /work/${slug}/`)
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`)
  process.exit(1)
}

console.log(`PASS ${htmlFiles.length} HTML pages carry canonical, social, JSON-LD and favicon metadata`)
console.log('PASS home exposes ten resolved project doors and keeps two deferred rows non-clickable')
console.log('PASS 404 output is noindex and RSS contains twelve published notes')
console.log(`PASS sitemap contains all ${sitemapUrls.length} emitted public routes on the verified preview origin`)
console.log('PASS public HTML contains no Phase 2 owner scaffolding copy')
