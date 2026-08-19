import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
import { mkdirSync } from 'node:fs'
const OUT='/tmp/claude-0/-home-user-parth-tiwari/eb439659-3fdc-5ea3-aef2-c36947f045f3/scratchpad/drive/hover'
mkdirSync(OUT,{recursive:true})
const browser=await chromium.launch(chromiumLaunchOptions({headless:true}))
const ctx=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:2})
const page=await ctx.newPage()
await page.goto('https://parth-tiwari-1.vercel.app',{waitUntil:'load'}); await page.waitForTimeout(3800)
await page.mouse.move(720,450); await page.mouse.wheel(0,1600); await page.waitForTimeout(1500)

const cards=()=>page.evaluate(()=>[...document.querySelectorAll('[class*=node-label]')]
  .filter(e=>/CLICK/.test(e.textContent))
  .map(e=>{const r=e.getBoundingClientRect();return{name:e.textContent.replace(/\s+/g,' ').trim().slice(0,22),x:Math.round(r.x),y:Math.round(r.y)}}))
const stars=()=>page.evaluate(()=>[...document.querySelectorAll('[class*=node-label]')]
  .map(e=>{const r=e.getBoundingClientRect();return{t:e.textContent.replace(/\s+/g,' ').trim().slice(0,20),x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2),w:Math.round(r.width)}})
  .filter(o=>o.w>10&&o.w<260&&o.t&&!/CLICK/.test(o.t)))

const list=await stars(); console.log('labels on screen:', JSON.stringify(list.slice(0,8)))
if(list.length<2){console.log('not enough labels'); await browser.close(); process.exit(0)}

// 1. hover a node
await page.mouse.move(list[0].x,list[0].y); await page.waitForTimeout(700)
console.log('\n1. hovering', list[0].t, '→ cards:', JSON.stringify(await cards()))
await page.screenshot({path:`${OUT}/1-hover.png`})

// 2. move far away into empty space
await page.mouse.move(120,180,{steps:12}); await page.waitForTimeout(1200)
console.log('2. moved to empty space → cards:', JSON.stringify(await cards()))
await page.screenshot({path:`${OUT}/2-away.png`})

// 3. hover node A then node B quickly
await page.mouse.move(list[0].x,list[0].y,{steps:8}); await page.waitForTimeout(500)
await page.mouse.move(list[1].x,list[1].y,{steps:8}); await page.waitForTimeout(900)
console.log('3. hovered A then B → cards:', JSON.stringify(await cards()))
await page.screenshot({path:`${OUT}/3-swap.png`})

// 4. hover then scroll without moving mouse (stars orbit away under cursor)
await page.mouse.wheel(0,500); await page.waitForTimeout(1600)
console.log('4. scrolled, mouse still → cards:', JSON.stringify(await cards()))
await page.screenshot({path:`${OUT}/4-after-scroll.png`})

// 5. wait, stars orbit — does card follow or detach?
const a=await cards(); await page.waitForTimeout(2500); const b=await cards()
console.log('5. after 2.5s idle  → before:',JSON.stringify(a),' after:',JSON.stringify(b))
await page.screenshot({path:`${OUT}/5-idle.png`})
await browser.close()
