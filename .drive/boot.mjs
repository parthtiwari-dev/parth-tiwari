import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
import { mkdirSync } from 'node:fs'
const OUT='/tmp/claude-0/-home-user-parth-tiwari/eb439659-3fdc-5ea3-aef2-c36947f045f3/scratchpad/drive/boot'
mkdirSync(OUT,{recursive:true})
const browser=await chromium.launch(chromiumLaunchOptions({headless:true}))
for(const [tag, throttle] of [['fast',false],['slow-3g',true]]){
  const ctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true})
  const p=await ctx.newPage(); const cdp=await ctx.newCDPSession(p)
  if(throttle){ await cdp.send('Network.enable')
    await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:400,downloadThroughput:(400*1024)/8,uploadThroughput:(200*1024)/8}) }
  const t0=Date.now(); const seen=[]
  await p.goto('http://localhost:4400',{waitUntil:'commit'})
  let appeared=false
  for(let i=0;i<90;i++){
    const r=await p.evaluate(()=>{const b=document.querySelector('.boot-sequence')
      if(!b) return {present:false}
      const cs=getComputedStyle(b)
      return {present: cs.display!=='none' && cs.visibility!=='hidden' && Number(cs.opacity)>0.02,
        lines:[...b.querySelectorAll('.boot-sequence__line')].map(e=>e.textContent.trim())}}).catch(()=>({present:false}))
    const t=Date.now()-t0
    if(r.present){ appeared=true; const k=r.lines.join('|')
      if(!seen.length||seen[seen.length-1].k!==k){ seen.push({t,k,lines:r.lines}); await p.screenshot({path:`${OUT}/${tag}-${t}ms.png`}) } }
    else if(appeared){ seen.push({t,k:'GONE',lines:[]}); break }
    await p.waitForTimeout(100)
  }
  if(!appeared) seen.push({t:Date.now()-t0,k:'NEVER APPEARED',lines:[]})
  console.log(`\n### ${tag}`)
  for(const s of seen){ console.log(`  ${String(s.t).padStart(5)}ms  ${s.k==='GONE'?'— boot dismissed —':''}`); s.lines.forEach(l=>console.log('           '+l)) }
  await ctx.close()
}
await browser.close()
