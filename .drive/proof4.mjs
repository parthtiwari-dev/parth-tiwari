import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
import { mkdirSync } from 'node:fs'
const OUT='/tmp/claude-0/-home-user-parth-tiwari/eb439659-3fdc-5ea3-aef2-c36947f045f3/scratchpad/drive/proof'
mkdirSync(OUT,{recursive:true})
const browser=await chromium.launch(chromiumLaunchOptions({headless:true}))
const ctx=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:2})
const p=await ctx.newPage()
await p.goto('http://localhost:4400',{waitUntil:'load'}); await p.waitForTimeout(3500)
await p.mouse.move(20,880); await p.mouse.wheel(0,1600); await p.waitForTimeout(6000)
const card=()=>p.evaluate(()=>document.querySelector('.node-labels__card-name')?.textContent.trim()??null)
const aim=(id)=>p.evaluate((id)=>{
  const list=[...document.querySelectorAll('.node-labels__item')]
  const n = id ? list.find(e=>e.dataset.projectId===id) : list.find(e=>e.className.includes('--name'))
  if(!n) return null; const b=n.getBoundingClientRect()
  return {id:n.dataset.projectId, x:Math.round(b.x+b.width/2), y:Math.round(b.y+b.height/2)}
}, id)
let t=await aim(null); const target=t.id
console.log('following label:', target)
for(let i=0;i<8 && !(await card()); i++){
  const a=await aim(target); if(!a) break
  await p.mouse.move(a.x,a.y)
  console.log(`  correction ${i+1} → (${a.x},${a.y})  card=${await card() ?? 'none'}`)
}
console.log('\nlatched card:', await card())
await p.waitForTimeout(9000)
console.log('9s later, mouse motionless:', await card())
await p.screenshot({path:`${OUT}/hover-name.png`})
await browser.close()
