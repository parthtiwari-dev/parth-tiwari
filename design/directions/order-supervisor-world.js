(() => {
  const root=document.documentElement, scenes=[...document.querySelectorAll('.scene')], links=[...document.querySelectorAll('.chapters a')];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'), $=id=>document.getElementById(id);
  // x/y/scale frame the same persistent mechanism. Explode lifts the face and bezel.
  const states=[
    {x:705,y:450,z:.94,angle:-13,explode:0,gear:0,feed:0,track:.25,proposal:-220,p:0,event:200,e:0,latch:0,seal:0,caption:'One order. The watch begins.'},
    {x:710,y:465,z:1.04,angle:-22,explode:1,gear:15,feed:-90,track:.6,proposal:-220,p:0,event:200,e:0,latch:0,seal:0,caption:'Beneath the face: a persistent workflow.'},
    {x:720,y:450,z:1.46,angle:0,explode:1.7,gear:30,feed:0,track:1,proposal:-220,p:0,event:200,e:0,latch:0,seal:0,caption:'The record continues through every cycle.'},
    {x:770,y:545,z:1.62,angle:15,explode:2,gear:200,feed:20,track:1,proposal:-80,p:1,event:0,e:1,latch:0,seal:0,caption:'An event wakes the next reasoning cycle.'},
    {x:740,y:460,z:1.3,angle:8,explode:2,gear:200,feed:20,track:1,proposal:-80,p:.7,event:0,e:0,latch:0,seal:0,caption:'The gears rest. The record remains open.'},
    {x:850,y:445,z:2.05,angle:0,explode:2,gear:225,feed:20,track:1,proposal:0,p:1,event:200,e:0,latch:0,seal:0,caption:'The recommendation stops at the boundary.'},
    {x:670,y:440,z:1.52,angle:-8,explode:2,gear:345,feed:0,track:1,proposal:-12,p:.5,event:0,e:1,latch:-95,seal:1,caption:'A lifecycle condition releases completion.'},
    {x:710,y:435,z:.82,angle:0,explode:0,gear:365,feed:0,track:1,proposal:-80,p:0,event:160,e:0,latch:0,seal:1,caption:'The final reason stays in the record.'}
  ];
  let active=-1,current={...states[7]},origin,raf=0,scrollFrame=0,start=0,last=0;
  const metrics=window.__orderStudy={draws:0,activeScene:-1,running:false,maxDraw:0};
  const numberKeys=Object.keys(states[0]).filter(k=>typeof states[0][k]==='number');
  function paint(s){const t=performance.now(),portrait=innerWidth<=900;
    const x=portrait?600+(s.x-700)*.45:s.x, z=portrait?s.z*.91:s.z;
    $('camera').setAttribute('transform',`translate(${x} ${s.y}) scale(${z}) rotate(${s.angle})`);
    $('face').setAttribute('transform',`translate(${s.explode*60} ${-s.explode*230}) scale(${1+s.explode*.13})`);
    $('face').setAttribute('opacity',Math.max(0,1-s.explode*.72));
    $('bezel').setAttribute('transform',`translate(${-s.explode*45} ${-s.explode*120}) scale(${1+s.explode*.07})`);
    $('bezel').setAttribute('opacity',Math.max(.1,1-s.explode*.5));
    document.querySelectorAll('.gear').forEach((g,i)=>g.setAttribute('transform',`rotate(${s.gear*Number(g.dataset.direction)*(i%2?.74:1)})`));
    $('record-track').setAttribute('opacity',s.track);$('record-feed').setAttribute('transform',`translate(0 ${s.feed})`);
    $('proposal').setAttribute('transform',`translate(${s.proposal} 0)`);$('proposal').setAttribute('opacity',s.p);
    $('event').setAttribute('transform',`translate(${s.event} 0)`);$('event').setAttribute('opacity',s.e);
    $('latch').setAttribute('transform',`translate(0 ${s.latch})`);$('seal').setAttribute('opacity',s.seal);
    metrics.draws++;metrics.maxDraw=Math.max(metrics.maxDraw,performance.now()-t);
  }
  function stop(){cancelAnimationFrame(raf);raf=0;metrics.running=false}
  const smooth=t=>t*t*(3-2*t);
  function tick(now){raf=0;if(document.hidden||reduced.matches)return stop();
    if(now-last<1000/30){raf=requestAnimationFrame(tick);return}last=now;
    const p=Math.min(1,(now-start)/2800),target=states[active];
    for(const k of numberKeys){let q=p;
      // Arrival, contact, release: independent phases within one bounded event.
      if(['proposal','event','e','p','feed','gear'].includes(k))q=Math.max(0,Math.min(1,(p-.12)/.72));
      if(['latch','seal'].includes(k))q=Math.max(0,Math.min(1,(p-.6)/.4));
      current[k]=origin[k]+(target[k]-origin[k])*smooth(q);
    }
    // Small mechanical rebound, only when the recommendation meets the closed latch.
    if(active===5&&p>.65&&p<.9)current.proposal-=Math.sin((p-.65)/.25*Math.PI)*9;
    paint(current);if(p<1)raf=requestAnimationFrame(tick);else metrics.running=false;
  }
  function select(i,immediate=false){if(active===i&&!immediate)return;stop();active=i;metrics.activeScene=i;document.body.dataset.scene=i;
    $('instrument-state').textContent=states[i].caption;links.forEach((a,j)=>j===i?a.setAttribute('aria-current','step'):a.removeAttribute('aria-current'));
    if(immediate){current={...states[i]};paint(current);return}origin={...current};start=performance.now();metrics.running=true;raf=requestAnimationFrame(tick);
  }
  function locate(){scrollFrame=0;if(reduced.matches||document.hidden)return;let index=0,best=Infinity;
    scenes.forEach((s,i)=>{const r=s.getBoundingClientRect();const d=Math.abs(r.top+r.height/2-innerHeight/2);if(d<best){best=d;index=i}});select(index);
  }
  function schedule(){if(!scrollFrame&&!document.hidden)scrollFrame=requestAnimationFrame(locate)}
  function configure(){stop();cancelAnimationFrame(scrollFrame);scrollFrame=0;root.classList.toggle('enhanced',!reduced.matches);active=-1;
    if(reduced.matches)select(7,true);else{locate();select(active,true);
      if(active===0){current.z=.72;current.angle=-24;paint(current);active=-1;select(0)}
    }
  }
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',()=>{paint(current);schedule()},{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();cancelAnimationFrame(scrollFrame);scrollFrame=0}else{active=-1;schedule()}});
  addEventListener('pagehide',()=>{stop();cancelAnimationFrame(scrollFrame);scrollFrame=0});addEventListener('pageshow',configure);reduced.addEventListener('change',configure);configure();
})();
