
(function(){
  const TOUR_LS = 'faii_qb_tour_v1';
  let tourIdx = 0, tourEls = null;

  const STEPS = [
    { sel:'.step-nav',
      ar:{t:'٦ خطوات فقط', d:'تنقّل بين الخطوات من هنا. كل خطوة تسألك سؤالًا واحدًا بسيطًا، ويمكنك الرجوع في أي وقت.'},
      en:{t:'Just 6 steps', d:'Navigate the steps from here. Each step asks one simple question, and you can go back anytime.'} },
    { sel:'#typeGrid',
      ar:{t:'ابدأ بنوع المشروع', d:'اختر نوع مشروعك، وسنحمّل لك الطاقم والأسعار المقترحة تلقائيًا — يمكنك تعديلها لاحقًا.'},
      en:{t:'Start with project type', d:'Pick your project type and we auto-load a suggested crew and rates — editable later.'} },
    { sel:'.sidebar .sb-header, .mobile-quote-bar',
      ar:{t:'العرض يتكوّن أمامك', d:'السعر يتحدّث لحظيًا مع كل اختيار، فتعرف تكلفة كل عنصر قبل أن تكمل.'},
      en:{t:'Your quote builds live', d:'The price updates instantly with every choice, so you see the cost of each item as you go.'} },
    { sel:'.btn-negotiate',
      ar:{t:'السعر قابل للتفاوض', d:'لو كانت ميزانيتك مختلفة، اضغط هنا واقترح السعر الذي يناسبك وسنحاول الوصول لحل مشترك.'},
      en:{t:'The price is negotiable', d:'If your budget differs, tap here and propose your price — we will try to meet in the middle.'} },
    { sel:'#btnGenerate',
      ar:{t:'وأخيرًا: أنشئ العرض', d:'اضغط هنا للحصول على عرض سعر جاهز للطباعة أو الإرسال عبر واتساب. عملك محفوظ تلقائيًا.'},
      en:{t:'Finally: generate the offer', d:'Tap here for a printable offer or send it via WhatsApp. Your work is saved automatically.'} }
  ];

  function isAr(){ return document.documentElement.getAttribute('dir') !== 'ltr' && (window.currentLang ? window.currentLang === 'ar' : true); }

  function build(){
    const bd = document.createElement('div'); bd.className='tour-backdrop'; bd.id='tourBackdrop';
    const ring = document.createElement('div'); ring.className='tour-ring'; ring.id='tourRing';
    const card = document.createElement('div'); card.className='tour-card'; card.id='tourCard';
    document.body.append(bd, ring, card);
    bd.addEventListener('click', endTour);
    requestAnimationFrame(()=>bd.classList.add('show'));
    return {bd, ring, card};
  }

  function target(step){
    for(const sel of step.sel.split(',')){
      const el = document.querySelector(sel.trim());
      if(el && el.getBoundingClientRect().width > 0) return el;
    }
    return null;
  }

  function render(){
    const step = STEPS[tourIdx];
    const el = target(step);
    if(!el){ tourIdx++; return tourIdx < STEPS.length ? render() : endTour(); }
    el.scrollIntoView({block:'nearest', behavior:'smooth'});
    const r = el.getBoundingClientRect();
    const pad = 8;
    const {ring, card} = tourEls;
    ring.style.top = (r.top-pad)+'px';
    ring.style.left = (r.left-pad)+'px';
    ring.style.width = (r.width+pad*2)+'px';
    ring.style.height = (r.height+pad*2)+'px';

    const ar = isAr();
    const c = ar ? step.ar : step.en;
    card.innerHTML =
      '<div class="tour-step">'+(ar?'خطوة ':'STEP ')+(tourIdx+1)+' / '+STEPS.length+'</div>'+
      '<div class="tour-title">'+c.t+'</div>'+
      '<div class="tour-text">'+c.d+'</div>'+
      '<div class="tour-actions">'+
        '<button class="tour-skip" type="button" data-tour="skip">'+(ar?'تخطّي':'Skip')+'</button>'+
        '<div class="tour-dots">'+STEPS.map((_,i)=>'<i class="'+(i===tourIdx?'on':'')+'"></i>').join('')+'</div>'+
        '<button class="tour-next" type="button" data-tour="next">'+(tourIdx===STEPS.length-1?(ar?'يلا نبدأ':'Let\u2019s start'):(ar?'التالي':'Next'))+'</button>'+
      '</div>';
    card.querySelector('[data-tour=skip]').onclick = endTour;
    card.querySelector('[data-tour=next]').onclick = next;

    const cw = card.offsetWidth || 320, ch = card.offsetHeight || 190;
    let top = r.bottom + 14;
    if(top + ch > window.innerHeight - 12) top = Math.max(12, r.top - ch - 14);
    let left = r.left + r.width/2 - cw/2;
    left = Math.min(Math.max(12, left), window.innerWidth - cw - 12);
    card.style.top = top+'px';
    card.style.left = left+'px';
  }

  function next(){ tourIdx++; tourIdx >= STEPS.length ? endTour() : render(); }

  function endTour(){
    if(!tourEls) return;
    try{ localStorage.setItem(TOUR_LS,'1'); }catch(e){}
    tourEls.bd.remove(); tourEls.ring.remove(); tourEls.card.remove();
    tourEls = null;
    window.removeEventListener('resize', render);
  }

  window.startTour = function(force){
    if(tourEls) return;
    if(!force){
      try{ if(localStorage.getItem(TOUR_LS)==='1') return; }catch(e){ return; }
    }
    tourIdx = 0;
    tourEls = build();
    window.addEventListener('resize', render);
    render();
  };

  document.addEventListener('keydown', e=>{ if(e.key==='Escape') endTour(); });
  window.addEventListener('load', ()=>{ setTimeout(()=>window.startTour(false), 900); });
})();

// Mobile Hint Touch Support
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.hint').forEach(h => {
    h.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.hint.active').forEach(other => {
        if(other !== h) other.classList.remove('active');
      });
      h.classList.toggle('active');
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.hint.active').forEach(h => h.classList.remove('active'));
  });
});
