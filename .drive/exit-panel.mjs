import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
import { mkdirSync } from 'node:fs'
const OUT='/tmp/claude-0/-home-user-parth-tiwari/eb439659-3fdc-5ea3-aef2-c36947f045f3/scratchpad/drive/exit-fixed'
mkdirSync(OUT,{recursive:true})
const browser=await chromium.launch(chromiumLaunchOptions({headless:true}))

async function run(w,h,mobile,tag){
  const ctx=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:2,isMobile:mobile,hasTouch:mobile})
  const page=await ctx.newPage(); const cdp=await ctx.newCDPSession(page)
  const errs=[]; page.on('pageerror',e=>errs.push(String(e).slice(0,160)))
  await page.goto('http://127.0.0.1:4173',{waitUntil:'load'}); await page.waitForTimeout(3800)

  const state=()=>page.evaluate(()=>{
    const c=document.querySelector('canvas')
    return {scrollY:Math.round(scrollY), url:location.search,
      dialog:!!document.querySelector('[role=dialog]'),
      canvasPresent:!!c, canvasSize:c?`${c.width}x${c.height}`:null,
      canvasOpacity:c?getComputedStyle(c).opacity:null,
      canvasVisibility:c?getComputedStyle(c).visibility:null,
      canvasDisplay:c?getComputedStyle(c.parentElement).display:null,
      heroVisible:(()=>{const el=[...document.querySelectorAll('h1,.hero-section')][0]; if(!el)return null
        const cs=getComputedStyle(el);return cs.visibility+'/'+cs.opacity})(),
      legend:(()=>{const el=document.querySelector('[class*=legend],[class*=constellation-index]');if(!el)return null
        const cs=getComputedStyle(el);return cs.visibility+'/'+cs.opacity})(),
      scaleReadout:(()=>{const el=document.querySelector('[class*=navigation-controls],[class*=scale]');if(!el)return null
        const cs=getComputedStyle(el);return cs.visibility+'/'+cs.opacity})(),
      labelCount:document.querySelectorAll('[class*=node-label]').length,
      bodyOverflow:getComputedStyle(document.body).overflow, bodyPos:getComputedStyle(document.body).position,
      docH:document.documentElement.scrollHeight}
  })

  // scroll into the field first so there is real state to lose
  if(mobile){
    for(let k=0;k<3;k++){
      await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:195,y:700,id:1}]})
      for(let i=1;i<=14;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:195,y:700-i*38,id:1}]});await page.waitForTimeout(10)}
      await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]}); await page.waitForTimeout(700)
    }
  } else {
    await page.mouse.move(w/2,h/2); await page.mouse.wheel(0,1600); await page.waitForTimeout(1400)
  }
  console.log(`\n##### ${tag} #####`)
  const before=await state(); console.log(' BEFORE open :', JSON.stringify(before))
  await page.screenshot({path:`${OUT}/${tag}-1-before.png`})

  // open project index then a project
  await page.click('[aria-label*="Open project index" i]').catch(()=>{})
  await page.waitForTimeout(900)
  const opened = await page.click('button[aria-label^="MedRAG"]').then(()=>true).catch(()=>false)
  if(!opened){ console.log('  could not open MedRAG via index'); }
  await page.waitForTimeout(1800)
  const during=await state(); console.log(' WHILE open  :', JSON.stringify(during))
  await page.screenshot({path:`${OUT}/${tag}-2-open.png`})

  // close it
  await page.click('[aria-label*="Close overlay" i], [aria-label*="Close project" i]').catch(async()=>{await page.keyboard.press('Escape')})
  await page.waitForTimeout(2200)
  const after=await state(); console.log(' AFTER close :', JSON.stringify(after))
  await page.screenshot({path:`${OUT}/${tag}-3-after.png`})
  await page.waitForTimeout(3000)
  console.log(' AFTER +3s   :', JSON.stringify(await state()))
  await page.screenshot({path:`${OUT}/${tag}-4-after3s.png`})
  console.log(' errors:', errs.length?errs.join('|'):'(none)')
  await ctx.close()
}
await run(1440,900,false,'desktop')
await run(390,844,true,'phone')
await browser.close()
