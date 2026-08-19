import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
import { mkdirSync } from 'node:fs'
const OUT='/tmp/claude-0/-home-user-parth-tiwari/eb439659-3fdc-5ea3-aef2-c36947f045f3/scratchpad/drive/proof'
mkdirSync(OUT,{recursive:true})
const browser=await chromium.launch(chromiumLaunchOptions({headless:true}))
const ctx=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:2})
const p=await ctx.newPage()
await p.goto('http://localhost:4400',{waitUntil:'load'}); await p.waitForTimeout(3500)
await p.mouse.move(20,880); await p.mouse.wheel(0,1600); await p.waitForTimeout(1800)

const aim=async()=>p.evaluate(()=>{const n=[...document.querySelectorAll('.node-labels__item')].find(e=>e.className.includes('--name'))
  if(!n) return null; const b=n.getBoundingClientRect(); return {x:Math.round(b.x+b.width*0.75),y:Math.round(b.y+b.height/2),name:n.textContent.replace(/\s+/g,' ').trim()}})
let t=await aim()
console.log('aim 1:', JSON.stringify(t))
await p.mouse.move(t.x,t.y)          // no steps, no wait: minimise drift
console.log('  immediately after:', await p.evaluate(()=>document.querySelector('.node-labels__card-name')?.textContent.trim()??'NONE'))
// correct once for drift, then hold
t=await aim()
if(t){ await p.mouse.move(t.x,t.y); }
await p.waitForTimeout(400)
console.log('  after one correction:', await p.evaluate(()=>document.querySelector('.node-labels__card-name')?.textContent.trim()??'NONE'))
await p.waitForTimeout(6000)
console.log('  still there 6s later, mouse motionless:', await p.evaluate(()=>document.querySelector('.node-labels__card-name')?.textContent.trim()??'NONE'))
await p.screenshot({path:`${OUT}/hover-name.png`})
await browser.close()
