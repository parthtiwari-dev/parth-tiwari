import {illustratedScroll} from './illustrated-scroll.js';
const $=s=>document.querySelector(s),pieces=[...document.querySelectorAll('.scenic-piece')];
const clamp=x=>Math.max(0,Math.min(1,x));const ease=x=>{x=clamp(x);return x*x*(3-2*x)};
let query=1;
const captions=['The theatre of an answer','A bounded collection. The curtain opens.','Query 1 / 8 retrieved chunks','Query 1 / 8 retrieved / 3 cited / not refused','Two records. Two endings.','Query 7 / 8 retrieved chunks','Query 7 / 0 cited / refusal recorded','4 refusals / 20 recorded queries'];
const refresh=illustratedScroll((i,p,reduced)=>{
 const open=reduced?1:i===0?ease((p-.15)/.75):1;
 $('.curtain-left').style.transform=`translateX(${-open*102}%) skewY(${-open*5}deg)`;
 $('.curtain-right').style.transform=`translateX(${open*102}%) skewY(${open*5}deg)`;
 const arrival=i===2?ease(p*1.6):i>2?1:0;
 const refused=i===6||i===7||(i===4&&query===7);
 pieces.forEach((el,n)=>{
  const side=n<4?-1:1,rank=n%4;
  const entry=i===2?ease((p-rank*.08)*1.7):arrival;
  const retreat=refused?(i===6?ease(p*2):1):0;
  const x=250+rank*230+(n>=4?35:0),y=n<4?320:490;
  el.setAttribute('transform',`translate(${x+side*retreat*350},${y-(1-entry)*(850+n*30)}) rotate(${side*(1-entry)*24+side*retreat*10}) scale(${.68-retreat*.13})`);
  el.style.opacity=entry*(1-retreat*.7);
 });
 const answer=(i===3?ease(p*2):i===4&&query===1?1:0);
 $('.answer-form').style.opacity=answer;
 $('.answer-form').setAttribute('transform',`translate(0,${(1-answer)*160})`);
 $('.citation-lines').style.opacity=answer;
 $('.stage-light').style.opacity=refused?1:.4;
 $('#visual-state').textContent=i===4?`Query ${query} / 8 retrieved / ${query===1?'3 cited / not refused':'0 cited / refused'}`:captions[i];
});
document.querySelectorAll('[data-query]').forEach(b=>b.addEventListener('click',()=>{query=Number(b.dataset.query);document.querySelectorAll('[data-query]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$('.interaction-result').textContent=`Query ${query}: 8 retrieved, ${query===1?'3 cited. Not refused.':'0 cited. Refused.'}`;refresh()}));
