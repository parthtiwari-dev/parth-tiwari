/* Shared lifecycle only. Art direction, state and interaction remain world-specific. */
export function createStudy({states,paint,onScene=()=>{},duration=2600}) {
 const root=document.documentElement, scenes=[...document.querySelectorAll('[data-study-scene]')], reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const metrics=window.__immersiveStudy={scene:-1,draws:0,running:false,maxWorkMs:0};
 let index=-1,current={...states.at(-1)},origin,raf=0,scrollFrame=0,start=0,last=0;
 const keys=Object.keys(states[0]).filter(k=>typeof states[0][k]==='number');
 function draw(){const t=performance.now();paint(current,index);metrics.draws++;metrics.maxWorkMs=Math.max(metrics.maxWorkMs,performance.now()-t)}
 function stop(){cancelAnimationFrame(raf);raf=0;metrics.running=false}
 function tick(now){raf=0;if(document.hidden||reduce.matches)return stop();if(now-last<1000/30){raf=requestAnimationFrame(tick);return}last=now;
  const p=Math.min(1,(now-start)/duration),e=p*p*(3-2*p);for(const key of keys)current[key]=origin[key]+(states[index][key]-origin[key])*e;draw();if(p<1)raf=requestAnimationFrame(tick);else metrics.running=false;
 }
 function select(next,immediate=false){if(next===index&&!immediate)return;stop();index=next;metrics.scene=index;document.body.dataset.scene=index;
  document.querySelectorAll('.chapter-nav a').forEach((a,i)=>i===index?a.setAttribute('aria-current','step'):a.removeAttribute('aria-current'));onScene(index);
  if(immediate){current={...states[index]};draw()}else{origin={...current};start=performance.now();metrics.running=true;raf=requestAnimationFrame(tick)}
 }
 function locate(){scrollFrame=0;if(document.hidden||reduce.matches)return;let found=0,dist=Infinity;scenes.forEach((s,i)=>{const r=s.getBoundingClientRect(),d=Math.abs(r.top+r.height*.5-innerHeight*.5);if(d<dist){dist=d;found=i}});select(found)}
 function queue(){if(!scrollFrame&&!reduce.matches&&!document.hidden)scrollFrame=requestAnimationFrame(locate)}
 function configure(){stop();cancelAnimationFrame(scrollFrame);scrollFrame=0;root.classList.toggle('enhanced',!reduce.matches);index=-1;if(reduce.matches)select(states.length-1,true);else{locate();select(index,true);if(index===0){current.zoom=states[0].zoom*.92;draw();origin={...current};start=performance.now();metrics.running=true;raf=requestAnimationFrame(tick)}}}
 addEventListener('scroll',queue,{passive:true});addEventListener('resize',()=>{draw();queue()},{passive:true});reduce.addEventListener('change',configure);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();cancelAnimationFrame(scrollFrame);scrollFrame=0}else{index=-1;queue()}});
 addEventListener('pagehide',()=>{stop();cancelAnimationFrame(scrollFrame);scrollFrame=0});addEventListener('pageshow',configure);configure();
 return {refresh:draw,update(patch){stop();states[index]={...states[index],...patch};origin={...current};start=performance.now();metrics.running=true;raf=requestAnimationFrame(tick)},get reduced(){return reduce.matches},get scene(){return index},get state(){return current}};
}
