/**
 * Pixel parity between an owner-approved study in design/directions and its production
 * world route. For every chapter at 390, 800 and 1440 pixels both pages are scrolled to the
 * same chapter position, allowed to settle and captured; the report counts pixels whose
 * largest channel difference exceeds a tolerance that absorbs WebP encoding of the
 * paintings. Diff images are written for any frame above the threshold so a person can see
 * exactly what moved. Development evidence only; the world gate owns pass/fail.
 *
 *   node scripts/world-parity-check.mjs [slug]
 */
import { createServer } from 'node:http'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'
import sharp from 'sharp'
import { chromiumLaunchOptions } from './browser.mjs'
import { createStudyServer } from './world-study-server.mjs'

const root = process.cwd()
const dist = path.resolve('dist')
const only = process.argv[2]
const tolerance = 40
const threshold = 0.5
const studies = {
  medrag: 'medrag-world.html',
  secondself: 'secondself-world.html',
  querypilot: 'querypilot-world.html',
  'order-supervisor': 'order-supervisor-world.html',
  'upi-fraud-engine': 'upi-fraud-engine-world.html',
}
const viewports = [
  { name: '390', width: 390, height: 844, touch: true },
  { name: '800', width: 800, height: 1024, touch: true },
  { name: '1440', width: 1440, height: 900, touch: false },
]
const mime = new Map([['.html', 'text/html; charset=utf-8'], ['.css', 'text/css'], ['.js', 'text/javascript'], ['.webp', 'image/webp'], ['.png', 'image/png'], ['.jpg', 'image/jpeg'], ['.svg', 'image/svg+xml'], ['.woff2', 'font/woff2']])

const production = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://127.0.0.1')
    const requested = url.pathname.endsWith('/') ? `${url.pathname}index.html` : url.pathname
    const filename = path.resolve(dist, `.${decodeURIComponent(requested)}`)
    if (!filename.startsWith(dist)) throw new Error('Path escapes dist.')
    response.writeHead(200, { 'content-type': mime.get(path.extname(filename)) ?? 'application/octet-stream' }).end(await readFile(filename))
  } catch { response.writeHead(404).end('Not found') }
})
const study = createStudyServer(root)
await Promise.all([production, study].map((server) => new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))))
const productionBase = `http://127.0.0.1:${production.address().port}`
const studyBase = `http://127.0.0.1:${study.address().port}`

const specs = []
for (const name of (await readdir(path.join(root, 'scripts', 'world-gates'))).filter((file) => file.endsWith('.mjs'))) {
  const spec = (await import(pathToFileURL(path.join(root, 'scripts', 'world-gates', name)).href)).default
  if ((!only || spec.slug === only) && studies[spec.slug]) specs.push(spec)
}

const capture = async (page, url, spec, index) => {
  await page.goto(url, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(({ index, activation }) => {
    const scene = document.querySelectorAll('[data-world-scene], [data-study-scene]')[index]
    const top = scene.getBoundingClientRect().top + window.scrollY
    const y = activation === 'center'
      ? top + scene.offsetHeight / 2 - window.innerHeight / 2
      : top - window.innerHeight * 0.25 + Math.min(scene.offsetHeight * 0.45, window.innerHeight * 0.6)
    window.scrollTo({ top: Math.max(0, y), behavior: 'instant' })
  }, { index, activation: spec.activation ?? 'offset' })
  await page.waitForTimeout(spec.parityWaitMs ?? 1100)
  return page.screenshot({ type: 'png' })
}

const browser = await chromium.launch(chromiumLaunchOptions())
const report = []
try {
  for (const spec of specs) {
    const output = path.resolve('.shots', 'world-parity', spec.slug)
    await mkdir(output, { recursive: true })
    for (const viewport of viewports) {
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, hasTouch: viewport.touch, isMobile: viewport.touch, reducedMotion: 'no-preference' })
      const page = await context.newPage()
      for (let index = 0; index < spec.scenes; index += 1) {
        const before = await capture(page, `${studyBase}/design/directions/${studies[spec.slug]}`, spec, index)
        const after = await capture(page, `${productionBase}/work/${spec.slug}/world/`, spec, index)
        const [a, b] = await Promise.all([before, after].map((png) => sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true })))
        const { width, height } = a.info
        const mask = Buffer.alloc(width * height * 3)
        let changed = 0
        for (let pixel = 0; pixel < width * height; pixel += 1) {
          const offset = pixel * 3
          const delta = Math.max(Math.abs(a.data[offset] - b.data[offset]), Math.abs(a.data[offset + 1] - b.data[offset + 1]), Math.abs(a.data[offset + 2] - b.data[offset + 2]))
          if (delta > tolerance) {
            changed += 1
            mask[offset] = 255
          } else {
            const grey = Math.round(a.data[offset] * 0.3) + 20
            mask[offset] = grey; mask[offset + 1] = grey; mask[offset + 2] = grey
          }
        }
        const percent = (changed / (width * height)) * 100
        const label = `${viewport.name}-scene-${String(index + 1).padStart(2, '0')}`
        if (percent > threshold) {
          await sharp(before).toFile(path.join(output, `${label}-study.png`))
          await sharp(after).toFile(path.join(output, `${label}-production.png`))
          await sharp(mask, { raw: { width, height, channels: 3 } }).png().toFile(path.join(output, `${label}-diff.png`))
        }
        report.push({ slug: spec.slug, viewport: viewport.name, scene: index + 1, percent: Number(percent.toFixed(3)) })
        console.log(`${percent > threshold ? 'DIFF' : 'SAME'} ${spec.slug} ${label}: ${percent.toFixed(3)}% pixels differ beyond ${tolerance}/255`)
      }
      await context.close()
    }
  }
} finally {
  await browser.close()
  await Promise.all([production, study].map((server) => new Promise((resolve) => server.close(resolve))))
}
await mkdir(path.resolve('.shots', 'world-parity'), { recursive: true })
await writeFile(path.resolve('.shots', 'world-parity', `report${only ? `-${only}` : ''}.json`), `${JSON.stringify(report, null, 2)}\n`)
const worst = report.reduce((max, entry) => Math.max(max, entry.percent), 0)
console.log(`${report.filter((entry) => entry.percent > threshold).length} of ${report.length} frames differ by more than ${threshold}%; worst ${worst.toFixed(3)}%`)
