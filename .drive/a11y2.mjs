import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
const browser = await chromium.launch(chromiumLaunchOptions({ headless:true }))
const ctx = await browser.newContext({ viewport:{width:1440,height:900} })
const page = await ctx.newPage()
await page.goto('https://parth-tiwari-1.vercel.app',{waitUntil:'load'}); await page.waitForTimeout(3500)

console.log('--- project index toggle focusability ---')
console.log(JSON.stringify(await page.evaluate(()=>{
  const b=document.querySelector('[aria-label*="Open project index" i]')
  if(!b) return 'not found'
  const cs=getComputedStyle(b)
  return {tag:b.tagName, tabindex:b.getAttribute('tabindex'), disabled:b.disabled, ariaHidden:b.getAttribute('aria-hidden'),
    inertAncestor: !!b.closest('[inert]'), hiddenAncestor: !!b.closest('[aria-hidden="true"]'),
    display:cs.display, visibility:cs.visibility, pointerEvents:cs.pointerEvents, offsetParent:!!b.offsetParent}
}),null,1))

console.log('\n--- are stars keyboard reachable? ---')
console.log(JSON.stringify(await page.evaluate(()=>{
  const c=document.querySelector('canvas')
  return {canvasTabindex:c?.getAttribute('tabindex'), canvasRole:c?.getAttribute('role'), canvasLabel:c?.getAttribute('aria-label'),
    focusableCount: document.querySelectorAll('a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex="-1"])').length}
})))

console.log('\n--- accessible names of the two form fields ---')
for(const sel of ['input','textarea']){
  const r = await page.evaluate((s)=>{
    const el=document.querySelector(s); if(!el) return null
    const lbl = el.labels?.length? [...el.labels].map(l=>l.textContent.trim()).join('|') : null
    return {name:el.name, id:el.id, placeholder:el.placeholder, ariaLabel:el.getAttribute('aria-label'), ariaLabelledby:el.getAttribute('aria-labelledby'), labels:lbl, required:el.required}
  }, sel)
  console.log(' ', sel, JSON.stringify(r))
}
const snap = await page.accessibility.snapshot()
const walk=(n,d=0)=>{ if(!n) return; if(['textbox','button','link'].includes(n.role)&&d<30) console.log(`   ${n.role}: "${n.name}"`); (n.children||[]).forEach(c=>walk(c,d+1)) }
console.log('\n--- AX tree (interactive) ---'); walk(snap)
await browser.close()
