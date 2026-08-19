import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
import { mkdirSync } from 'node:fs'
const OUT='/tmp/claude-0/-home-user-parth-tiwari/eb439659-3fdc-5ea3-aef2-c36947f045f3/scratchpad/drive/proof'
mkdirSync(OUT,{recursive:true})
const browser=await chromium.launch(chromiumLaunchOptions({headless:true}))

// hover a NAME label with a real mouse
{
  const ctx=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:2})
  const p=await ctx.newPage()
  await p.goto('http://localhost:4400',{waitUntil:'load'}); await p.waitForTimeout(3500)
  await p.mouse.move(20,880); await p.mouse.wheel(0,1600); await p.waitForTimeout(1800)
  const t=await p.evaluate(()=>{const n=[...document.querySelectorAll('.node-labels__item')].find(e=>e.className.includes('--name'));
    if(!n) return null; const b=n.getBoundingClientRect(); return {x:Math.round(b.right-10),y:Math.round(b.y+b.height/2),name:n.textContent.replace(/\s+/g,' ').trim()}})
  console.log('aiming real mouse at the name:', JSON.stringify(t))
  await p.mouse.move(t.x,t.y,{steps:6}); await p.waitForTimeout(2500)
  console.log('  card on screen:', await p.evaluate(()=>document.querySelector('.node-labels__card-name')?.textContent.trim()??'NONE'))
  await p.screenshot({path:`${OUT}/hover-name.png`})
  await ctx.close()
}
// mobile: what is at the old blank-screen scroll position now
{
  const ctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true})
  const p=await ctx.newPage(); const cdp=await ctx.newCDPSession(p)
  await p.goto('http://localhost:4400',{waitUntil:'load'}); await p.waitForTimeout(3500)
  const swipe=async()=>{await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:195,y:700,id:1}]})
    for(let i=1;i<=14;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:195,y:700-i*38,id:1}]});await p.waitForTimeout(10)}
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForTimeout(700)}
  let n=0
  while(await p.evaluate(()=>scrollY)<5600 && n<20){ await swipe(); n++ }
  const y=await p.evaluate(()=>Math.round(scrollY))
  console.log('phone scrolled by touch to y=',y,'(the old blank screen was 5439)')
  await p.screenshot({path:`${OUT}/mobile-was-blank.png`})
  await ctx.close()
}
await browser.close()
