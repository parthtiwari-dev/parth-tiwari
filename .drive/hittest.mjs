import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
const browser=await chromium.launch(chromiumLaunchOptions({headless:true}))
const ctx=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1})
const page=await ctx.newPage()
await page.goto('https://parth-tiwari-1.vercel.app',{waitUntil:'load'}); await page.waitForTimeout(3800)
await page.mouse.move(20,880); await page.mouse.wheel(0,1600); await page.waitForTimeout(1800)

const card=()=>page.evaluate(()=>document.querySelector('.node-labels__card-name')?.textContent.trim()||null)
// find a star: sweep a coarse grid
let hit=null
outer: for(let y=200;y<760;y+=14){ for(let x=380;x<1100;x+=14){
  await page.mouse.move(x,y); await page.waitForTimeout(45)
  const c=await card(); if(c){hit={x,y,c}; break outer}
}}
if(!hit){console.log('no hover card found anywhere on a 14px grid sweep'); await browser.close(); process.exit(0)}
console.log('found card for', hit.c, 'at', hit.x, hit.y)

// measure the hit target: expand outward until card disappears
const alive=async(x,y)=>{await page.mouse.move(x,y);await page.waitForTimeout(70);return !!(await card())}
let l=hit.x,r=hit.x,t=hit.y,b=hit.y
for(let i=1;i<70;i++){ if(await alive(hit.x-i,hit.y)) l=hit.x-i; else break }
for(let i=1;i<70;i++){ if(await alive(hit.x+i,hit.y)) r=hit.x+i; else break }
for(let i=1;i<70;i++){ if(await alive(hit.x,hit.y-i)) t=hit.y-i; else break }
for(let i=1;i<70;i++){ if(await alive(hit.x,hit.y+i)) b=hit.y+i; else break }
console.log(`hover hit target ≈ ${r-l+1} x ${b-t+1} px  (WCAG minimum for a pointer target is 24x24; touch guidance 44x44)`)

// how fast does the star move under a still pointer?
await page.mouse.move(hit.x,hit.y); await page.waitForTimeout(400)
const t0=await card()
let lostAt=null
for(let ms=250; ms<=6000; ms+=250){ await page.waitForTimeout(250); const c=await card(); if(!c){lostAt=ms;break} }
console.log(`pointer held perfectly still on "${t0}": card survived ${lostAt? lostAt+'ms before the star orbited away' : '>6000ms'}`)
await browser.close()
