import {illustratedScroll} from './illustrated-scroll.js';
const $=s=>document.querySelector(s),clamp=x=>Math.max(0,Math.min(1,x));
let decision='pending',path='lexical',inspected='';
const captions=['A companion for the search','Carry what is true','Exact terms + related experience','An unsupported claim falls away','A packet takes shape','Come home with something reviewable','Your decision. No outbound action.','A little further, together'];
const refresh=illustratedScroll((i,p,reduced)=>{
 const home=i===0?1:i===1?1-clamp(p*2):i===5?clamp(p*2):i>=6?1:0;
 $('.home-room').style.clipPath=`inset(0 ${(1-home)*100}% 0 0)`;
 const t=i+(reduced?1:p),trip=t<1?0:t<4?(t-1)/3:t<5?1:t<6?6-t:0;
 $('.landscape').style.transform=`translateX(${-trip*23}%)`;
 $('.route-line').style.strokeDashoffset=-t*70;
 $('.route-line').style.opacity=i>=1&&i<=5?.7:0;
 const walk=Math.sin(t*34)*5,x=220+trip*700,y=590-trip*65;
 $('.owner-mark').setAttribute('transform','translate(175,590)');
 $('.companion-mark').setAttribute('transform',`translate(${x},${y+walk}) rotate(${Math.sin(t*20)*4})`);
 const leaves=[$('.leaf-project'),$('.leaf-experience'),$('.leaf-unsupported')];
 leaves.forEach((el,n)=>{
  let visible=i>=1&&i<=4?1:0;
  const gather=i===4?clamp(p*2):i>4?1:0;
  const fall=n===2&&i>=3?i===3?clamp(p*2):1:0;
  if(n===2)visible*=1-fall;
  const lx=x+(n-1)*130*(1-gather),ly=y-145*(1-gather)+fall*250;
  el.setAttribute('transform',`translate(${lx},${ly}) rotate(${(n-1)*12*(1-gather)+fall*60}) scale(.7)`);
  el.style.opacity=visible*(1-gather);
  el.style.filter=inspected===['project','experience','unsupported'][n]?'drop-shadow(0 0 12px #fff4c6)':'';
 });
 const env=$('.journey-envelope'),show=i>=4&&i<=6;
 env.style.opacity=show?(decision==='reject'&&i===6?.2:1):0;
 env.setAttribute('transform',`translate(${i===6?850:x},${i===6?decision==='reject'?720:510:y-90}) rotate(${i===4?(1-p)*15:0})`);
 $('.letter-flap').style.transform=decision==='revise'&&i===6?'scaleY(-1)':'scaleY(1)';
 $('.letter-seal').style.opacity=i>=5&&decision!=='revise'?1:0;
 $('#room-state').textContent=i===6?{pending:'Awaiting your decision / nothing sent',approve:'Approved in rehearsal / nothing sent',revise:'Returned for revision / nothing sent',reject:'Withdrawn in rehearsal / nothing sent'}[decision]:captions[i];
 $('.route-line').style.stroke=path==='semantic'?'#f6bacb':'#ffdb93';
});
document.querySelectorAll('[data-path]').forEach(b=>b.addEventListener('click',()=>{path=b.dataset.path;document.querySelectorAll('[data-path]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$('.path-result').textContent=path==='lexical'?'Lexical search finds exact skills and project terms.':'Semantic search surfaces related experience. Similarity does not establish a new fact.';refresh()}));
const evidence={project:'Project evidence can enter with its source attached. No extra result is invented.',experience:'Experience evidence can enter with provenance. Related wording cannot expand what actually happened.',unsupported:'Removed before drafting. An unsupported claim does not earn a place by sounding convincing.'};
document.querySelectorAll('[data-evidence]').forEach(b=>b.addEventListener('click',()=>{inspected=b.dataset.evidence;$('.evidence-result').textContent=evidence[inspected];document.querySelectorAll('[data-evidence]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));refresh()}));
function review(value){decision=value;$('.review-result').textContent={approve:'Approved in this rehearsal. Nothing was sent. The real system still operates inside its verified outbound boundaries.',revise:'Returned for revision in this rehearsal. Nothing was sent; the packet is open for changes.',reject:'Rejected in this rehearsal. Nothing was sent. The prepared packet is withdrawn.',pending:'Awaiting your decision in this illustration. Nothing has been sent.'}[value];document.querySelectorAll('[data-decision]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.decision===value)));refresh()}
document.querySelectorAll('[data-decision]').forEach(b=>b.addEventListener('click',()=>review(b.dataset.decision)));$('.reset-review').addEventListener('click',()=>review('pending'));
