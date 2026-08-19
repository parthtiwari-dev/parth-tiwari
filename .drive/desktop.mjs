import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
import { mkdirSync } from 'node:fs'
const SITE='https://parth-tiwari-1.vercel.app'
const OUT='/tmp/claude-0/-home-user-parth-tiwari/eb439659-3fdc-5ea3-aef2-c36947f045f3/scratchpad/drive/desktop'
mkdirSync(OUT,{recursive:true})
const browser = await chromium.launch(chromiumLaunchOptions({ headless:true }))
const context = await browser.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:2 })
const page = await context.newPage()
const errs=[]; page.on('pageerror',e=>errs.push(String(e).slice(0,200)))
let n=0
const shoot=async(l)=>{const y=await page.evaluate(()=>Math.round(scrollY));await page.screenshot({path:`${OUT}/${String(++n).padStart(2,'0')}-${l}-y${y}.png`});console.log(`  [${n}] ${l} y=${y}`)}
await page.goto(SITE,{waitUntil:'load'}); await page.waitForTimeout(3500)
await shoot('arrived')

console.log('\n--- real mouse wheel down the tour ---')
for(let i=0;i<5;i++){ await page.mouse.move(720,450); await page.mouse.wheel(0,900); await page.waitForTimeout(1000); await shoot(`wheel-${i+1}`) }

console.log('\n--- find a star and click it ---')
await page.mouse.move(720,450); await page.mouse.wheel(0,-6000); await page.waitForTimeout(1500)
const labels = await page.evaluate(()=>[...document.querySelectorAll('[class*=node-label],[class*=label]')].map(e=>{const r=e.getBoundingClientRect();return{t:e.textContent.trim().slice(0,30),x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2),w:Math.round(r.width)}}).filter(o=>o.w>2))
console.log('  labels:', JSON.stringify(labels))

// open via the project index instead (deterministic)
const idx = await page.$('[aria-label*="project index" i], [aria-label*="Open project index" i]')
if(idx){ await idx.click(); await page.waitForTimeout(900); await shoot('project-index-open') }
const openers = await page.evaluate(()=>[...document.querySelectorAll('button,a')].filter(e=>e.offsetParent).map(e=>({l:(e.getAttribute('aria-label')||e.textContent).replace(/\s+/g,' ').trim().slice(0,50)})))
console.log('  clickable now:', JSON.stringify(openers.slice(0,25)))
await browser.close()
console.log('\nerrors:', errs.length?errs.join('|'):'(none)')
