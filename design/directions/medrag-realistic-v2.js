import { createStudy } from './world-study-runtime-realistic-v1.js';
const art=document.querySelector('.world-art'),pieces=[...document.querySelectorAll('.fragment')],readout=document.querySelector('.readout'),light=document.querySelector('.portal-light'),beams=document.querySelector('.citation-beams');
const states=[{zoom:1,x:0,y:0,spread:0,visible:0,cited:0,lit:.1},{zoom:1.16,x:-1,y:1,spread:0,visible:0,cited:0,lit:.18},{zoom:1.22,x:0,y:0,spread:1,visible:1,cited:0,lit:.4},{zoom:1.36,x:-2,y:2,spread:.65,visible:1,cited:1,lit:1},{zoom:1.1,x:0,y:0,spread:.65,visible:1,cited:1,lit:1},{zoom:1.25,x:1,y:0,spread:1,visible:1,cited:0,lit:.4},{zoom:1.48,x:-2,y:3,spread:1.8,visible:0,cited:0,lit:0},{zoom:1,x:0,y:0,spread:1.8,visible:0,cited:0,lit:.08}];
const captions=['An answer has weight.','Approach the evidence boundary.','Eight retrieved chunks.','Three cited chunks accompany the answer.','Compare two committed records.','The same retrieval count returns.','Zero cited. Refusal recorded.','The absence is part of the result.'];
let query=1,controller;
function paint(s,index){const portrait=innerWidth<=900,unit=portrait?.58:1;let cited=s.cited,spread=s.spread,visible=s.visible,lit=s.lit;

 art.style.transform=`translate(${s.x}% ,${s.y}%) scale(${s.zoom})`;
 light.style.opacity=lit;beams.style.opacity=cited;
 pieces.forEach((p,i)=>{const a=i*Math.PI/4-.6,r=190*spread*unit;let x=Math.cos(a)*r,y=Math.sin(a)*r*.72,opacity=visible;
  if(cited>.01){if(i<3){x=x*(1-cited)+(i-1)*43*unit*cited;y=y*(1-cited)+(-50+i*42)*unit*cited}else opacity*=1-cited*.86}
  p.style.transform=`translate(${x}px,${y}px) rotate(${i*37+spread*16}deg) scale(${.65+(i<3?cited*.35:0)})`;p.style.opacity=opacity;
 });readout.style.opacity=index>=2&&index<=6?1:0;
}
function setRecord(q){document.getElementById('readout-query').textContent=`QUERY ${q}`;document.getElementById('cited-count').textContent=q===1?'3':'0';document.getElementById('readout-result').textContent=q===1?'Not refused':'Refusal recorded'}
controller=createStudy({states,paint,onScene(i){document.getElementById('visual-state').textContent=captions[i];setRecord(i>=5?7:i===4?query:1);if(i===2||i===5){document.getElementById('cited-count').textContent='—';document.getElementById('readout-result').textContent='Retrieval record'}}});
document.querySelectorAll('[data-query]').forEach(button=>button.addEventListener('click',()=>{query=Number(button.dataset.query);document.querySelectorAll('[data-query]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelector('.interaction-result').textContent=query===1?'Query 1: 8 retrieved, 3 cited. Not refused.':'Query 7: 8 retrieved, 0 cited. Refusal recorded.';setRecord(query);controller.update(query===1?{cited:1,spread:.65,visible:1,lit:1}:{cited:0,spread:1.8,visible:0,lit:0})}));
