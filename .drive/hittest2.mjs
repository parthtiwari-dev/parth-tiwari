import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
const browser=await chromium.launch(chromiumLaunchOptions({headless:true}))
const ctx=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1})
const page=await ctx.newPage()
await page.goto('https://parth-tiwari-1.vercel.app',{waitUntil:'load'}); await page.waitForTimeout(3800)
await page.mouse.move(20,880); await page.mouse.wheel(0,1600); await page.waitForTimeout(1800)
const card=()=>page.evaluate(()=>document.querySelector('.node-labels__card-name')?.textContent.trim()||null)
// star screen positions = the dot marker inside each label item
const dots=await page.evaluate(()=>[...document.querySelectorAll('.node-labels__dot')].map(d=>{const r=d.getBoundingClientRect();return{x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)}}).filter(p=>p.x>0))
console.log('dot markers:', JSON.stringify(dots.slice(0,10)))
let hit=null
for(const d of dots){
  for(const [dx,dy] of [[0,0],[0,-6],[0,6],[-6,0],[6,0],[0,-12],[0,12]]){
    await page.mouse.move(d.x+dx,d.y+dy); await page.waitForTimeout(90)
    const c=await card(); if(c){hit={x:d.x+dx,y:d.y+dy,c};break}
  }
  if(hit) break
}
if(!hit){console.log('NO hover card produced at any of the 12 star markers (±12px) — hover target is not where the label dot is'); await browser.close(); process.exit(0)}
console.log('card appears for', hit.c, 'at', hit.x, hit.y)
const alive=async(x,y)=>{await page.mouse.move(x,y);await page.waitForTimeout(80);return !!(await card())}
let l=0,r=0,t=0,b=0
for(let i=1;i<60;i++){ if(await alive(hit.x-i,hit.y)) l=i; else break }
for(let i=1;i<60;i++){ if(await alive(hit.x+i,hit.y)) r=i; else break }
for(let i=1;i<60;i++){ if(await alive(hit.x,hit.y-i)) t=i; else break }
for(let i=1;i<60;i++){ if(await alive(hit.x,hit.y+i)) b=i; else break }
console.log(`hover hit target ≈ ${l+r+1} x ${t+b+1} px   (WCAG 2.2 target minimum = 24x24)`)
await page.mouse.move(hit.x,hit.y); await page.waitForTimeout(400)
let lostAt=null
for(let ms=300; ms<=5000; ms+=300){ await page.waitForTimeout(300); if(!(await card())){lostAt=ms;break} }
console.log(`pointer held still: card survived ${lostAt? lostAt+'ms — the star orbits out from under a motionless cursor':'>5s'}`)
await browser.close()
