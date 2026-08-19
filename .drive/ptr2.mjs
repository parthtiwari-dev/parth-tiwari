import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
const browser=await chromium.launch(chromiumLaunchOptions({headless:true}))
const ctx=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1})
const p=await ctx.newPage()
await p.goto('http://localhost:4400',{waitUntil:'load'}); await p.waitForTimeout(3500)
await p.mouse.move(20,880); await p.mouse.wheel(0,1600); await p.waitForTimeout(9000)
await p.evaluate(()=>{
  window.__c={cap:0,bub:0,capLast:null,bubLast:null}
  window.addEventListener('pointermove',(e)=>{window.__c.cap++;window.__c.capLast=[e.clientX,e.clientY]},true)
  window.addEventListener('pointermove',(e)=>{window.__c.bub++;window.__c.bubLast=[e.clientX,e.clientY]},{passive:true})
})
await p.mouse.move(700,300,{steps:5})
await p.waitForTimeout(1500)
console.log('real mouse:', JSON.stringify(await p.evaluate(()=>window.__c)))
await p.evaluate(()=>{window.dispatchEvent(new PointerEvent('pointermove',{clientX:111,clientY:222,pointerType:'mouse',bubbles:true}))})
await p.waitForTimeout(300)
console.log('after synthetic:', JSON.stringify(await p.evaluate(()=>window.__c)))
await browser.close()
