/**
 * The client: non-technical founder, Android phone, mobile data, 20s of patience.
 * Real touch input only. No window.scrollTo.
 */
import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
import { mkdirSync, writeFileSync } from 'node:fs'

const SITE = 'https://parth-tiwari-1.vercel.app'
const OUT = '/tmp/claude-0/-home-user-parth-tiwari/eb439659-3fdc-5ea3-aef2-c36947f045f3/scratchpad/drive/client'
mkdirSync(OUT, { recursive: true })

const THROTTLE = process.argv.includes('--throttle')

const browser = await chromium.launch(chromiumLaunchOptions({ headless: true }))
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
})
const page = await context.newPage()
const cdp = await context.newCDPSession(page)

const errors = []
page.on('pageerror', (e) => errors.push(String(e).slice(0, 300)))
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 200)) })

const bytes = { total: 0, js: 0, byUrl: [] }
page.on('response', async (r) => {
  try {
    const h = r.headers()
    const len = Number(h['content-length'] || 0)
    const url = r.url()
    if (len) {
      bytes.total += len
      if (/\.js(\?|$)/.test(url)) bytes.js += len
      bytes.byUrl.push([url.replace(SITE, ''), len])
    }
  } catch {}
})

if (THROTTLE) {
  await cdp.send('Network.enable')
  // Slow-ish 4G / congested mobile data, India between meetings
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false, latency: 300, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8,
  })
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
}

const t0 = Date.now()
const stamps = []
const shoot = async (label) => {
  const t = Date.now() - t0
  await page.screenshot({ path: `${OUT}/${String(t).padStart(6, '0')}ms-${label}.png` })
  const visible = await page.evaluate(() => {
    const seen = []
    document.querySelectorAll('body *').forEach((el) => {
      const txt = (el.childNodes.length && [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ')) || ''
      if (!txt) return
      const r = el.getBoundingClientRect()
      if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) return
      const cs = getComputedStyle(el)
      if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) < 0.05) return
      seen.push(txt.replace(/\s+/g, ' ').slice(0, 70))
    })
    return [...new Set(seen)]
  }).catch(() => [])
  stamps.push({ t, label, visibleText: visible })
  console.log(`\n=== ${t}ms — ${label} ===`)
  console.log(visible.length ? visible.map(s => '  · ' + s).join('\n') : '  (nothing legible)')
}

await page.goto(SITE, { waitUntil: 'commit' })
for (const ms of [500, 1000, 2000, 3000, 5000, 8000, 12000, 20000]) {
  await page.waitForTimeout(ms - (Date.now() - t0) > 0 ? ms - (Date.now() - t0) : 0)
  await shoot(`t${ms}`)
}

console.log('\n=== BYTES ===')
console.log('total(content-length seen):', (bytes.total / 1024).toFixed(0) + 'kB', ' js:', (bytes.js / 1024).toFixed(0) + 'kB')
console.log(bytes.byUrl.sort((a, b) => b[1] - a[1]).slice(0, 12).map(([u, l]) => `  ${(l/1024).toFixed(0).padStart(5)}kB  ${u}`).join('\n'))
console.log('\n=== ERRORS ===')
console.log(errors.length ? errors.join('\n') : '(none)')

writeFileSync(`${OUT}/timeline.json`, JSON.stringify({ stamps, bytes: { total: bytes.total, js: bytes.js }, errors }, null, 2))
await browser.close()
