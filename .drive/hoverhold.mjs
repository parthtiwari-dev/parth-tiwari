import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
const browser=await chromium.launch(chromiumLaunchOptions({headless:true}))
const ctx=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1})
const p=await ctx.newPage()
await p.goto('http://localhost:4400',{waitUntil:'load'}); await p.waitForTimeout(3500)
await p.mouse.move(20,880); await p.mouse.wheel(0,1600); await p.waitForTimeout(1600)
for(const where of ['centre','right-edge']){
  const r = await p.evaluate(async(where)=>{
    const frames=(n)=>new Promise(r=>{let i=0;const s=()=>{if(++i>=n)return r();requestAnimationFrame(s)};requestAnimationFrame(s)})
    const items=()=>[...document.querySelectorAll('.node-labels__item')]
    const name=items().find(e=>e.className.includes('--name'))
    if(!name) return {where, err:'no name label'}
    const b=name.getBoundingClientRect()
    const id=name.dataset.projectId
    const x = where==='centre' ? Math.round(b.x+b.width/2) : Math.round(b.right-8)
    const y = Math.round(b.y+b.height/2)
    window.dispatchEvent(new PointerEvent('pointermove',{clientX:x,clientY:y,bubbles:true,pointerType:'mouse',pointerId:1,isPrimary:true}))
    const t0=performance.now(); let flips=0, last=null, cardMs=0, lastT=t0
    while(performance.now()-t0<10000){
      await frames(3)
      const el=items().find(e=>e.dataset.projectId===id)
      const isCard = !!el?.className.includes('--card')
      const now=performance.now()
      if(isCard) cardMs += now-lastT
      lastT=now
      if(last!==null && isCard!==last) flips++
      last=isCard
    }
    return {where, id, aimed:{x,y}, elapsedMs:Math.round(performance.now()-t0), cardVisibleMs:Math.round(cardMs), flips}
  }, where)
  console.log(JSON.stringify(r))
}
await browser.close()
