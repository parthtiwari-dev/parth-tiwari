import { chromium } from 'playwright'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
p.on('pageerror', e => console.log('PAGEERROR', e.message))
p.on('console', m => { if (m.type()==='error') console.log('CONSOLE', m.text()) })
await p.goto('http://localhost:4400/', { waitUntil: 'load' })
await p.waitForTimeout(9000)
await p.screenshot({ path: '.shots/motion-t0.png' })
await p.waitForTimeout(20000)   // ~20s of orbit
await p.screenshot({ path: '.shots/motion-t20.png' })
console.log('captured t0 and t20')
await b.close()
