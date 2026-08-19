import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
import { mkdirSync } from 'node:fs'
const OUT='/tmp/claude-0/-home-user-parth-tiwari/eb439659-3fdc-5ea3-aef2-c36947f045f3/scratchpad/drive/plain'
mkdirSync(OUT,{recursive:true})
const browser = await chromium.launch(chromiumLaunchOptions({ headless:true }))

// --- plain mode ---
const c1 = await browser.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true, hasTouch:true })
const p1 = await c1.newPage()
const t0=Date.now()
await p1.goto('https://parth-tiwari-1.vercel.app/?plain=1',{waitUntil:'load'})
console.log('plain load ms:', Date.now()-t0)
await p1.waitForTimeout(1500)
await p1.screenshot({path:`${OUT}/plain-top.png`})
const meta = await p1.evaluate(()=>({
  h:document.documentElement.scrollHeight, words:document.body.innerText.split(/\s+/).length,
  canvas: !!document.querySelector('canvas'),
  h1:[...document.querySelectorAll('h1')].map(e=>e.textContent.trim()).slice(0,3),
  h2:[...document.querySelectorAll('h2')].map(e=>e.textContent.trim()).slice(0,14),
  links:[...document.querySelectorAll('a')].length,
  title:document.title, desc:document.querySelector('meta[name=description]')?.content
}))
console.log(JSON.stringify(meta,null,1))
await c1.close()

// --- mobile overlay: open a project, try to escape one-handed ---
const c2 = await browser.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true, hasTouch:true })
const p2 = await c2.newPage(); const cdp = await c2.newCDPSession(p2)
await p2.goto('https://parth-tiwari-1.vercel.app/?project=medrag',{waitUntil:'load'}); await p2.waitForTimeout(4000)
await p2.screenshot({path:`${OUT}/mobile-overlay.png`})
const ov = await p2.evaluate(()=>{const d=document.querySelector('[role=dialog]'); if(!d) return null
  const r=d.getBoundingClientRect()
  const btns=[...d.querySelectorAll('button,a')].map(b=>{const q=b.getBoundingClientRect();return{l:(b.getAttribute('aria-label')||b.textContent).replace(/\s+/g,' ').trim().slice(0,26),w:Math.round(q.width),h:Math.round(q.height),x:Math.round(q.x+q.width/2),y:Math.round(q.y+q.height/2)}})
  return {box:`${Math.round(r.width)}x${Math.round(r.height)}`, scrollH:d.scrollHeight, clientH:d.clientHeight, btns}})
console.log('\nmobile overlay:', JSON.stringify(ov,null,1))
// scroll inside overlay with real touch
if(ov){
  const before = await p2.evaluate(()=>document.querySelector('[role=dialog]').scrollTop)
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:195,y:640,id:1}]})
  for(let i=1;i<=14;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:195,y:640-i*35,id:1}]});await p2.waitForTimeout(12)}
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})
  await p2.waitForTimeout(800)
  const after = await p2.evaluate(()=>({d:document.querySelector('[role=dialog]')?.scrollTop, page:scrollY}))
  console.log(`  overlay scroll by touch: ${before} → ${after.d}   (page scrollY ${after.page})`)
  await p2.screenshot({path:`${OUT}/mobile-overlay-scrolled.png`})
}
await browser.close()
