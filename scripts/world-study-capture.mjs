/** Evidence for local studies, deliberately independent of production world gates. */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'
import { chromiumLaunchOptions } from './browser.mjs'
import { createStudyServer } from './world-study-server.mjs'

const selected = process.argv.find((arg) => arg.startsWith('--slug='))?.split('=')[1]
if (selected === 'medrag' || selected === 'secondself') throw new Error('Use cinematic-study-gate.mjs --slug=' + selected + ' for the generated world studies')
const studies = selected ? [selected] : ['order-supervisor']
if (studies.some((slug) => !['medrag', 'order-supervisor'].includes(slug))) throw new Error('Unknown study')
const server = createStudyServer()
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const base = `http://127.0.0.1:${server.address().port}`
const output = path.resolve('.shots/world-batch-1')
await mkdir(output, { recursive: true })
const failures = [], results = []
let browser
try {
  browser = await chromium.launch(chromiumLaunchOptions())
  for (const slug of studies) {
    for (const width of [390, 800, 1440]) {
      const height = width === 390 ? 844 : width === 800 ? 1024 : 900
      const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'no-preference' })
      const page = await context.newPage(), errors = [], requests = []
      page.on('pageerror', (error) => errors.push(error.message))
      page.on('response', (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`) })
      page.on('request', (request) => { if (!request.url().startsWith(base)) requests.push(request.url()) })
      await page.goto(`${base}/design/directions/${slug}-world.html`)
      await page.evaluate(() => document.fonts.ready)
      const scenes = page.locator('[data-study-scene]')
      const count = await scenes.count(), states = []
      for (let index = 0; index < count; index++) {
        await scenes.nth(index).evaluate((scene) => {
          const stage = document.querySelector('[data-study-stage]').getBoundingClientRect()
          const stacked = stage.width > innerWidth * .85
          const copy = scene.querySelector('.copy') ?? scene
          const isWatch = !!document.getElementById("camera")
          const target = isWatch ? (innerWidth <= 900 ? innerHeight * .50 : 155) : stacked ? stage.bottom + 28 : 155
          scrollTo(0, scrollY + copy.getBoundingClientRect().top - target)
        })
        if (slug === 'order-supervisor') {
          await page.waitForTimeout(1200)
          await page.screenshot({ path: path.join(output, `${slug}-${width}-scene-${index + 1}-motion.png`) })
          await page.waitForTimeout(1900)
        } else await page.waitForTimeout(850)
        const state = await page.evaluate(() => ({
          active: document.body.dataset.scene ?? document.documentElement.dataset.scene,
          overflow: document.documentElement.scrollWidth - innerWidth,
          h1: document.querySelectorAll('h1').length,
          fonts: document.fonts.status,
        }))
        states.push(state)
        await page.screenshot({ path: path.join(output, `${slug}-${width}-scene-${index + 1}.png`) })
      }
      if (slug === 'order-supervisor') {
        const before = await page.evaluate(() => window.__orderStudy.draws)
        await page.waitForTimeout(350)
        const idle = await page.evaluate(() => ({ ...window.__orderStudy }))
        if (idle.running || idle.draws !== before || idle.maxDraw > 50) failures.push(`Watch idle/performance: ${JSON.stringify(idle)}`)
      }
      const handoff = page.locator('[data-study-ending] a[href^="/work/"]')
      const href = await handoff.getAttribute('href')
      await handoff.focus()
      const focus = await handoff.evaluate((link) => document.activeElement === link && getComputedStyle(link).outlineStyle !== 'none')
      const passed = count === (slug === 'medrag' ? 6 : 8) && states.every((s, i) => (slug !== 'order-supervisor' || Number(s.active) === i) && s.overflow <= 1 && s.h1 === 1 && s.fonts === 'loaded') && href === `/work/${slug}/` && focus && !errors.length && !requests.length
      if (!passed) failures.push(`${slug}/${width} animated: ${JSON.stringify({ errors, requests, states, href, focus })}`)
      results.push({ slug, width, mode: 'animated', passed, states, errors, requests })
      console.log(`${passed ? 'PASS' : 'FAIL'} ${slug} ${width}: ${count} scenes, focus=${focus}, errors=${errors.length}, external=${requests.length}`)
      await context.close()
      for (const [mode, options] of [['no-js', { javaScriptEnabled: false }], ['reduced', { reducedMotion: 'reduce' }]]) {
        const context = await browser.newContext({ viewport: { width, height }, ...options })
        const page = await context.newPage()
        await page.goto(`${base}/design/directions/${slug}-world.html`)
        await page.evaluate(() => document.fonts.ready)
        const state = await page.evaluate(() => {
          const still = document.querySelector('[data-study-static]'), stage = document.querySelector('[data-study-stage]')
          return { scenes: document.querySelectorAll('[data-study-scene]').length, overflow: document.documentElement.scrollWidth - innerWidth, still: still.getBoundingClientRect().height > 0, position: getComputedStyle(stage).position, text: document.querySelector('[data-study-ending]').textContent.length }
        })
        const passed = state.scenes === count && state.overflow <= 1 && state.still && !['fixed', 'sticky'].includes(state.position) && state.text > 50
        if (!passed) failures.push(`${slug}/${width}/${mode}: ${JSON.stringify(state)}`)
        results.push({ slug, width, mode, state, passed })
        await page.screenshot({ path: path.join(output, `${slug}-${width}-${mode}.png`), fullPage: true })
        console.log(`${passed ? 'PASS' : 'FAIL'} ${slug} ${width} ${mode}: ${JSON.stringify(state)}`)
        await context.close()
      }
    }
  }
} finally {
  await browser?.close()
  await new Promise((resolve) => server.close(resolve))
  await writeFile(path.join(output, `results-${selected ?? 'all'}.json`), JSON.stringify({ results, failures }, null, 2))
}
if (failures.length) throw new Error(failures.join('\n'))
