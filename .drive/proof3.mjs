import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
import { mkdirSync } from 'node:fs'
const OUT='/tmp/claude-0/-home-user-parth-tiwari/eb439659-3fdc-5ea3-aef2-c36947f045f3/scratchpad/drive/proof'
mkdirSync(OUT,{recursive:true})
const browser=await chromium.launch(chromiumLaunchOptions({headless:true}))
const ctx=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:2})
const p=await ctx.newPage()
await p.goto('http://localhost:4400',{waitUntil:'load'}); await p.waitForTimeout(3500)
await p.mouse.move(20,880); await p.mouse.wheel(0,1600)
await p.waitForTimeout(9000)   // let the camera actually settle

// confirm it is settled
const drift = await p.evaluate(async()=>{
  const frames=(n)=>new Promise(r=>{let i=0;const s=()=>{if(++i>=n)return r();requestAnimationFrame(s)};requestAnimationFrame(s)})
  const pos=()=>[...document.querySelectorAll('.node-labels__item')].map(e=>{const b=e.getBoundingClientRect();return{x:b.x,y:b.y}})
  const a=pos(); const t0=performance.now(); await frames(20); const b=pos()
  const dt=(performance.now()-t0)/1000
  const sp=a.map((q,i)=>b[i]?Math.hypot(b[i].x-q.x,b[i].y-q.y)/dt:0)
  return {sec:dt.toFixed(1), medianPxPerSec:sp.sort((x,y)=>x-y)[Math.floor(sp.length/2)]?.toFixed(1)}
})
console.log('scene settled? label drift =', JSON.stringify(drift))

const t=await p.evaluate(()=>{const n=[...document.querySelectorAll('.node-labels__item')].find(e=>e.className.includes('--name'))
  if(!n) return null; const b=n.getBoundingClientRect(); return {x:Math.round(b.x+b.width*0.7),y:Math.round(b.y+b.height/2),name:n.textContent.replace(/\s+/g,' ').trim()}})
console.log('real mouse → name label:', JSON.stringify(t))
await p.mouse.move(t.x,t.y,{steps:6})
await p.waitForTimeout(1500)
console.log('  card:', await p.evaluate(()=>document.querySelector('.node-labels__card-name')?.textContent.trim()??'NONE'))
await p.waitForTimeout(8000)
console.log('  card 8s later, mouse motionless:', await p.evaluate(()=>document.querySelector('.node-labels__card-name')?.textContent.trim()??'NONE'))
await p.screenshot({path:`${OUT}/hover-name.png`})
await browser.close()
