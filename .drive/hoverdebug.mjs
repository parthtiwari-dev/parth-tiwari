import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
const browser=await chromium.launch(chromiumLaunchOptions({headless:true}))
const ctx=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1})
const p=await ctx.newPage()
await p.goto('http://localhost:4400',{waitUntil:'load'}); await p.waitForTimeout(3500)
await p.mouse.move(20,880); await p.mouse.wheel(0,1600); await p.waitForTimeout(1600)
console.log(JSON.stringify(await p.evaluate(async()=>{
  const frames=(n)=>new Promise(r=>{let i=0;const s=()=>{if(++i>=n)return r();requestAnimationFrame(s)};requestAnimationFrame(s)})
  const items=()=>[...document.querySelectorAll('.node-labels__item')].map(e=>({id:e.dataset.projectId,cls:e.className.replace('node-labels__item','').trim(),box:e.getBoundingClientRect()}))
  const before=items().filter(i=>i.cls.includes('name'))
  if(!before.length) return {err:'no name labels', all:items().map(i=>i.cls)}
  const t=before[0]
  // aim at the far end of the name, well away from the star marker
  const x=Math.round(t.box.right-8), y=Math.round(t.box.top+t.box.height/2)
  const log=[]
  window.dispatchEvent(new PointerEvent('pointermove',{clientX:x,clientY:y,bubbles:true,pointerType:'mouse',pointerId:1,isPrimary:true}))
  for(const n of [2,6,12,30,60]){ await frames(n); const it=items().find(i=>i.id===t.id); log.push({afterFrames:n, cls:it?.cls, w:Math.round(it?.box.width??0)}) }
  return {aimedAt:{id:t.id,x,y,box:{l:Math.round(t.box.left),r:Math.round(t.box.right),t:Math.round(t.box.top),b:Math.round(t.box.bottom)}}, log}
}),null,1))
await browser.close()
