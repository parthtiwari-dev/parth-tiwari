import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
const browser=await chromium.launch(chromiumLaunchOptions({headless:true}))
const ctx=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1})
const p=await ctx.newPage()
await p.goto('http://localhost:4400',{waitUntil:'load'}); await p.waitForTimeout(3500)
await p.mouse.move(20,880); await p.mouse.wheel(0,1600); await p.waitForTimeout(9000)
const t=await p.evaluate(()=>{const n=[...document.querySelectorAll('.node-labels__item')].find(e=>e.className.includes('--name'))
  const b=n.getBoundingClientRect(); return {x:Math.round(b.x+b.width*0.7),y:Math.round(b.y+b.height/2),id:n.dataset.projectId,box:[b.left,b.top,b.right,b.bottom].map(Math.round)}})
console.log('aim', JSON.stringify(t))
await p.mouse.move(t.x,t.y,{steps:3})
console.log(JSON.stringify(await p.evaluate(async(t)=>{
  const frames=(n)=>new Promise(r=>{let i=0;const s=()=>{if(++i>=n)return r();requestAnimationFrame(s)};requestAnimationFrame(s)})
  const out=[]
  for(let k=0;k<6;k++){
    const el=[...document.querySelectorAll('.node-labels__item')].find(e=>e.dataset.projectId===t.id)
    const b=el?.getBoundingClientRect()
    out.push({k, cls:el?.className.replace('node-labels__item','').trim(),
      box:b?[b.left,b.top,b.right,b.bottom].map(Math.round):null,
      pointerInside: b? (t.x>=b.left&&t.x<=b.right&&t.y>=b.top&&t.y<=b.bottom) : null,
      anyCard: document.querySelector('.node-labels__card-name')?.textContent.trim()??null})
    await frames(2)
  }
  return out
}, t),null,1))
await browser.close()
