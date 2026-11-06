(()=>{'use strict';
const $=(sel,root=document)=>root.querySelector(sel); const $$=(sel,root=document)=>Array.from(root.querySelectorAll(sel));
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse=window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(hover: none)').matches;
const mobile=()=>window.innerWidth<=740;
const clamp=(x,min=0,max=1)=>Math.min(max,Math.max(min,x));
const pageWipe=$('.page-wipe');

/* accessible mobile navigation */
const menuBtn=$('.menu-btn');const menu=$('.mobile-menu');
function setMenu(open){if(!menu||!menuBtn)return;menu.classList.toggle('open',open);menuBtn.classList.toggle('open',open);menuBtn.setAttribute('aria-expanded',String(open));menuBtn.setAttribute('aria-label',open?'關閉導覽選單':'開啟導覽選單');document.body.classList.toggle('lock-scroll',open);}
menuBtn?.addEventListener('click',()=>setMenu(!menu.classList.contains('open')));
window.addEventListener('keydown',ev=>{if(ev.key==='Escape')setMenu(false)});
$$('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));

/* internal navigation curtain: graceful fallback when JS is off */
$$('a[data-page-link]').forEach(a=>a.addEventListener('click',ev=>{
 if(ev.defaultPrevented||ev.button!==0||ev.ctrlKey||ev.metaKey||ev.altKey||ev.shiftKey||a.hasAttribute('download')||a.target==='_blank')return;
 const destination=new URL(a.href,location.href);
 if(destination.origin!==location.origin)return;
 if(destination.pathname===location.pathname){setMenu(false);return;}
 if(reduced)return;
 ev.preventDefault();setMenu(false);pageWipe?.classList.remove('leave');
 pageWipe?.classList.add('enter');document.body.classList.add('lock-scroll');
 window.setTimeout(()=>{location.href=destination.href},530);
}));

/* reveal elements */
const io='IntersectionObserver' in window?new IntersectionObserver(entries=>{
 entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');io.unobserve(e.target)}});
},{threshold:.1,rootMargin:'0px 0px -30px 0px'}):null;
$$('[data-reveal]').forEach(el=>{if(io)io.observe(el);else el.classList.add('in-view')});

/* cursor with contextual call-to-action */
const cursor=$('.cursor');let mouseX=-120,mouseY=-120,renderX=-120,renderY=-120,cursorVisible=false;
if(cursor&&!coarse&&!reduced){
 document.addEventListener('pointermove',e=>{mouseX=e.clientX;mouseY=e.clientY;if(!cursorVisible){cursorVisible=true;cursor.style.opacity='1'}});
 const animateCursor=()=>{renderX+=(mouseX-renderX)*.22;renderY+=(mouseY-renderY)*.22;cursor.style.left=renderX+'px';cursor.style.top=renderY+'px';requestAnimationFrame(animateCursor)};requestAnimationFrame(animateCursor);
 $$('a,button,[data-tilt]').forEach(el=>{el.addEventListener('pointerenter',()=>{cursor.classList.add('active');$('.cursor-label',cursor).textContent=el.matches('.work-row')?'OPEN':'GO ↗'});el.addEventListener('pointerleave',()=>cursor.classList.remove('active'))});
 document.addEventListener('pointerleave',()=>{cursor.style.opacity='0';cursorVisible=false});
}

/* Magnetic buttons */
if(!coarse&&!reduced){$$('.magnetic').forEach(el=>{
 el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();const x=(e.clientX-r.left-r.width/2)*.15;const y=(e.clientY-r.top-r.height/2)*.22;el.style.transform=`translate3d(${x}px,${y}px,0)`});
 el.addEventListener('pointerleave',()=>{el.style.transform='translate3d(0,0,0)'})
})}

/* Parallax hero character: layers move in separate directions */
const heroArt=$('#heroArt');if(heroArt&&!coarse&&!reduced){
 heroArt.addEventListener('pointermove',e=>{const r=heroArt.getBoundingClientRect();const x=(e.clientX-r.left-r.width/2)/r.width;const y=(e.clientY-r.top-r.height/2)/r.height;$$('[data-depth]',heroArt).forEach(el=>{let d=Number(el.dataset.depth)||0;el.style.translate=`${(x*d*75).toFixed(1)}px ${(y*d*70).toFixed(1)}px`})});
 heroArt.addEventListener('pointerleave',()=>$$('[data-depth]',heroArt).forEach(el=>el.style.translate='0px 0px'));
}
/* 3D tilt for lab sketch objects */
if(!coarse&&!reduced){$$('[data-tilt]').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(1100px) rotateX(${(-y*8).toFixed(2)}deg) rotateY(${(x*10).toFixed(2)}deg)`});el.addEventListener('pointerleave',()=>el.style.transform='')})}

/* project filter + interactive cursor-follow preview */
const filterBtns=$$('.filter[data-filter]');const workRows=$$('.work-row');
function applyFilter(value){workRows.forEach(row=>{row.hidden=value!=='all'&&!row.dataset.cat.split(' ').includes(value)});filterBtns.forEach(btn=>{const active=btn.dataset.filter===value;btn.classList.toggle('is-active',active);btn.setAttribute('aria-pressed',String(active))});const preview=$('#projectFloat');if(preview)preview.classList.remove('show')}
filterBtns.forEach(btn=>btn.addEventListener('click',()=>applyFilter(btn.dataset.filter)));
const float=$('#projectFloat');if(float&&!coarse&&!reduced){let fx=-300,fy=-300,px=-300,py=-300;workRows.forEach(row=>{
 row.addEventListener('pointerenter',()=>{if(row.hidden)return;const img=$('img',float);img.src=row.dataset.hoverImage;img.alt=row.querySelector('.work-name')?.textContent||'';float.classList.add('show')});
 row.addEventListener('pointermove',e=>{fx=e.clientX+95;fy=e.clientY-42});
 row.addEventListener('pointerleave',()=>float.classList.remove('show'));
 });(function animateFloat(){px+=(fx-px)*.18;py+=(fy-py)*.18;float.style.left=px+'px';float.style.top=py+'px';requestAnimationFrame(animateFloat)})()
}

/* Scroll-pinned kinetic storytelling – three horizontal acts */
const story=$('#story'),panels=$('#storyPanels'),storyFill=$('#storyFill'),storyStep=$('#storyStep');
const progressBar=$('.scroll-progress'),header=$('#siteHeader'),heroContent=$('.hero-content');
let ticking=false;
function tick(){
 const y=window.scrollY||window.pageYOffset;const scrollable=document.documentElement.scrollHeight-window.innerHeight;
 if(progressBar)progressBar.style.width=(scrollable>0?clamp(y/scrollable)*100:0)+'%';
 if(header)header.classList.toggle('scrolled',y>45);
 if(story&&panels&&!mobile()&&!reduced){const start=story.getBoundingClientRect().top+y;const span=story.offsetHeight-window.innerHeight;const t=span>0?clamp((y-start)/span):0;panels.style.transform=`translate3d(${(-66.66667*t).toFixed(4)}%,0,0)`;if(storyFill)storyFill.style.width=(100*t)+'%';if(storyStep)storyStep.textContent=String(Math.min(3,Math.floor(t*3)+1)).padStart(2,'0')+' / 03'}
 if(heroContent&&!mobile()&&!reduced)heroContent.style.translate=`0 ${(y*.18).toFixed(1)}px`;
 ticking=false;
}
window.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(tick)}},{passive:true});
window.addEventListener('resize',()=>{if(panels&&(mobile()||reduced)){panels.style.transform='none'}tick()},{passive:true});
requestAnimationFrame(tick);

/* before page cache: restore nav and scroll state */
window.addEventListener('pageshow',ev=>{if(ev.persisted){pageWipe?.classList.remove('enter');document.body.classList.remove('lock-scroll');tick()}});
})();
