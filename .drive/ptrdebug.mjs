import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
const browser=await chromium.launch(chromiumLaunchOptions({headless:true}))
const ctx=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1})
const p=await ctx.newPage()
await p.goto('http://localhost:4400',{waitUntil:'load'}); await p.waitForTimeout(3500)
await p.mouse.move(20,880); await p.mouse.wheel(0,1600); await p.waitForTimeout(1800)
await p.evaluate(()=>{
  window.__log={moves:0,leaves:0,types:new Set(),last:null}
  window.addEventListener('pointermove',(e)=>{window.__log.moves++;window.__log.types.add(e.pointerType);window.__log.last={x:e.clientX,y:e.clientY}},true)
  window.addEventListener('pointerleave',()=>{window.__log.leaves++},true)
})
const t=await p.evaluate(()=>{const n=[...document.querySelectorAll('.node-labels__item')].find(e=>e.className.includes('--name'))
  const b=n.getBoundingClientRect(); return {x:Math.round(b.x+b.width*0.7),y:Math.round(b.y+b.height/2)}})
await p.mouse.move(t.x,t.y,{steps:4})
await p.waitForTimeout(1200)
console.log('aimed at', JSON.stringify(t))
console.log(JSON.stringify(await p.evaluate(()=>({...window.__log, types:[...window.__log.types]})),null,1))
// where are the label boxes NOW, and is the pointer inside one?
console.log(JSON.stringify(await p.evaluate(()=>{
  const l=window.__log.last
  return [...document.querySelectorAll('.node-labels__item')].map(e=>{const b=e.getBoundingClientRect()
    return {id:e.dataset.projectId,cls:e.className.replace('node-labels__item','').trim(),
      inside: !!(l&&l.x>=b.left&&l.x<=b.right&&l.y>=b.top&&l.y<=b.bottom),
      box:[Math.round(b.left),Math.round(b.top),Math.round(b.right),Math.round(b.bottom)]}}).filter(o=>o.cls.includes('name')||o.inside)
}),null,1))
await browser.close()
