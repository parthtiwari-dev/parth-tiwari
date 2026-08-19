import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
const browser=await chromium.launch(chromiumLaunchOptions({headless:true}))
const ctx=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1})
const page=await ctx.newPage()
await page.goto('https://parth-tiwari-1.vercel.app',{waitUntil:'load'}); await page.waitForTimeout(3800)
await page.mouse.move(20,880); await page.mouse.wheel(0,1600); await page.waitForTimeout(1800)
const r = await page.evaluate(async()=>{
  const frames=(n)=>new Promise(res=>{let i=0;const s=()=>{if(++i>=n)return res();requestAnimationFrame(s)};requestAnimationFrame(s)})
  const pos=()=>[...document.querySelectorAll('.node-labels__dot')].map(d=>{const b=d.getBoundingClientRect();return{x:b.x+b.width/2,y:b.y+b.height/2}})
  const a=pos(); const t0=performance.now(); await frames(120); const b=pos(); const dt=(performance.now()-t0)/1000
  const speeds=a.map((p,i)=>b[i]?Math.hypot(b[i].x-p.x,b[i].y-p.y)/dt:null).filter(Boolean)
  // rendered star size on screen: the dot marker is styled, so measure the actual mesh via label item dot box
  const dotBox=[...document.querySelectorAll('.node-labels__dot')].map(d=>{const b=d.getBoundingClientRect();return Math.round(b.width)})
  return {samplesSec:dt.toFixed(2), medianPxPerSec:speeds.sort((x,y)=>x-y)[Math.floor(speeds.length/2)]?.toFixed(1), maxPxPerSec:Math.max(...speeds).toFixed(1), dotWidths:dotBox}
})
console.log(JSON.stringify(r,null,1))
await browser.close()
