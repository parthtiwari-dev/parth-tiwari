import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {chromiumLaunchOptions} from './browser.mjs';
import {createStudyServer} from './world-study-server.mjs';
const out='.shots/querypilot-world';await mkdir(out,{recursive:true});
const server=createStudyServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=`http://127.0.0.1:${server.address().port}`,browser=await chromium.launch(chromiumLaunchOptions());
const results=[];const trace=JSON.parse(await readFile('design/directions/assets/querypilot-trace-v1.json','utf8'));
try{for(const width of [390,800,1440]){
 const context=await browser.newContext({viewport:{width,height:width===390?844:1000}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});page.on('request',r=>{if(!r.url().startsWith(base))errors.push(`External request ${r.url()}`)});
 await page.goto(`${base}/design/directions/querypilot-world.html`);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(100);await page.screenshot({path:`${out}/${width}-opening.png`});
 const go=async(i,p=.28)=>{await page.locator('[data-study-scene]').nth(i).evaluate((el,p)=>scrollTo({top:el.offsetTop+el.offsetHeight*p-innerHeight*.25,behavior:'instant'}),p);await page.waitForTimeout(110)};
 for(let i=0;i<9;i++){await go(i);const state=await page.evaluate(()=>({scene:+document.body.dataset.scene,overflow:document.documentElement.scrollWidth-innerWidth}));if(state.scene!==i||state.overflow>1)errors.push(JSON.stringify(state));await page.screenshot({path:`${out}/${width}-${i}.png`})}
 await go(2,.2);const a=await page.locator('.atlas-drawing').innerHTML();await go(2,.7);const b=await page.locator('.atlas-drawing').innerHTML();await go(2,.2);const c=await page.locator('.atlas-drawing').innerHTML();if(a===b||a!==c)errors.push('Scroll timeline is not reversible');
 const oldAngle=await page.locator('#atlas-angle').inputValue();await page.locator('#atlas-angle').focus();await page.keyboard.press('ArrowRight');if(await page.locator('#atlas-angle').inputValue()===oldAngle)errors.push('Keyboard map rotation');
 await page.locator('[data-table="orders"]').click();if(!await page.locator('[data-district="orders"]').evaluate(e=>e.classList.contains('is-selected')))errors.push('Table inspection');
 await go(5);for(const n of [1,2,3]){await page.locator(`[data-attempt="${n}"]`).click();const copy=await page.locator('.attempt-result').innerText();if(!copy.includes(n===1?'unsuccessful':n===2?'not preserved':'succeeded'))errors.push(`Attempt ${n}`)}
 await page.locator('.sql-record summary').click();if((await page.locator('.sql-record code').innerText()).trim()!==trace.sql.trim())errors.push('SQL differs from committed record');await page.screenshot({path:`${out}/${width}-sql.png`});await page.locator('.sql-record summary').click();
 await go(6);await page.locator('[data-intent="write"]').focus();await page.keyboard.press('Enter');if(!(await page.locator('.guard-result').innerText()).includes('blocked'))errors.push('Guard interaction');
 await go(7);for(const [mode,count] of [['before',63],['after',67]]){await page.locator(`[data-ledger="${mode}"]`).click();await page.waitForTimeout(100);const filled=await page.locator('.ledger-tile').evaluateAll(els=>els.filter(el=>el.style.fill!=='none').length);if(filled!==count)errors.push(`Ledger ${mode}: ${filled}`)}
 await page.waitForTimeout(250);const draws=await page.evaluate(()=>window.__immersiveStudy.draws);await page.waitForTimeout(300);if(draws!==await page.evaluate(()=>window.__immersiveStudy.draws))errors.push('Idle rendering');
 await go(8);await page.locator('.case-link').focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');if(await page.locator('.case-link').evaluate(e=>getComputedStyle(e).outlineStyle)==='none')errors.push('Keyboard focus');
 results.push({width,mode:'animated',errors});await context.close();
 for(const mode of ['reduced','no-js']){const ctx=await browser.newContext({viewport:{width,height:900},javaScriptEnabled:mode!=='no-js',reducedMotion:mode==='reduced'?'reduce':'no-preference'}),p=await ctx.newPage();await p.goto(`${base}/design/directions/querypilot-world.html`);const state=await p.evaluate(()=>({sections:document.querySelectorAll('[data-study-scene]').length,overflow:document.documentElement.scrollWidth-innerWidth,fixed:getComputedStyle(document.querySelector('[data-study-stage]')).position==='fixed',image:document.querySelector('[data-study-static]').naturalWidth,sql:document.querySelector('.sql-record code').textContent.length}));const errs=state.sections!==9||state.overflow>1||state.fixed||!state.image||state.sql<100?[JSON.stringify(state)]:[];results.push({width,mode,errors:errs});await p.screenshot({path:`${out}/${width}-${mode}.png`});await ctx.close()}
 console.log(width,errors.length?'FAIL '+errors.join(','):'PASS');
}}finally{await browser.close();await new Promise(r=>server.close(r));await writeFile(`${out}/results.json`,JSON.stringify(results,null,2))}
if(results.some(r=>r.errors.length))process.exitCode=1;
