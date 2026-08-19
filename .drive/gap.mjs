import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
const browser = await chromium.launch(chromiumLaunchOptions({ headless: true }))
const context = await browser.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true, hasTouch:true })
const page = await context.newPage()
await page.goto('https://parth-tiwari-1.vercel.app',{waitUntil:'load'}); await page.waitForTimeout(3500)
const map = await page.evaluate(()=>{
  const out=[]
  document.querySelectorAll('body > *, #app > *, #app > * > *, section, header, footer, main, [class*=section]').forEach(el=>{
    const r=el.getBoundingClientRect()
    const top=Math.round(r.top+window.scrollY), h=Math.round(r.height)
    if(h<40) return
    out.push({tag:el.tagName.toLowerCase(), cls:(el.className&&String(el.className).slice(0,45))||'', id:el.id||'', top, bottom:top+h, h})
  })
  return {out, docH: document.documentElement.scrollHeight}
})
console.log('doc height', map.docH)
map.out.sort((a,b)=>a.top-b.top).forEach(s=>console.log(`${String(s.top).padStart(6)} → ${String(s.bottom).padStart(6)}  h=${String(s.h).padStart(5)}  ${s.tag} ${s.id?'#'+s.id:''} .${s.cls}`))
await browser.close()
