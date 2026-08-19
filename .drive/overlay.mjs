import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
import { mkdirSync } from 'node:fs'
const SITE='https://parth-tiwari-1.vercel.app'
const OUT='/tmp/claude-0/-home-user-parth-tiwari/eb439659-3fdc-5ea3-aef2-c36947f045f3/scratchpad/drive/overlay'
mkdirSync(OUT,{recursive:true})
const browser = await chromium.launch(chromiumLaunchOptions({ headless:true }))
const context = await browser.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:2 })
const page = await context.newPage(); const errs=[]; page.on('pageerror',e=>errs.push(String(e).slice(0,200)))
let n=0; const shoot=async(l,clip)=>{await page.screenshot({path:`${OUT}/${String(++n).padStart(2,'0')}-${l}.png`,...(clip?{clip}:{})});console.log(`  [${n}] ${l}`)}
await page.goto(SITE,{waitUntil:'load'}); await page.waitForTimeout(3500)

console.log('--- left rail region ---')
await shoot('left-rail', {x:0,y:400,width:220,height:400})
const rail = await page.evaluate(()=>[...document.querySelectorAll('*')].filter(e=>{const r=e.getBoundingClientRect();return r.left<70&&r.width>0&&r.width<70&&r.height>60&&e.textContent.trim()}).map(e=>{const r=e.getBoundingClientRect();return{t:e.textContent.replace(/\s+/g,' ').trim().slice(0,40),cls:String(e.className).slice(0,40),x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)}}))
console.log(JSON.stringify(rail,null,1))

console.log('\n--- open a project via index ---')
await page.click('[aria-label*="Open project index" i]'); await page.waitForTimeout(800)
await page.click('button[aria-label^="MedRAG"]'); await page.waitForTimeout(1600)
await shoot('overlay-open')
const st = await page.evaluate(()=>{
  const d=document.querySelector('[role="dialog"]')
  return d?{role:d.getAttribute('role'),modal:d.getAttribute('aria-modal'),label:d.getAttribute('aria-label'),active:document.activeElement.tagName+'/'+(document.activeElement.getAttribute('aria-label')||document.activeElement.textContent||'').replace(/\s+/g,' ').slice(0,40), scrollH:d.scrollHeight, clientH:d.clientHeight, overflow:getComputedStyle(d).overflowY}:null
})
console.log('  dialog:', JSON.stringify(st))

console.log('\n--- try to get out: ESCAPE ---')
await page.keyboard.press('Escape'); await page.waitForTimeout(900)
console.log('  dialog still open?', await page.evaluate(()=>!!document.querySelector('[role="dialog"]')))
console.log('  focus restored to:', await page.evaluate(()=>document.activeElement.tagName+'/'+(document.activeElement.getAttribute('aria-label')||'').slice(0,40)))
await shoot('after-escape')

console.log('\n--- reopen, try BROWSER BACK ---')
await page.click('[aria-label*="Open project index" i]'); await page.waitForTimeout(700)
await page.click('button[aria-label^="MedRAG"]'); await page.waitForTimeout(1500)
console.log('  url now:', page.url())
await page.goBack({waitUntil:'commit'}).catch(e=>console.log('  goBack err', e.message))
await page.waitForTimeout(1500)
console.log('  after back → url:', page.url())
console.log('  dialog open?', await page.evaluate(()=>!!document.querySelector('[role="dialog"]')).catch(()=>'nav'))
await shoot('after-browser-back')
console.log('\nerrors:', errs.length?errs.join('|'):'(none)')
await browser.close()
