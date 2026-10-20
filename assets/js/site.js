(function(){
  'use strict';
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine=window.matchMedia&&window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  var PREVIEW=!!window.__PREVIEW__;
  var WA='8801851216669',MAIL='shahriar98k@gmail.com';

  function $(s,r){return (r||document).querySelector(s)}
  function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}

  /* ---------- cursor ---------- */
  if(fine&&!reduce){
    document.body.classList.add('fx');
    var c1=$('#cur'),c2=$('#cur2'),mx=0,my=0,fx=0,fy=0;
    document.addEventListener('mousemove',function(e){document.body.classList.add('mv');mx=e.clientX;my=e.clientY;c1.style.left=mx+'px';c1.style.top=my+'px'});
    (function raf(){fx+=(mx-fx)*.12;fy+=(my-fy)*.12;c2.style.left=fx+'px';c2.style.top=fy+'px';requestAnimationFrame(raf)})();
    document.addEventListener('mouseover',function(e){document.body.classList.toggle('hov',!!e.target.closest('a,button,.shot,.opt,.pola'))});
  }

  /* ---------- nav ---------- */
  var nav=$('.nav');
  function onScroll(){if(nav)nav.classList.toggle('stuck',window.scrollY>20)}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  var burger=$('.burger'),drawer=$('.drawer');
  if(burger&&drawer){
    burger.addEventListener('click',function(){
      var o=drawer.classList.toggle('open');burger.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':'';
    });
    drawer.addEventListener('click',function(e){if(e.target.closest('a')){drawer.classList.remove('open');burger.setAttribute('aria-expanded',false);document.body.style.overflow=''}});
  }

  /* ---------- lightbox ---------- */
  var lb=document.createElement('div');lb.className='lb';lb.innerHTML='<img alt="">';document.body.appendChild(lb);
  lb.addEventListener('click',function(){lb.classList.remove('open')});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')lb.classList.remove('open')});

  /* ---------- counters ---------- */
  function count(el){
    var to=parseFloat(el.getAttribute('data-to')),pre=el.getAttribute('data-pre')||'',suf=el.getAttribute('data-suf')||'',dec=+(el.getAttribute('data-dec')||0);
    function fmt(v){return pre+(dec?v.toFixed(dec):Math.round(v).toLocaleString('en-US'))+suf}
    if(reduce){el.textContent=fmt(to);return}
    var t0=null;(function step(t){if(!t0)t0=t;var p=Math.min((t-t0)/1400,1),e=1-Math.pow(1-p,3);el.textContent=fmt(to*e);if(p<1)requestAnimationFrame(step)})(performance.now());
  }

  var io=('IntersectionObserver' in window)?new IntersectionObserver(function(es){
    es.forEach(function(x){
      if(!x.isIntersecting)return;
      var t=x.target;t.classList.add('in');
      $$('.cnt',t).forEach(count);if(t.classList.contains('cnt'))count(t);
      io.unobserve(t);
    });
  },{threshold:.18}):null;

  var done={};
  function initPage(root,key){
    if(key&&done[key]){reobserve(root);return}
    if(key)done[key]=1;
    reobserve(root);

    /* accordion */
    $$('.ai button',root).forEach(function(b){
      b.addEventListener('click',function(){
        var it=b.parentNode,o=it.classList.toggle('open');b.setAttribute('aria-expanded',o);
      });
    });
    /* country filter */
    $$('.fchip[data-f]',root).forEach(function(ch){
      ch.addEventListener('click',function(){
        $$('.fchip[data-f]',root).forEach(function(x){x.classList.remove('on')});ch.classList.add('on');
        var f=ch.getAttribute('data-f');
        $$('.ai',root).forEach(function(it){
          var cs=(it.getAttribute('data-c')||'').split(',');
          it.classList.toggle('hide',f!=='all'&&cs.indexOf(f)<0);
        });
      });
    });
    /* lightbox triggers */
    $$('[data-zoom]',root).forEach(function(s){
      s.addEventListener('click',function(){lb.firstChild.src=s.getAttribute('data-zoom');lb.classList.add('open')});
    });
    /* magnetic buttons */
    if(fine&&!reduce){
      $$('.btn.gold,.btn.dark',root).forEach(function(b){
        b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.18)+'px,'+((e.clientY-r.top-r.height/2)*.28)+'px)'});
        b.addEventListener('mouseleave',function(){b.style.transform=''});
      });
      var st=$('.stage',root);
      if(st){
        var cut=$('.cutout',st),chips=$$('.chip',st);
        st.addEventListener('mousemove',function(e){
          var r=st.getBoundingClientRect(),dx=(e.clientX-r.left)/r.width-.5,dy=(e.clientY-r.top)/r.height-.5;
          cut.style.marginLeft=(dx*14)+'px';cut.style.marginBottom=(-dy*8)+'px';
          chips.forEach(function(c,i){c.style.translate=(-dx*(14+i*6))+'px '+(-dy*(10+i*4))+'px'});
        });
      }
    }
    /* quick quote box (home + footer hook) */
    $$('.quick',root).forEach(function(f){
      f.addEventListener('submit',function(e){
        e.preventDefault();var v=($('input',f).value||'').trim();
        go('/contact/'+(v?('?site='+encodeURIComponent(v)):''));
      });
    });
    /* contact form */
    var form=$('#qform',root);
    if(form){
      var q=(location.search.match(/[?&]site=([^&]+)/)||[])[1];
      if(q){try{$('#site',form).value=decodeURIComponent(q)}catch(e){}}
      $$('.opt',form).forEach(function(o){o.addEventListener('click',function(){o.setAttribute('aria-pressed',o.getAttribute('aria-pressed')==='true'?'false':'true')})});
      function msg(){
        var n=$('#name',form).value.trim(),s=$('#site',form).value.trim(),m=$('#msg',form).value.trim();
        var g=$$('.opt[aria-pressed="true"]',form).map(function(x){return x.textContent});
        var t='Hi Shahriar! '+(n?"I'm "+n+'. ':'')+(s?'My website is '+s+'. ':'')+(g.length?"I'm interested in: "+g.join(', ')+'. ':'')+(m?m+' ':'')+'Could I get a free quote?';
        return t;
      }
      $('#sendwa',form).addEventListener('click',function(){window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(msg()),'_blank','noopener')});
      $('#sendmail',form).addEventListener('click',function(){window.location.href='mailto:'+MAIL+'?subject='+encodeURIComponent('Free quote request')+'&body='+encodeURIComponent(msg())});
    }
  }
  function reobserve(root){
    var els=$$('.rv,.sc,.panel,.num,.nums .cnt',root);
    if(!io){els.forEach(function(e){e.classList.add('in');$$('.cnt',e).forEach(count)});return}
    els.forEach(function(e){if(!e.classList.contains('in'))io.observe(e)});
  }

  /* ---------- navigation helper ---------- */
  function go(url){
    if(PREVIEW){var map={'/':'home','/work/':'work','/about/':'about','/contact/':'contact'};var p=url.split('?')[0];var k=map[p]||'home';
      var m=url.match(/site=([^&]+)/);if(m)window.__site=decodeURIComponent(m[1]);location.hash='#/'+k;return}
    window.location.href=url;
  }

  /* ---------- preview router (single-file preview only) ---------- */
  if(PREVIEW){
    var pages=$$('.page');
    function route(){
      var k=(location.hash.replace('#/','')||'home');if(!$('.page[data-page="'+k+'"]'))k='home';
      pages.forEach(function(p){p.hidden=p.getAttribute('data-page')!==k});
      $$('.menu a.l').forEach(function(a){a.classList.toggle('on',a.getAttribute('data-k')===k)});
      var pg=$('.page[data-page="'+k+'"]');window.scrollTo(0,0);
      initPage(pg,k);
      if(k==='contact'&&window.__site){var s=$('#site');if(s)s.value=window.__site}
      /* count-up / bars for elements already in view */
      setTimeout(function(){$$('.rv,.sc,.panel,.num',pg).forEach(function(e){var r=e.getBoundingClientRect();if(r.top<innerHeight)e.classList.add('in')})},60);
    }
    document.addEventListener('click',function(e){
      var a=e.target.closest('a[href]');if(!a)return;var h=a.getAttribute('href');
      if(h==='/'||h==='/work/'||h==='/about/'||h==='/contact/'||h.indexOf('/contact/?')===0||h.indexOf('/#')===0){
        e.preventDefault();
        if(h.indexOf('/#')===0){go('/');setTimeout(function(){var t=$(h.slice(1));if(t)t.scrollIntoView({behavior:'smooth'})},120);return}
        go(h);
      }
    });
    window.addEventListener('hashchange',route);route();
  }else{
    initPage(document,'main');
  }
  document.body.classList.add('ready');
})();
