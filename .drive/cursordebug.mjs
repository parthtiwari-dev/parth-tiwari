import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
const browser=await chromium.launch(chromiumLaunchOptions({headless:true}))
const ctx=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1})
const p=await ctx.newPage()
await p.goto('http://localhost:4400',{waitUntil:'load'}); await p.waitForTimeout(3500)
await p.click('[aria-label*="Open project index" i]'); await p.waitForTimeout(700)
await p.click('button[aria-label^="MedRAG"]'); await p.waitForTimeout(1600)
const closeBox = await p.evaluate(()=>{const b=document.querySelector('[aria-label*="Close overlay" i]');const r=b.getBoundingClientRect();return{x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)}})
console.log('close button at', JSON.stringify(closeBox))
await p.click('[aria-label*="Close overlay" i]'); await p.waitForTimeout(2200)
console.log(JSON.stringify(await p.evaluate((pt)=>{
  const el=document.elementFromPoint(pt.x,pt.y)
  const cursor=document.querySelector('#custom-cursor')
  return {
    underPointer: el ? el.tagName+'.'+String(el.className).slice(0,50) : null,
    closestInteractive: el?.closest('.cursor-enter, a[href], button:not(:disabled), [role="button"], input:not(:disabled), textarea:not(:disabled), select:not(:disabled)')?.outerHTML.slice(0,120) ?? null,
    cursorClass: cursor?.className,
    cursorLabel: document.querySelector('.custom-cursor__label')?.textContent ?? null,
  }
}, closeBox),null,1))
await browser.close()
