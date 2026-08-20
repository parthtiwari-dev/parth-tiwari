import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
const B='http://localhost:4400'
const browser=await chromium.launch(chromiumLaunchOptions({headless:true}))

// --- tab order ---
{
  const ctx=await browser.newContext({viewport:{width:1440,height:900}})
  const p=await ctx.newPage()
  await p.goto(B,{waitUntil:'load'}); await p.waitForTimeout(4000)
  const stops=[]
  for(let i=0;i<6;i++){ await p.keyboard.press('Tab'); await p.waitForTimeout(150)
    stops.push(await p.evaluate(()=>{const a=document.activeElement
      return a&&a!==document.body ? (a.getAttribute('aria-label')||a.textContent||a.tagName).replace(/\s+/g,' ').trim().slice(0,44) : '(body)'})) }
  console.log('2. first 6 tab stops:'); stops.forEach((s,i)=>console.log(`   ${i+1}. ${s}`))
  await ctx.close()
}

// --- android back ---
{
  const ctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true})
  const p=await ctx.newPage()
  await p.goto(B,{waitUntil:'load'}); await p.waitForTimeout(4000)
  const dlg=()=>p.evaluate(()=>!!document.querySelector('[role=dialog]'))
  await p.click('[aria-label*="Open project index" i]').catch(()=>{}); await p.waitForTimeout(700)
  await p.click('button[aria-label^="MedRAG"]'); await p.waitForTimeout(1600)
  console.log('\n3. opened MedRAG →', p.url(), 'dialog:', await dlg())
  await p.goBack(); await p.waitForTimeout(1600)
  console.log('   after BACK →', p.url(), 'dialog:', await dlg(), ' still on site:', !p.url().startsWith('about:'))

  // and closing with the X should not leave a dead history entry
  await p.click('[aria-label*="Open project index" i]').catch(()=>{}); await p.waitForTimeout(700)
  await p.click('button[aria-label^="MedRAG"]'); await p.waitForTimeout(1500)
  await p.click('[aria-label*="Close overlay" i]'); await p.waitForTimeout(1800)
  console.log('   opened+closed via X →', p.url(), 'dialog:', await dlg())
  await p.goBack(); await p.waitForTimeout(1500)
  console.log('   BACK after that   →', p.url(), ' left site:', p.url().startsWith('about:'))

  // flicking through several projects should still be ONE back press
  await p.goto(B,{waitUntil:'load'}); await p.waitForTimeout(4000)
  for(const name of ['MedRAG','Tathya','BeatMind']){
    await p.click('[aria-label*="Open project index" i]').catch(()=>{})
    await p.waitForTimeout(600)
    await p.click(`button[aria-label^="${name}"]`).catch(()=>{})
    await p.waitForTimeout(1300)
  }
  console.log('\n   after opening 3 projects in a row →', p.url())
  await p.goBack(); await p.waitForTimeout(1600)
  console.log('   one BACK →', p.url(), 'dialog:', await dlg(), ' left site:', p.url().startsWith('about:'))
  await ctx.close()
}
await browser.close()
