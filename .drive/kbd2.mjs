import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
const browser = await chromium.launch(chromiumLaunchOptions({ headless:true }))
for(const [w,h,label] of [[1440,900,'desktop'],[390,844,'phone']]){
  const ctx = await browser.newContext({ viewport:{width:w,height:h}, isMobile:w<500, hasTouch:w<500 })
  const page = await ctx.newPage()
  await page.goto('https://parth-tiwari-1.vercel.app',{waitUntil:'load'}); await page.waitForTimeout(3500)
  const stops=[]
  for(let i=0;i<45;i++){
    await page.keyboard.press('Tab'); await page.waitForTimeout(120)
    const s = await page.evaluate(()=>{const a=document.activeElement; if(!a||a===document.body) return '(body)'
      return (a.getAttribute('aria-label')||a.textContent||a.tagName).replace(/\s+/g,' ').trim().slice(0,48)})
    stops.push(s)
    if(stops.length>3 && s===stops[0] && stops[1]===undefined) break
  }
  const projRe=/medrag|beatmind|querypilot|tathya|secondself|oncoverse|upi fraud|spur chat|fraud risk|order supervisor|oracle auto|stick and dot|project index|open evidence/i
  const hits=[...new Set(stops.filter(s=>projRe.test(s)))]
  console.log(`\n### ${label} ${w}x${h} — ${new Set(stops).size} unique tab stops`)
  console.log('  project-related stops reachable by Tab:', hits.length? hits.join(' | ') : 'NONE')
  console.log('  all stops:', [...new Set(stops)].join(' › '))
  await ctx.close()
}
await browser.close()
