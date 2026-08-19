import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
import { mkdirSync } from 'node:fs'
const OUT='/tmp/claude-0/-home-user-parth-tiwari/eb439659-3fdc-5ea3-aef2-c36947f045f3/scratchpad/drive/kbd'
mkdirSync(OUT,{recursive:true})
const browser = await chromium.launch(chromiumLaunchOptions({ headless:true }))
const ctx = await browser.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:1 })
const page = await ctx.newPage()
await page.goto('https://parth-tiwari-1.vercel.app',{waitUntil:'load'}); await page.waitForTimeout(3500)
console.log('--- TAB ORDER (keyboard only) ---')
const seen=[]
for(let i=0;i<28;i++){
  await page.keyboard.press('Tab'); await page.waitForTimeout(180)
  const info = await page.evaluate(()=>{
    const a=document.activeElement; if(!a||a===document.body) return {t:'(body — focus lost)'}
    const r=a.getBoundingClientRect(); const cs=getComputedStyle(a)
    return {t:a.tagName.toLowerCase(), label:(a.getAttribute('aria-label')||a.textContent||'').replace(/\s+/g,' ').trim().slice(0,52),
      inView: r.top>=-2&&r.bottom<=innerHeight+2&&r.width>0, box:`${Math.round(r.width)}x${Math.round(r.height)}`,
      outline:cs.outlineWidth+' '+cs.outlineStyle, off:Math.round(r.top)}
  })
  if(info.t==='(body — focus lost)'){console.log(`  ${i+1}. FOCUS LOST TO BODY`); continue}
  console.log(`  ${String(i+1).padStart(2)}. <${info.t}> ${info.box.padEnd(9)} ${info.inView?'  ':'OFF'} outline=${info.outline.padEnd(14)} "${info.label}"`)
  seen.push(info.label)
  if(i===5) await page.screenshot({path:`${OUT}/tab-6.png`})
}
console.log('\n--- can keyboard reach a project? ---')
console.log('  reached:', seen.some(s=>/medrag|beatmind|querypilot|tathya|open evidence/i.test(s)) ? 'YES' : 'NO')
console.log('  reached booking:', seen.some(s=>/book a call/i.test(s)) ? 'YES':'NO')
await browser.close()
