import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
import { readFileSync } from 'node:fs'
const J='/tmp/claude-0/-home-user-parth-tiwari/eb439659-3fdc-5ea3-aef2-c36947f045f3/scratchpad/drive/journey'
const b64=(p)=>'data:image/png;base64,'+readFileSync(p).toString('base64')
const frames=[
 ['00-y0.png','0','Arrival. Name + an abstract tagline. Beautiful.','ok'],
 ['01-y545.png','545','Scene. Two project names, nothing else.','bad'],
 ['02-y1090.png','1090','One star. No words.','bad'],
 ['03-y1635.png','1635','No words.','bad'],
 ['04-y2180.png','2180','No words.','bad'],
 ['05-y2725.png','2725','No words. Five screens in.','bad'],
 ['06-y3270.png','3270','"I build AI products people actually use."','good'],
 ['08-y5439.png','5439','A whole blank screen — 148vh of padding.','bug'],
 ['10-y7560.png','7560','The cards that sell. Screen 9 of 13.','good'],
]
const html=`<style>
body{margin:0;background:#0b0b0c;font-family:ui-sans-serif,system-ui;color:#e8eef2}
h1{font:600 30px ui-sans-serif;margin:26px 30px 4px}
p.sub{margin:0 30px 22px;color:#8b969e;font-size:16px}
.row{display:flex;gap:16px;padding:0 30px 30px;align-items:flex-start}
figure{margin:0;width:230px}
img{width:230px;display:block;border-radius:7px;border:1px solid #2a2f34}
figcaption{font-size:12.5px;line-height:1.4;margin-top:9px}
.y{font:600 12px ui-monospace;color:#6f7a82}
.bad figcaption{color:#ff8a7a}.good figcaption{color:#7fe0a8}.bug figcaption{color:#ffd166}.ok figcaption{color:#c3ccd2}
.bad img{border-color:#7a3b33}.good img{border-color:#2f6b4c}.bug img{border-color:#7a6220}
</style>
<h1>The client's scroll, on a phone — all 13 screens' worth</h1>
<p class="sub">Real touch swipes on the live site, 390×844. Screens 2-6 carry no new information. The first plain-English sentence about the work lands on screen 7.</p>
<div class="row">${frames.map(([f,y,cap,k])=>`<figure class="${k}"><img src="${b64(J+'/'+f)}"><div class="y">scrollY ${y}</div><figcaption>${cap}</figcaption></figure>`).join('')}</div>`
const browser=await chromium.launch(chromiumLaunchOptions({headless:true}))
const page=await browser.newPage({viewport:{width:2320,height:1000},deviceScaleFactor:2})
await page.setContent(html); await page.waitForTimeout(600)
await page.screenshot({path:'/tmp/claude-0/-home-user-parth-tiwari/eb439659-3fdc-5ea3-aef2-c36947f045f3/scratchpad/drive/CONTACT-SHEET.png',fullPage:true})
await browser.close(); console.log('ok')
