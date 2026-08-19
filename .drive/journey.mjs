import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
import { mkdirSync } from 'node:fs'
const SITE = 'https://parth-tiwari-1.vercel.app'
const OUT = '/tmp/claude-0/-home-user-parth-tiwari/eb439659-3fdc-5ea3-aef2-c36947f045f3/scratchpad/drive/journey'
mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch(chromiumLaunchOptions({ headless: true }))
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
const page = await context.newPage()
const cdp = await context.newCDPSession(page)
async function swipe(x1,y1,x2,y2,steps=14){
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x1,y:y1,id:1}]})
  for(let i=1;i<=steps;i++){const t=i/steps
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x1+(x2-x1)*t,y:y1+(y2-y1)*t,id:1}]})
    await page.waitForTimeout(10)}
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})
}
await page.goto(SITE,{waitUntil:'load'}); await page.waitForTimeout(3500)
const doc = await page.evaluate(()=>({h:document.documentElement.scrollHeight, vh:innerHeight}))
console.log('document height', doc.h, 'screens:', (doc.h/doc.vh).toFixed(1))
let n=0, last=-1, stall=0
while(n<40){
  const y = await page.evaluate(()=>Math.round(window.scrollY))
  const words = await page.evaluate(()=>{
    const out=[];document.querySelectorAll('h1,h2,h3,h4,p,li,a,button,span').forEach(el=>{
      const r=el.getBoundingClientRect(); if(r.top>innerHeight||r.bottom<0||r.width<2) return
      const cs=getComputedStyle(el); if(cs.visibility==='hidden'||Number(cs.opacity)<0.1) return
      const t=el.textContent.replace(/\s+/g,' ').trim(); if(t&&t.length<120) out.push(t)})
    return [...new Set(out)]
  })
  await page.screenshot({path:`${OUT}/${String(n).padStart(2,'0')}-y${y}.png`})
  console.log(`\n[${n}] y=${y}  ${words.length} text nodes`)
  console.log(words.slice(0,14).map(w=>'   · '+w).join('\n'))
  if(y===last){stall++; if(stall>2){console.log('--- bottom reached ---');break}} else stall=0
  last=y; n++
  await swipe(195,700,195,140,16); await page.waitForTimeout(800)
}
await browser.close()
