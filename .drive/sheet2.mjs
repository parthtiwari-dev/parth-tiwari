import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
import { readFileSync } from 'node:fs'
const E='/tmp/claude-0/-home-user-parth-tiwari/eb439659-3fdc-5ea3-aef2-c36947f045f3/scratchpad/drive/exit'
const b64=p=>'data:image/png;base64,'+readFileSync(p).toString('base64')
const html=`<style>
body{margin:0;background:#0b0b0c;color:#e8eef2;font-family:ui-sans-serif,system-ui}
h1{font:600 30px ui-sans-serif;margin:26px 30px 4px}
p.sub{margin:0 30px 20px;color:#8b969e;font-size:16px}
.row{display:flex;gap:22px;padding:0 30px 26px}
figure{margin:0;flex:1}img{width:100%;display:block;border-radius:8px;border:2px solid #2a2f34}
.g img{border-color:#2f6b4c}.r img{border-color:#7a3b33}
figcaption{font-size:14.5px;line-height:1.55;margin-top:11px}
.g figcaption{color:#7fe0a8}.r figcaption{color:#ff8a7a}
b{color:#fff}
</style>
<h1>Closing a project panel throws the scene away</h1>
<p class="sub">Desktop 1440×900. Scrolled into the field, opened MedRAG, closed it. Page scrollY is identical in both frames (800) — the camera is not.</p>
<div class="row">
<figure class="g"><img src="${b64(E+'/desktop-1-before.png')}"><figcaption><b>Before.</b> Scale reads NEIGHBOURHOOD. Twelve bodies, orbits, six names. "Drag to look around."</figcaption></figure>
<figure class="r"><img src="${b64(E+'/desktop-4-after3s.png')}"><figcaption><b>After closing.</b> Scale silently switched to SINGLE SYSTEM — parked at max zoom on the centre star. Orbits flattened to lines, names down from 31 elements to 16, and the only way back is a new "RESUME TOUR" button. A MedRAG hover card is stuck on screen; the pointer never moved. Top-right, the custom cursor still reads ENTER.</figcaption></figure>
</div>`
const browser=await chromium.launch(chromiumLaunchOptions({headless:true}))
const page=await browser.newPage({viewport:{width:1700,height:900},deviceScaleFactor:2})
await page.setContent(html); await page.waitForTimeout(500)
await page.screenshot({path:'/tmp/claude-0/-home-user-parth-tiwari/eb439659-3fdc-5ea3-aef2-c36947f045f3/scratchpad/drive/PANEL-EXIT.png',fullPage:true})
await browser.close(); console.log('ok')
