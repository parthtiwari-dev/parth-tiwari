import { createServer } from 'node:http'
import { readFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'
import { chromiumLaunchOptions } from './browser.mjs'

const ROOT = process.cwd()
const OUT = path.join(ROOT, '.shots', 'phase5-storyboard-lock')
const ENTRY = '/design/directions/phase-5-beatmind-storyboard.html'
const TYPES = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.png', 'image/png'],
  ['.woff2', 'font/woff2'],
])

function startServer() {
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url || '/', 'http://local').pathname)
      const resolved = path.resolve(ROOT, `.${pathname}`)
      if (!resolved.startsWith(`${ROOT}${path.sep}`)) return response.writeHead(403).end('Forbidden')
      const body = await readFile(resolved)
      response.writeHead(200, { 'content-type': TYPES.get(path.extname(resolved)) || 'application/octet-stream' })
      response.end(body)
    } catch {
      response.writeHead(404).end('Not found')
    }
  })
  return new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      if (!address || typeof address === 'string') return reject(new Error('No server port'))
      resolve({ server, origin: `http://127.0.0.1:${address.port}` })
    })
  })
}

await mkdir(OUT, { recursive: true })
const { server, origin } = await startServer()
const browser = await chromium.launch(chromiumLaunchOptions())

try {
  const viewports = [
    ['phone-390', { width: 390, height: 844 }],
    ['tablet-800', { width: 800, height: 1024 }],
    ['desktop-1440', { width: 1440, height: 900 }],
  ]
  for (const [name, viewport] of viewports) {
    const page = await browser.newPage({ viewport })
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto(`${origin}${ENTRY}`, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    const metrics = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      treatments: document.querySelectorAll('.treatment').length,
      scenes: document.querySelectorAll('.scene-list li').length,
      imageLoaded: document.querySelector('.machine-lock img')?.complete || false,
    }))
    await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true })
    console.log(`${name}: overflow ${metrics.overflow}px, ${metrics.treatments} treatments, ${metrics.scenes} scenes, image ${metrics.imageLoaded ? 'loaded' : 'missing'}, errors ${errors.length}`)
    if (metrics.overflow !== 0 || metrics.treatments !== 3 || metrics.scenes !== 10 || !metrics.imageLoaded || errors.length) process.exitCode = 1
    await page.close()
  }
} finally {
  await browser.close()
  await new Promise((resolve) => server.close(resolve))
}
