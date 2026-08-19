import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
import { mkdirSync } from 'node:fs'
const OUT='/tmp/claude-0/-home-user-parth-tiwari/eb439659-3fdc-5ea3-aef2-c36947f045f3/scratchpad/drive/verify4'
mkdirSync(OUT,{recursive:true})
const B='http://localhost:4400'
const browser=await chromium.launch(chromiumLaunchOptions({headless:true}))

// ---- 3. blank screen on phone ----
{
  const ctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true})
  const p=await ctx.newPage()
  await p.goto(B,{waitUntil:'load'}); await p.waitForTimeout(3500)
  const r=await p.evaluate(()=>{
    const s=document.querySelector('.mobile-systems-index')
    const intro=s.querySelector('.mobile-systems-index__intro')
    return {docH:document.documentElement.scrollHeight, secTop:Math.round(s.getBoundingClientRect().top+scrollY),
      introTop:Math.round(intro.getBoundingClientRect().top+scrollY), padTop:getComputedStyle(s).paddingTop}
  })
  console.log('3. blank screen:', JSON.stringify(r), '\n   gap section→first word:', r.introTop-r.secTop, 'px  (was 1249)')
  console.log('   document height:', r.docH, '(was 10948)')
  await ctx.close()
}

// ---- 1 & 2. cursor + hover, desktop ----
{
  const ctx=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:2})
  const p=await ctx.newPage()
  await p.goto(B,{waitUntil:'load'}); await p.waitForTimeout(3500)
  await p.mouse.move(20,880); await p.mouse.wheel(0,1600); await p.waitForTimeout(1600)

  const res = await p.evaluate(async()=>{
    const frames=(n)=>new Promise(r=>{let i=0;const s=()=>{if(++i>=n)return r();requestAnimationFrame(s)};requestAnimationFrame(s)})
    const move=async(x,y)=>{window.dispatchEvent(new PointerEvent('pointermove',{clientX:x,clientY:y,bubbles:true,pointerType:'mouse',pointerId:1,isPrimary:true}));await frames(4)}
    const card=()=>document.querySelector('.node-labels__card-name')?.textContent.trim()||null
    // aim at a NAME label, not the star
    const name=[...document.querySelectorAll('.node-labels__name')][0]
    if(!name) return {err:'no name label'}
    const b=name.getBoundingClientRect()
    const target={x:Math.round(b.x+b.width/2),y:Math.round(b.y+b.height/2),text:name.textContent.replace(/\s+/g,' ').trim()}
    await move(target.x,target.y)
    const promoted=card()
    // hold perfectly still
    const t0=performance.now(); let lost=null
    while(performance.now()-t0<8000){ await frames(10); if(!card()){lost=Math.round(performance.now()-t0);break} }
    return {target, promoted, lostAfterMs:lost}
  })
  console.log('\n2. hover the NAME label:', JSON.stringify(res))
  await p.screenshot({path:`${OUT}/hover-name.png`})

  // cursor staleness: open a project, close it, pointer never moves
  await p.click('[aria-label*="Open project index" i]'); await p.waitForTimeout(700)
  await p.click('button[aria-label^="MedRAG"]'); await p.waitForTimeout(1600)
  const during=await p.evaluate(()=>document.querySelector('#custom-cursor')?.className+' | label='+(document.querySelector('.custom-cursor__label')?.textContent||''))
  await p.click('[aria-label*="Close overlay" i]'); await p.waitForTimeout(2000)
  const after=await p.evaluate(()=>document.querySelector('#custom-cursor')?.className+' | label='+(document.querySelector('.custom-cursor__label')?.textContent||''))
  console.log('\n1. cursor while overlay open :', during)
  console.log('   cursor after close        :', after, '  (was: is-enter | label=ENTER)')
  await p.screenshot({path:`${OUT}/after-close.png`})
  await ctx.close()
}
await browser.close()
