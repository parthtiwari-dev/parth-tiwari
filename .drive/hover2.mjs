import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
import { mkdirSync } from 'node:fs'
const OUT='/tmp/claude-0/-home-user-parth-tiwari/eb439659-3fdc-5ea3-aef2-c36947f045f3/scratchpad/drive/hover'
mkdirSync(OUT,{recursive:true})
const browser=await chromium.launch(chromiumLaunchOptions({headless:true}))
const ctx=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:2})
const page=await ctx.newPage()
await page.goto('https://parth-tiwari-1.vercel.app',{waitUntil:'load'}); await page.waitForTimeout(3800)
await page.mouse.move(20,860); await page.mouse.wheel(0,1600); await page.waitForTimeout(1600)

const snap=()=>page.evaluate(()=>{
  const items=[...document.querySelectorAll('.node-labels__item')]
  const cards=items.filter(i=>i.querySelector('.node-labels__card'))
    .map(i=>{const r=i.getBoundingClientRect();return{n:i.querySelector('.node-labels__card-name')?.textContent.trim(),x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)}})
  const names=items.filter(i=>i.querySelector('.node-labels__name')).map(i=>i.textContent.replace(/\s+/g,' ').trim().slice(0,18))
  const dots=items.filter(i=>i.querySelector('.node-labels__dot:not(.node-labels__dot--inline)')&&!i.querySelector('.node-labels__name')&&!i.querySelector('.node-labels__card')).length
  return {items:items.length, cards, names, dots}
})
const dotPos=()=>page.evaluate(()=>[...document.querySelectorAll('.node-labels__item')]
  .map(i=>{const r=i.getBoundingClientRect();return{t:(i.querySelector('.node-labels__card-name')||i.querySelector('.node-labels__name'))?.textContent.trim().slice(0,18)||'·',x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)}}))

console.log('0. baseline (mouse in corner):', JSON.stringify(await snap()))
const pos=await dotPos(); const named=pos.filter(p=>p.t!=='·')
console.log('   positions:', JSON.stringify(named.slice(0,6)))
if(named.length<2){await browser.close();process.exit(0)}

await page.mouse.move(named[0].x,named[0].y,{steps:10}); await page.waitForTimeout(800)
console.log(`1. hover "${named[0].t}" →`, JSON.stringify((await snap()).cards))
await page.screenshot({path:`${OUT}/A-hover.png`})

await page.mouse.move(40,120,{steps:15}); await page.waitForTimeout(1500)
console.log('2. pointer to empty corner →', JSON.stringify((await snap()).cards), ' <-- should be []')
await page.screenshot({path:`${OUT}/B-away.png`})

await page.mouse.move(named[0].x,named[0].y,{steps:10}); await page.waitForTimeout(600)
const before=(await snap()).cards
await page.mouse.move(named[1].x,named[1].y,{steps:10}); await page.waitForTimeout(900)
console.log(`3. A "${named[0].t}" → B "${named[1].t}":`, JSON.stringify(before),'→',JSON.stringify((await snap()).cards))
await page.screenshot({path:`${OUT}/C-swap.png`})

// hold still on a card: does it drift?
await page.mouse.move(named[1].x,named[1].y,{steps:5}); await page.waitForTimeout(600)
const p1=(await snap()).cards[0]; await page.waitForTimeout(2500); const p2=(await snap()).cards[0]
console.log('4. card drift while pointer still:', JSON.stringify(p1),'→',JSON.stringify(p2))

// open + close, then check stuck card
await page.mouse.move(named[1].x,named[1].y); await page.mouse.down(); await page.mouse.up(); await page.waitForTimeout(2000)
const opened=await page.evaluate(()=>!!document.querySelector('[role=dialog]'))
console.log('5. clicked card → dialog open?', opened)
if(opened){ await page.click('[aria-label*="Close overlay" i]').catch(()=>page.keyboard.press('Escape')); await page.waitForTimeout(2500)
  console.log('6. after close → cards still on screen:', JSON.stringify((await snap()).cards), ' <-- pointer never moved')
  await page.screenshot({path:`${OUT}/D-after-close.png`}) }
await browser.close()
