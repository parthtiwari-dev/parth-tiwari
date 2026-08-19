import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
import { readFileSync } from 'node:fs'
const B='/tmp/claude-0/-home-user-parth-tiwari/eb439659-3fdc-5ea3-aef2-c36947f045f3/scratchpad/drive'
const b64=p=>'data:image/png;base64,'+readFileSync(p).toString('base64')
const html=`<style>
body{margin:0;background:#0b0b0c;color:#e8eef2;font-family:ui-sans-serif,system-ui}
h1{font:600 29px ui-sans-serif;margin:26px 30px 4px}
p.sub{margin:0 30px 20px;color:#8b969e;font-size:15.5px}
.row{display:flex;gap:20px;padding:0 30px 26px}
figure{margin:0;flex:1}img{width:100%;display:block;border-radius:8px;border:2px solid #2a2f34}
.g img{border-color:#2f6b4c}.r img{border-color:#7a3b33}.n img{border-color:#3a4046}
figcaption{font-size:14px;line-height:1.5;margin-top:10px}
.g figcaption{color:#7fe0a8}.r figcaption{color:#ff8a7a}.n figcaption{color:#aab4bb}
b{color:#fff}
</style>
<h1>Panel exit — same actions, before and after the fix</h1>
<p class="sub">Scroll into the field → open MedRAG → close it. Desktop 1440×900, real clicks.</p>
<div class="row">
<figure class="n"><img src="${b64(B+'/exit/desktop-1-before.png')}"><figcaption><b>Where you were.</b> Scale NEIGHBOURHOOD, "drag to look around".</figcaption></figure>
<figure class="r"><img src="${b64(B+'/exit/desktop-4-after3s.png')}"><figcaption><b>Live site, after closing.</b> SINGLE SYSTEM. Parked on the centre star, orbits flat, a "RESUME TOUR" button you didn't ask for, a stuck MedRAG card.</figcaption></figure>
<figure class="g"><img src="${b64(B+'/exit-fixed/desktop-4-after3s.png')}"><figcaption><b>Fixed.</b> Back to NEIGHBOURHOOD, "drag to look around", orbits and labels intact. Stars have kept orbiting — that's them moving, not the camera.</figcaption></figure>
</div>`
const browser=await chromium.launch(chromiumLaunchOptions({headless:true}))
const page=await browser.newPage({viewport:{width:2100,height:900},deviceScaleFactor:2})
await page.setContent(html); await page.waitForTimeout(500)
await page.screenshot({path:B+'/PANEL-EXIT-FIXED.png',fullPage:true})
await browser.close(); console.log('ok')
