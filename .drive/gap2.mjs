import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
const browser = await chromium.launch(chromiumLaunchOptions({ headless: true }))
const context = await browser.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true, hasTouch:true })
const page = await context.newPage()
await page.goto('https://parth-tiwari-1.vercel.app',{waitUntil:'load'}); await page.waitForTimeout(3500)
const r = await page.evaluate(()=>{
  const sec=document.querySelector('.mobile-systems-index')
  const kids=[...sec.children].map(el=>{
    const b=el.getBoundingClientRect()
    return {tag:el.tagName.toLowerCase(), cls:String(el.className).slice(0,60), top:Math.round(b.top+scrollY), h:Math.round(b.height),
      text:(el.textContent||'').replace(/\s+/g,' ').trim().slice(0,80), cs:{mt:getComputedStyle(el).marginTop, pt:getComputedStyle(el).paddingTop, minH:getComputedStyle(el).minHeight}}
  })
  const cs=getComputedStyle(sec)
  return {secTop:Math.round(sec.getBoundingClientRect().top+scrollY), padTop:cs.paddingTop, minH:cs.minHeight, kids}
})
console.log('section top', r.secTop, 'padding-top', r.padTop, 'min-height', r.minH)
r.kids.forEach(k=>console.log(`  top=${k.top} h=${k.h} mt=${k.cs.mt} pt=${k.cs.pt} minH=${k.cs.minH}  <${k.tag} .${k.cls}>  "${k.text}"`))
await browser.close()
