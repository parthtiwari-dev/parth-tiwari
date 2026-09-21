import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {chromiumLaunchOptions} from './browser.mjs';
import {createStudyServer} from './world-study-server.mjs';
const out='.shots/illustrated-worlds';await mkdir(out,{recursive:true});
const server=createStudyServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=`http://127.0.0.1:${server.address().port}`,browser=await chromium.launch(chromiumLaunchOptions()),results=[];
try{for(const slug of ['medrag','secondself'])for(const width of [390,800,1440]){
 const context=await browser.newContext({viewport:{width,height:width===390?844:900}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
 await page.goto(`${base}/design/directions/${slug}-world.html`);await page.evaluate(()=>document.fonts.ready);
 const go=async(i,p=.3)=>{await page.locator('[data-study-scene]').nth(i).evaluate((el,p)=>scrollTo({top:el.offsetTop+el.offsetHeight*p-innerHeight*.25,behavior:'instant'}),p);await page.waitForTimeout(100)};
 for(let i=0;i<8;i++){await go(i);const check=await page.evaluate(()=>({scene:+document.body.dataset.scene,overflow:document.documentElement.scrollWidth-innerWidth}));if(check.scene!==i||check.overflow>1)errors.push(JSON.stringify(check));await page.screenshot({path:`${out}/${slug}-${width}-${i}.png`})}
 await go(2,.2);const before=await page.locator('svg').innerHTML();await go(2,.7);const after=await page.locator('svg').innerHTML();if(before===after)errors.push('No scroll choreography');
 if(slug==='medrag'){await go(4);for(const q of [7,1]){await page.locator(`[data-query="${q}"]`).click();if(!(await page.locator('.interaction-result').innerText()).includes(q===7?'0 cited':'3 cited'))errors.push('Query outcome');}}
 else{await go(2);await page.locator('[data-path="semantic"]').click();if(!(await page.locator('.path-result').innerText()).includes('Semantic'))errors.push('Semantic path');await go(3);await page.locator('[data-evidence="unsupported"]').click();if(!(await page.locator('.evidence-result').innerText()).includes('Removed'))errors.push('Evidence filter');await go(6);for(const d of ['revise','approve','reject']){await page.locator(`[data-decision="${d}"]`).click();if(!(await page.locator('.review-result').innerText()).includes('Nothing was sent'))errors.push('Review boundary')}await page.locator('.reset-review').click();}
 await page.waitForTimeout(150);const draws=await page.evaluate(()=>window.__immersiveStudy.draws);await page.waitForTimeout(250);if(draws!==await page.evaluate(()=>window.__immersiveStudy.draws))errors.push('Idle draws');
 results.push({slug,width,mode:'animated',errors});await context.close();
 for(const mode of ['reduced','no-js']){const ctx=await browser.newContext({viewport:{width,height:900},javaScriptEnabled:mode!=='no-js',reducedMotion:mode==='reduced'?'reduce':'no-preference'}),p=await ctx.newPage();await p.goto(`${base}/design/directions/${slug}-world.html`);const ok=await p.evaluate(()=>document.querySelectorAll('[data-study-scene]').length===8&&document.documentElement.scrollWidth<=innerWidth+1&&getComputedStyle(document.querySelector('[data-study-stage]')).position!=='fixed'&&document.querySelector('[data-study-static]').naturalWidth>0);results.push({slug,width,mode,errors:ok?[]:['Fallback failure']});await ctx.close()}
 console.log(slug,width,errors.length?'FAIL '+errors.join(','):'PASS');
}}finally{await browser.close();await new Promise(r=>server.close(r));await writeFile(`${out}/results.json`,JSON.stringify(results,null,2))}
if(results.some(r=>r.errors.length))process.exitCode=1;
