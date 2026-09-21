/** Native scroll is the timeline; no idle animation loop or scroll interception. */
export function illustratedScroll(paint) {
  const scenes=[...document.querySelectorAll('[data-study-scene]')];
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const metrics=window.__immersiveStudy={scene:0,draws:0,running:false,progress:0};
  let frame=0;
  function draw(){
    frame=0; metrics.running=false;
    if(document.hidden)return;
    const positions=scenes.map(el=>el.offsetTop);
    const y=scrollY+innerHeight*.25;
    let i=0; while(i<scenes.length-1&&y>=positions[i+1])i++;
    const p=Math.max(0,Math.min(1,(y-positions[i])/(positions[i+1]-positions[i]||innerHeight)));
    metrics.scene=i;metrics.progress=p;metrics.draws++;
    document.body.dataset.scene=i;
    document.querySelectorAll('.chapter-nav a').forEach((a,n)=>{if(n===i)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current')});
    document.documentElement.style.setProperty('--journey',`${(i+p)/scenes.length*100}%`);
    paint(i,reduce.matches?1:p,reduce.matches);
  }
  function schedule(){if(!frame&&!document.hidden){metrics.running=true;frame=requestAnimationFrame(draw)}}
  function configure(){document.documentElement.classList.toggle('illustrated',!reduce.matches);schedule()}
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;metrics.running=false}else schedule()});
  addEventListener('pagehide',()=>{cancelAnimationFrame(frame);frame=0;metrics.running=false});
  addEventListener('pageshow',configure);reduce.addEventListener('change',configure);
  configure();return schedule;
}
