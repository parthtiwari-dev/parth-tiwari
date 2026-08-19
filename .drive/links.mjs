import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
const urls = ['https://cal.com/parth-tiwari','https://github.com/parthtiwari-dev','https://github.com/parthtiwari-dev/Evidence-Bound-Drug-RAG','https://github.com/parthtiwari-dev/querypilot','https://github.com/parthtiwari-dev/support-core','https://github.com/parthtiwari-dev/tathya','https://github.com/parthtiwari-dev/upi-fraud-engine','https://linkedin.com/in/parth-tiwar1','https://querypilot-backend.onrender.com/docs','https://support-core-nine.vercel.app','https://tathya-1.vercel.app','https://vivid-alpha.vercel.app','https://www.beatmind.tech','https://x.com/Parth___tiwari','https://parth-tiwari.vercel.app']
const browser = await chromium.launch(chromiumLaunchOptions({ headless:true }))
const ctx = await browser.newContext()
for(const u of urls){
  const page = await ctx.newPage()
  const t0=Date.now()
  try{
    const r = await page.goto(u,{waitUntil:'domcontentloaded',timeout:25000})
    const ms=Date.now()-t0
    const title = await page.title().catch(()=>'')
    console.log(`${String(r?.status()).padEnd(4)} ${String(ms+'ms').padEnd(8)} ${u}\n        title: "${title.slice(0,70)}"`)
  }catch(e){ console.log(`FAIL ${String(Date.now()-t0+'ms').padEnd(8)} ${u}\n        ${e.message.split('\n')[0].slice(0,90)}`) }
  await page.close()
}
await browser.close()
