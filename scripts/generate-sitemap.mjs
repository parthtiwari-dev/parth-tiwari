import { readdir, writeFile } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'

const siteUrl = 'https://parth-tiwari-1.vercel.app'
const distDirectory = join(process.cwd(), 'dist')

async function findHtml(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? findHtml(path) : [path]
  }))
  return files.flat()
}

function toPublicRoute(file) {
  const path = relative(distDirectory, file).split(sep).join('/')
  if (path === 'index.html') return '/'
  if (!path.endsWith('/index.html')) return undefined

  const route = `/${path.slice(0, -'index.html'.length)}`
  return ['/work/', '/notes/', '/about/', '/resume/', '/hire/'].some((root) => route.startsWith(root))
    ? route
    : undefined
}

const routes = (await findHtml(distDirectory))
  .map(toPublicRoute)
  .filter(Boolean)
  .sort((left, right) => left.localeCompare(right))

const urls = routes
  .map((route) => `  <url><loc>${siteUrl}${route}</loc></url>`)
  .join('\n')
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`

await writeFile(join(distDirectory, 'sitemap.xml'), sitemap, 'utf8')
console.log(`Generated sitemap.xml with ${routes.length} public routes.`)
