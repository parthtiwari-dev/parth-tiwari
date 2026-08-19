import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
const browser=await chromium.launch(chromiumLaunchOptions({headless:true}))
const ctx=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1})
const page=await ctx.newPage()
await page.goto('https://parth-tiwari-1.vercel.app',{waitUntil:'load'}); await page.waitForTimeout(3800)
await page.mouse.move(20,880); await page.mouse.wheel(0,1600); await page.waitForTimeout(1800)

const res = await page.evaluate(async () => {
  const cv = document.querySelector('canvas')
  const frames = (n) => new Promise(r=>{let i=0;const s=()=>{if(++i>=n)return r();requestAnimationFrame(s)};requestAnimationFrame(s)})
  const move = async (x,y) => {
    cv.dispatchEvent(new PointerEvent('pointermove',{clientX:x,clientY:y,bubbles:true,pointerType:'mouse',pointerId:1,isPrimary:true}))
    await frames(4)
  }
  const card = () => document.querySelector('.node-labels__card-name')?.textContent.trim() || null
  const dots = [...document.querySelectorAll('.node-labels__dot')].map(d=>{const r=d.getBoundingClientRect();return{x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)}}).filter(p=>p.x>0)
  let hit=null
  for(const d of dots){ for(const [dx,dy] of [[0,0],[0,-8],[0,8],[-8,0],[8,0]]){ await move(d.x+dx,d.y+dy); if(card()){hit={x:d.x+dx,y:d.y+dy,c:card()};break} } if(hit)break }
  if(!hit) return {dots:dots.length, hit:null}
  const alive = async(x,y)=>{await move(x,y);return !!card()}
  let l=0,r=0,t=0,b=0
  for(let i=1;i<60;i++){ if(await alive(hit.x-i,hit.y)) l=i; else break }
  for(let i=1;i<60;i++){ if(await alive(hit.x+i,hit.y)) r=i; else break }
  for(let i=1;i<60;i++){ if(await alive(hit.x,hit.y-i)) t=i; else break }
  for(let i=1;i<60;i++){ if(await alive(hit.x,hit.y+i)) b=i; else break }
  // stability: hold still
  await move(hit.x,hit.y)
  const start=performance.now(); let lost=null
  while(performance.now()-start<6000){ await frames(10); if(!card()){lost=Math.round(performance.now()-start);break} }
  return {dots:dots.length, hit, w:l+r+1, h:t+b+1, lostAfterMs:lost}
})
console.log(JSON.stringify(res,null,1))
await browser.close()
