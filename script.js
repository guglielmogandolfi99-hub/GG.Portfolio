(function(){'use strict';

/* ========================================
   THEME (must run first)
   ======================================== */
var theme=localStorage.getItem('theme')||'dark';
document.documentElement.setAttribute('data-theme',theme);
var themeBtn=document.querySelector('.theme-btn');
if(themeBtn)themeBtn.textContent=theme==='light'?'☾':'☀';

window.toggleTheme=function(){
  theme=theme==='dark'?'light':'dark';
  document.documentElement.setAttribute('data-theme',theme);
  localStorage.setItem('theme',theme);
  var btn=document.querySelector('.theme-btn');
  if(btn)btn.textContent=theme==='light'?'☾':'☀';
};

/* ========================================
   PRELOADER
   ======================================== */
var loader=document.createElement('div');
loader.className='page-loader';
loader.innerHTML='<span class="loader-text">GG</span>';
document.body.prepend(loader);

var minTime=400;
var startTime=Date.now();
function hideLoader(){
  if(loader.classList.contains('hidden'))return;
  var elapsed=Date.now()-startTime;
  var delay=Math.max(0,minTime-elapsed);
  setTimeout(function(){
    loader.classList.add('hidden');
    setTimeout(function(){loader.remove();},600);
  },delay);
}
document.addEventListener('DOMContentLoaded',hideLoader);
window.addEventListener('load',hideLoader);
setTimeout(function(){hideLoader();},3000);

/* ========================================
   LANGUAGE
   ======================================== */
var lang='it';
var stored=localStorage.getItem('lang');
if(stored==='it'||stored==='en')lang=stored;
applyLang(lang);

window.toggleLang=function(){
  lang=lang==='it'?'en':'it';
  applyLang(lang);
  localStorage.setItem('lang',lang);
  var langBtn=document.querySelector('.lang-btn');
  if(langBtn)langBtn.setAttribute('aria-label',lang==='it'?'Switch to English':'Passa all\'italiano');
};

function applyLang(l){
  document.documentElement.lang=l;
  document.documentElement.setAttribute('lang',l);
  document.querySelectorAll('[data-placeholder-'+l+']').forEach(function(el){
    el.placeholder=el.getAttribute('data-placeholder-'+l);
  });
  document.querySelectorAll('[data-desc-'+l+']').forEach(function(el){
    el.textContent=el.getAttribute('data-desc-'+l);
  });
  var cvBtn=document.getElementById('cv-download');
  if(cvBtn){
    cvBtn.href=cvBtn.getAttribute('data-href-'+l);
  }
  updateGlitchTexts(l);
}

/* ========================================
   MOBILE NAV
   ======================================== */
window.toggleNav=function(){
  var nav=document.getElementById('navLinks');
  var hamburger=document.getElementById('hamburger');
  if(nav){
    nav.classList.toggle('open');
    var isOpen=nav.classList.contains('open');
    if(hamburger)hamburger.setAttribute('aria-expanded',isOpen);
  }
};
window.closeNav=function(){
  var nav=document.getElementById('navLinks');
  var hamburger=document.getElementById('hamburger');
  if(nav){
    nav.classList.remove('open');
    if(hamburger)hamburger.setAttribute('aria-expanded','false');
  }
};

document.addEventListener('click',function(e){
  var nav=document.getElementById('navLinks');
  if(nav&&nav.classList.contains('open')&&!nav.contains(e.target)&&!e.target.closest('#hamburger')){
    closeNav();
  }
});

document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){
    closeNav();
  }
});

var reducedMotion=window.matchMedia('(prefers-reduced-motion:reduce)').matches;

/* ========================================
   BACK TO TOP
   ======================================== */
var backBtn=document.getElementById('backToTop');
if(backBtn){
  window.addEventListener('scroll',function(){
    backBtn.classList.toggle('visible',window.scrollY>400);
  });
  backBtn.addEventListener('click',function(){
    window.scrollTo({top:0,behavior:reducedMotion?'auto':'smooth'});
  });
}

/* Custom cursor: set CURSOR_ENABLED to false to disable */
var CURSOR_ENABLED = true;
if(CURSOR_ENABLED && window.matchMedia('(hover:hover) and (pointer:fine)').matches){
  var cursor=document.createElement('div');
  cursor.className='cursor';
  document.body.appendChild(cursor);

  var cursorDot=document.createElement('div');
  cursorDot.className='cursor-dot';
  document.body.appendChild(cursorDot);

  var mx=0,my=0,cx=0,cy=0;

  document.addEventListener('mousemove',function(e){
    mx=e.clientX;my=e.clientY;
    cursorDot.style.left=mx+'px';
    cursorDot.style.top=my+'px';
  });

  function animateCursor(){
    cx+=(mx-cx)*0.15;
    cy+=(my-cy)*0.15;
    cursor.style.left=cx+'px';
    cursor.style.top=cy+'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  /* Hover state */
  var hoverTargets='a,button,.project-card,.related-card,.glitch,.filter-btn,.cv-btn';
  document.addEventListener('mouseover',function(e){
    if(e.target.closest(hoverTargets)){
      cursor.classList.add('hover');
    }
  });
  document.addEventListener('mouseout',function(e){
    if(!e.target.closest(hoverTargets)){
      cursor.classList.remove('hover');
    }
  });

  /* Click state */
  document.addEventListener('mousedown',function(){cursor.classList.add('click');});
  document.addEventListener('mouseup',function(){cursor.classList.remove('click');});

  /* Hide on touch */
  document.addEventListener('touchstart',function(){
    cursor.style.display='none';
    cursorDot.style.display='none';
  });
}

/* ========================================
   DIRTY REVEAL ON SCROLL
   ======================================== */
var reveals=document.querySelectorAll('.reveal');

function checkReveals(){
  var h=window.innerHeight;
  reveals.forEach(function(el){
    var top=el.getBoundingClientRect().top;
    if(top<h*0.85){
      el.classList.add('visible');
    }
  });
}

if(reveals.length){
  window.addEventListener('scroll',checkReveals,{passive:true});
  checkReveals();
}

/* ========================================
   GLITCH TEXT ON HOVER
   ======================================== */
function updateGlitchTexts(l){
  document.querySelectorAll('.glitch').forEach(function(el){
    var txt=el.getAttribute('data-text-'+l);
    if(txt){el.setAttribute('data-text',txt);}
    else if(!el.hasAttribute('data-text')){el.setAttribute('data-text',el.textContent);}
  });
}
updateGlitchTexts(lang);

/* ========================================
   SLIDESHOW
   ======================================== */
document.querySelectorAll('.project-image').forEach(function(container){
  var slides=container.querySelector('.slides');
  var prev=container.querySelector('.arrow-prev');
  var next=container.querySelector('.arrow-next');
  var counter=container.querySelector('.slide-counter');
  var slidesCount=slides?slides.querySelectorAll('.slide').length:0;
  if(!slides||slidesCount<2)return;

  if(prev)prev.onclick=null;
  if(next)next.onclick=null;

  var idx=0;

  function goTo(n){
    idx=Math.max(0,Math.min(n,slidesCount-1));
    slides.scrollTo({left:idx*slides.offsetWidth,behavior:reducedMotion?'auto':'smooth'});
    updateUI();
  }

  function updateUI(){
    if(prev)prev.classList.toggle('hidden',idx===0);
    if(next)next.classList.toggle('hidden',idx>=slidesCount-1);
    if(counter)counter.textContent=(idx+1)+' / '+slidesCount;
  }

  if(prev)prev.addEventListener('click',function(){goTo(idx-1);});
  if(next)next.addEventListener('click',function(){goTo(idx+1);});

  slides.addEventListener('scroll',function(){
    var w=slides.offsetWidth;
    var newIdx=Math.round(slides.scrollLeft/w);
    if(newIdx!==idx){idx=newIdx;updateUI();}
  },{passive:true});

  goTo(0);
});

/* ========================================
   SMOOTH SCROLL
   ======================================== */
document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener('click',function(e){
    var href=this.getAttribute('href');
    if(href==='#')return;
    var target=document.querySelector(href);
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:reducedMotion?'auto':'smooth'});
      target.setAttribute('tabindex','-1');
      target.focus({preventScroll:true});
    }
  });
});

/* ========================================
   FILTER PROJECTS
   ======================================== */
var filterBtns=document.querySelectorAll('.filter-btn');
var projectCards=document.querySelectorAll('.project-card');
filterBtns.forEach(function(btn){
  btn.addEventListener('click',function(){
    filterBtns.forEach(function(b){b.classList.remove('active');});
    this.classList.add('active');
    var cat=this.dataset.filter;
    projectCards.forEach(function(card){
      card.style.opacity='0';
      card.style.transform='scale(0.95)';
      setTimeout(function(){
        if(cat==='all'||card.dataset.category===cat){
          card.style.display='';
          setTimeout(function(){card.style.opacity='1';card.style.transform='';},20);
        }else{
          card.style.display='none';
        }
      },150);
    });
  });
});

/* ========================================
   LIGHTBOX
   ======================================== */
var lightbox=document.createElement('div');
lightbox.className='lightbox';
lightbox.innerHTML='<button class="lightbox-close" aria-label="Close">&times;</button><img src="" alt="">';
document.body.appendChild(lightbox);

var lbImg=lightbox.querySelector('img');
var lbClose=lightbox.querySelector('.lightbox-close');

document.addEventListener('click',function(e){
  var img=e.target.closest('.project-page img, .moodboard-grid img, .project-grid img, .uc-moodboard img');
  if(!img||!img.src)return;
  lbImg.src=img.src;
  lbImg.alt=img.alt;
  lightbox.classList.add('open');
});

lbClose.addEventListener('click',function(e){
  e.stopPropagation();
  lightbox.classList.remove('open');
});

lightbox.addEventListener('click',function(e){
  if(e.target===lightbox||e.target===lbImg){
    lightbox.classList.remove('open');
  }
});

document.addEventListener('keydown',function(e){
  if(e.key==='Escape'&&lightbox.classList.contains('open')){
    lightbox.classList.remove('open');
  }
});

/* ========================================
   SCANLINE TOGGLE
   ======================================== */
var scanlines=document.createElement('div');
scanlines.className='scanlines';
document.body.appendChild(scanlines);

/* ========================================
   EMAIL PROTECTION
   ======================================== */
var emailLink=document.getElementById('email-link');
if(emailLink){
  emailLink.addEventListener('click',function(e){
    e.preventDefault();
    window.location.href='mailto:'+['guglielmogandolfi99','gmail.com'].join('@');
  });
}

/* ========================================
   PAGE TRANSITIONS
   ======================================== */
var glitchOverlay=document.createElement('div');
glitchOverlay.className='page-transition';
document.body.appendChild(glitchOverlay);

document.addEventListener('click',function(e){
  var link=e.target.closest('a[href]');
  if(!link)return;
  var href=link.getAttribute('href');
  if(!href||href.startsWith('#')||href.startsWith('http')||href.startsWith('mailto')||href.startsWith('javascript'))return;
  e.preventDefault();
  glitchOverlay.classList.add('active','glitching');
  setTimeout(function(){
    glitchOverlay.classList.remove('glitching');
    window.location.href=href;
  },350);
});

window.addEventListener('pageshow',function(e){
  glitchOverlay.classList.remove('active','glitching');
});

})();
