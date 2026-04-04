// ─── Cursor ───────────────────────────────────────────────────
const dot=document.getElementById('cdot'),ring=document.getElementById('cring');
let mx=0,my=0,rx=0,ry=0,hov=false;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px'});
(function animRing(){rx+=(mx-rx)*.13;ry+=(my-ry)*.13;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animRing)})();
document.querySelectorAll('a,button,[data-h]').forEach(el=>{
  el.addEventListener('mouseenter',()=>{dot.classList.add('hov');ring.classList.add('hov')});
  el.addEventListener('mouseleave',()=>{dot.classList.remove('hov');ring.classList.remove('hov')});
});

// ─── Nav ──────────────────────────────────────────────────────
const nav=document.getElementById('nav'),nl=document.getElementById('nl'),ham=document.getElementById('ham');
window.addEventListener('scroll',()=>nav.classList.toggle('stuck',scrollY>40),{passive:true});
function toggleMenu(){ham.classList.toggle('open');nl.classList.toggle('open')}
function closeMenu(){ham.classList.remove('open');nl.classList.remove('open')}
function scrollTo(id){document.getElementById(id)?.scrollIntoView({behavior:'smooth'});closeMenu()}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});

// ─── Active nav ───────────────────────────────────────────────
const secs=document.querySelectorAll('section[id]'),links=document.querySelectorAll('.nav-link');
new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting)links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+e.target.id))
}),{rootMargin:'-40% 0px -55% 0px'}).observe&&secs.forEach(s=>new IntersectionObserver(
  entries=>entries.forEach(e=>{if(e.isIntersecting)links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+e.target.id))}),
  {rootMargin:'-40% 0px -55% 0px'}
).observe(s));

// ─── Scroll reveal ────────────────────────────────────────────
new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.09,rootMargin:'0px 0px -36px 0px'})
  .observe&&(()=>{const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.09,rootMargin:'0px 0px -36px 0px'});document.querySelectorAll('.rv').forEach(el=>o.observe(el))})();

// ─── Skill bars ───────────────────────────────────────────────
new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  e.target.querySelectorAll('.bar-fg').forEach((b,i)=>{b.style.transitionDelay=i*120+'ms';b.style.width=b.dataset.w+'%';b.classList.add('on')});
}),{threshold:.2}).observe(document.getElementById('skillGrid'));

// ─── Typewriter ───────────────────────────────────────────────
(()=>{const el=document.getElementById('typed'),txt='Transformando dados em decisões';let i=0;
setTimeout(()=>{const iv=setInterval(()=>{el.textContent=txt.slice(0,++i);if(i>=txt.length)clearInterval(iv)},44)},800)})();

// ─── KPI counter ─────────────────────────────────────────────
new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  e.target.querySelectorAll('.kpi-val[data-target]').forEach(el=>{
    const target=+el.dataset.target,suffix=el.dataset.suffix||'',t0=performance.now();
    (function tick(now){const p=Math.min((now-t0)/1400,1),ease=1-Math.pow(1-p,3);el.textContent=Math.round(target*ease)+suffix;if(p<1)requestAnimationFrame(tick)})(performance.now());
  });
}),{threshold:.5}).observe(document.querySelector('.kpi-strip'));

// ─── Magnetic buttons ─────────────────────────────────────────
document.querySelectorAll('.btn-p,.send-btn').forEach(btn=>{
  btn.addEventListener('mousemove',e=>{const r=btn.getBoundingClientRect();btn.style.transform=`translateY(-2px) translate(${(e.clientX-r.left-r.width/2)*.28}px,${(e.clientY-r.top-r.height/2)*.28}px) scale(1.02)`});
  btn.addEventListener('mouseleave',()=>btn.style.transform='');
});

// ─── Canvas particles ─────────────────────────────────────────
(()=>{
  const canvas=document.getElementById('heroCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');let raf,W,H;
  const resize=()=>{W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight};resize();
  const pts=Array.from({length:55},()=>({x:Math.random()*1200,y:Math.random()*700,r:Math.random()*1.3+.4,vx:(Math.random()-.5)*.28,vy:(Math.random()-.5)*.28,phase:Math.random()*Math.PI*2,spd:Math.random()*.004+.002}));
  const draw=()=>{
    ctx.clearRect(0,0,W,H);
    pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.phase+=p.spd;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;
      const a=(Math.sin(p.phase)*.5+.5)*.45;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(56,189,248,${a})`;ctx.fill()});
    for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<110){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=`rgba(56,189,248,${(1-d/110)*.065})`;ctx.lineWidth=.5;ctx.stroke()}}
    raf=requestAnimationFrame(draw)};draw();
  new ResizeObserver(resize).observe(canvas);
})();
