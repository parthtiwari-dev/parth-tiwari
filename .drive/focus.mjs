import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
const browser = await chromium.launch(chromiumLaunchOptions({ headless:true }))
const ctx = await browser.newContext({ viewport:{width:1440,height:900} })
const page = await ctx.newPage()
await page.goto('https://parth-tiwari-1.vercel.app',{waitUntil:'load'}); await page.waitForTimeout(3500)
console.log(JSON.stringify(await page.evaluate(()=>{
  const all=[...document.querySelectorAll('a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex="-1"])')]
  const b=document.querySelector('[aria-label*="Open project index" i]')
  b.focus()
  const focused = document.activeElement===b
  // DOM order position
  const idx = all.indexOf(b)
  return {
    totalFocusableInDom: all.length,
    indexOfToggle: idx,
    focusSucceeded: focused,
    activeAfterFocus: document.activeElement.tagName+' '+(document.activeElement.getAttribute('aria-label')||'').slice(0,40),
    order: all.map(e=>({t:e.tagName.toLowerCase(), l:(e.getAttribute('aria-label')||e.textContent||'').replace(/\s+/g,' ').trim().slice(0,40)}))
  }
},null),null,1))
// Now Tab from there
await page.evaluate(()=>document.querySelector('[aria-label*="Open project index" i]').focus())
for(let i=0;i<3;i++){ await page.keyboard.press('Tab'); await page.waitForTimeout(150)
  console.log('  after Tab →', await page.evaluate(()=>document.activeElement.tagName+' "'+(document.activeElement.getAttribute('aria-label')||document.activeElement.textContent||'').replace(/\s+/g,' ').trim().slice(0,45)+'"')) }
await browser.close()
