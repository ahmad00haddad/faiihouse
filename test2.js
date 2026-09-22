
// STATE
// ══════════════════════════════════════════════════════════════
const LS_KEY = 'faii_house_state';
const LS_LANG = 'faii_house_lang';

const DEFAULT_STATE = () => ({
  step:1,
  projectType:null,
  reelCount:1,
  reelRate:150,
  days:1,
  crew:{},
  equipMode:'tier',
  equipment:null,
  equipItems:{},
  post:{},
  region:null,
  customTravel:0,
  customEquip:0,
  clientName:'', clientCompany:'', projectTitle:'',
  quoteDate:new Date().toISOString().split('T')[0],
  preparedBy:'Ahmad Haddad',
  deliveryDays:'14',
  projectNotes:'',
  currency:'JOD',
  paymentTerms:'50_50',
});

function saveState() {
  try { localStorage.setItem(LS_KEY, JSON.stringify({state, lang:currentLang})); } catch(e){}
}

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if(!raw) return false;
    const saved = JSON.parse(raw);
    if(saved.state) { state = Object.assign(DEFAULT_STATE(), saved.state); }
    if(saved.lang) { currentLang = saved.lang; }
    // Hide reels temporarily: reset if it was the last selected type
    if(state.projectType === 'reels') state.projectType = null;
    return true;
  } catch(e){ return false; }
}

let currentLang = 'ar';
let state = DEFAULT_STATE();
loadState();


// ══════════════════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════════════════
const PROJECT_TYPES = [
  {id:'reels',   icon:'📱',name:'Instagram Reels',   ar:'ريلز انستغرام',    range:`100–250 ${state.currency||"JOD"}`, crew:['cinematographer'],  pack:true,  reelBased:true,
   defaultEquip:'basic', defaultPost:['editing']},
  {id:'interview',icon:'🎙',name:'Interview / Podcast',ar:'مقابلة / بودكاست',range:`300–800 ${state.currency||"JOD"}`,   crew:['cinematographer','sound'],
   defaultEquip:'standard', defaultPost:['editing','graphics']},
  {id:'corporate',icon:'🏢',name:'Corporate Video',   ar:'فيديو مؤسسي',      range:`600–2,000 ${state.currency||"JOD"}`, crew:['director','cinematographer','sound','cam_assistant','driver']},
  {id:'commercial',icon:'📺',name:'Commercial / TVC', ar:'إعلان تجاري',      range:`800–4,000 ${state.currency||"JOD"}`, crew:['director','cinematographer','producer','gaffer','sound','cam_assistant','driver']},
  {id:'documentary',icon:'🎥',name:'Documentary',     ar:'فيلم وثائقي',       range:`600–3,000 ${state.currency||"JOD"}`, crew:['director','cinematographer','sound','driver']},
  {id:'shortfilm',icon:'🎞',name:'Short Film',        ar:'فيلم قصير',          range:`800–3,800 ${state.currency||"JOD"}`, crew:['director','cinematographer','producer','cam_assistant','gaffer','sound','driver']},
  {id:'event',   icon:'🎤',name:'Event Coverage',     ar:'تغطية فعالية',       range:`300–1,500 ${state.currency||"JOD"}`, crew:['cinematographer','sound']},
  {id:'photovideo',icon:'📷',name:'Photo + Video',    ar:'صور + فيديو',        range:`500–2,500 ${state.currency||"JOD"}`, crew:['cinematographer','photographer','sound','driver']},
  
  // NEW PROJECT TEMPLATES
  {id:'realestate', icon:'🏢', name:'Real Estate Tour', ar:'تصوير عقاري ومعماري', range:`400–1,500 ${state.currency||"JOD"}`, crew:['cinematographer','photographer'], defaultEquip:'standard', defaultPost:['editing','colorgrade']},
];

const ROLES = [
  {id:'director',       name:'Director',                ar:'مخرج',                rate:200, hint:'Vision of the project. Directs performance to ensure the best outcome.', hintAr:'رؤية المشروع. يدير الأداء الفني ويوجه الممثلين والطاقم لضمان خروج الفيديو بأفضل شكل.'},
  {id:'cinematographer',name:'Cinematographer / DOP',   ar:'مصور سينمائي',        rate:200, hint:'The visual creator. Responsible for camera movement, angles, and the cinematic touch.', hintAr:'صانع الصورة. مسؤول عن حركة الكاميرا، زوايا التصوير، واللمسة السينمائية.'},
  {id:'producer',       name:'Producer',                ar:'منتج',                rate:150, hint:'The Maestro. Manages budget, schedule, and logistics to ensure smooth execution.', hintAr:'المايسترو. يدير ميزانية المشروع، المواعيد، وتنسيق كافة التفاصيل اللوجستية لضمان سير العمل.'},
  {id:'cam_assistant',  name:'Camera Assistant / AC',   ar:'مساعد كاميرا',        rate:100, hint:'Essential for shooting speed. Pulls focus and preps lenses.', hintAr:'الداعم الأساسي لسرعة التصوير. يتأكد من وضوح الفوكس (التركيز) وتجهيز العدسات.'},
  {id:'gaffer',         name:'Gaffer',                  ar:'مضيء',                rate:150, hint:'Master of shadows and light. Adds depth and mood to avoid flat images.', hintAr:'مهندس الظلال والضوء. يضيف العمق والمزاج للقطات لتجنب الصورة المسطحة أو الباهتة.'},
  {id:'sound',          name:'Sound / Boom Operator',   ar:'مشغل صوت',            rate:100, hint:'50% of video quality is sound. Ensures crisp dialogue and noise isolation.', hintAr:'لأن 50% من جودة الفيديو هي الصوت. يضمن نقاء الحوار وعزل الضوضاء.'},
  {id:'photographer',   name:'Photographer',            ar:'مصور فوتوغرافي',      rate:200, hint:'Captures high-res moments for campaigns and social media.', hintAr:'لتوثيق اللحظات بصور عالية الدقة لاستخدامها في الحملات الإعلانية والسوشيال ميديا.'},
  {id:'driver',         name:'Driver / Transportation', ar:'سائق',               rate:50,  hint:'Safe and fast transport for crew and equipment between locations.', hintAr:'نقل آمن وسريع للطاقم والمعدات بين مواقع التصوير لتوفير الوقت والجهد.'},
  {id:'art_director',   name:'Art Director',            ar:'مدير فني',            rate:100, hint:'Aesthetics engineer. Responsible for set design, colors, and props.', hintAr:'مهندس الجماليات. مسؤول عن الديكور، الألوان، الأزياء، وشكل المكان أمام الكاميرا.'},
  {id:'voiceover_talent',name:'Voice Over Artist',      ar:'مؤدي صوتي',          rate:75,  hint:'Professional voice telling your brand\'s story with an impactful tone.', hintAr:'صوت احترافي يروي قصة علامتك التجارية ويوصل رسالتك بنبرة مؤثرة.'},
  {id:'preprod',        name:'Pre-Production',          ar:'ما قبل الإنتاج',      rate:100, hint:'Planning phase: scripting, storyboarding, and scheduling to avoid surprises.', hintAr:'مرحلة التخطيط المسبق، تشمل كتابة السيناريو، الستوري بورد، وجدولة التصوير لتجنب المفاجآت.'},
  {id:'location_scout', name:'Location Scouting',       ar:'اختيار موقع',        rate:150, hint:'Finding the best locations for the story and securing permits.', hintAr:'البحث عن أفضل الأماكن التي تناسب قصة الفيديو واستخراج التصاريح اللازمة.'},
  {id:'casting',        name:'Casting',                 ar:'اختيار ممثلين',      rate:200, hint:'Auditioning and selecting the best faces to represent your brand.', hintAr:'البحث واختبار الأداء لاختيار أفضل الوجوه التي تمثل علامتك التجارية.'},
  {id:'actor',          name:'Actor/Actress',           ar:'ممثل/ممثلة',         rate:50,  hint:'The faces that will deliver the message and interact with the product.', hintAr:'الوجوه التي ستنقل رسالة الفيديو وتتفاعل مع المنتج أو الخدمة.'},
];

const EQUIPMENT_TIERS = [
  {id:'basic',   tier:'Basic',    tierAr:'أساسي',    name:'Standard Setup',    nameAr:'إعداد قياسي',     items:'Sony FX3/A7SIII · 2 Lenses · LED Panel · Wireless Audio',              itemsAr:'سوني FX3/A7SIII · عدستان · إضاءة LED · صوت لاسلكي',                   price:100},
  {id:'standard',tier:'Standard', tierAr:'قياسي',    name:'Full Camera Kit',   nameAr:'طقم كاميرا كامل', items:'Sony FX3 + A7SIII · 3–4 Lenses · LED + HMI · Sound Mixer · Stabilizer', itemsAr:'FX3 + A7SIII · 4 عدسات · LED + HMI · ميكسر صوت · ستابلايزر',         price:200},
  {id:'pro',     tier:'Pro',      tierAr:'احترافي',  name:'Cinema Package',    nameAr:'باقة سينمائية',   items:'Cinema Camera · Full Lens Set · Full Lighting · Multi-Cam · Drone',      itemsAr:'كاميرا سينمائية · طقم عدسات · إضاءة كاملة · متعدد الكاميرات · درون',  price:350},
  {id:'red',     tier:'Premium',  tierAr:'بريميوم',  name:'RED / ALEXA Kit',   nameAr:'طقم RED / ALEXA', items:'RED Camera ×2 · Cinema Lenses · Studio Lighting · Full Sound Dept.',      itemsAr:'كاميرا RED ×2 · عدسات سينمائية · إضاءة استوديو · قسم صوت كامل',       price:550},
];

// Individual Equipment Items from Ahmad's Inventory
const EQUIPMENT_ITEMS = [
  // Cameras
  {id:'bmpcc6k',    cat:'cameras',  catAr:'كاميرات',       catIcon:'📷', name:'Blackmagic Pocket 6K Pro',         ar:'بلاك ماجيك 6K برو',         rate:70},
  {id:'sony_fx3',   cat:'cameras',  catAr:'كاميرات',       catIcon:'📷', name:'Sony FX3 Cinema Camera',           ar:'سوني FX3 سينمائية',          rate:60},
  {id:'sony_a7siii',cat:'cameras',  catAr:'كاميرات',       catIcon:'📷', name:'Sony A7S III',                     ar:'سوني A7S III',               rate:50},
  // Lenses
  {id:'sigma_24',   cat:'lenses',   catAr:'عدسات',         catIcon:'🔭', name:'Sigma 24mm f/1.4 Art DG DN',       ar:'سيغما 24mm f/1.4 آرت',       rate:20},
  {id:'sigma_35',   cat:'lenses',   catAr:'عدسات',         catIcon:'🔭', name:'Sigma 35mm f/1.4 Art DG DN',       ar:'سيغما 35mm f/1.4 آرت',       rate:20},
  {id:'sigma_85',   cat:'lenses',   catAr:'عدسات',         catIcon:'🔭', name:'Sigma 85mm f/1.4 Art DG DN',       ar:'سيغما 85mm f/1.4 آرت',       rate:20},
  {id:'sony_2470',  cat:'lenses',   catAr:'عدسات',         catIcon:'🔭', name:'Sony FE 24–70mm GM',               ar:'سوني 24-70mm GM',            rate:25},
  // Audio
  {id:'zoom_h6',    cat:'audio',    catAr:'معدات الصوت',   catIcon:'🎤', name:'Zoom H6 Audio Recorder',           ar:'مسجل زوم H6',                rate:15},
  {id:'rode_wgo2',  cat:'audio',    catAr:'معدات الصوت',   catIcon:'🎤', name:'Rode Wireless GO II (×2)',          ar:'رود وايرلس جو II',           rate:15},
  {id:'sennheiser', cat:'audio',    catAr:'معدات الصوت',   catIcon:'🎤', name:'Sennheiser EW Wireless System',    ar:'زينهايزر EW لاسلكي',         rate:20},
  {id:'boom_mic',   cat:'audio',    catAr:'معدات الصوت',   catIcon:'🎤', name:'Boom Mic + Blimp + Stand',         ar:'مايك بوم + حماية + حامل',   rate:10},
  // Lighting
  {id:'aputure200d',cat:'lighting', catAr:'إضاءة',         catIcon:'💡', name:'Aputure 200D LED Light',           ar:'أبيتشر 200D LED',            rate:30},
  {id:'godox_led',  cat:'lighting', catAr:'إضاءة',         catIcon:'💡', name:'Godox SL-60 / LED Panel',          ar:'جودوكس SL-60 / إضاءة LED',  rate:15},
  {id:'softbox',    cat:'lighting', catAr:'إضاءة',         catIcon:'💡', name:'Godox Softbox + Light Stand',      ar:'سوفت بوكس جودوكس + حامل',   rate:10},
  {id:'ring_light', cat:'lighting', catAr:'إضاءة',         catIcon:'💡', name:'Ring Light 18"',                   ar:'ضوء حلقي 18 بوصة',           rate:10},
  // Stabilization
  {id:'dji_rs3',    cat:'stabilization', catAr:'تثبيت',   catIcon:'🎯', name:'DJI RS3 Pro Gimbal',               ar:'DJI RS3 برو جيمبال',         rate:25},
  {id:'tripod',     cat:'stabilization', catAr:'تثبيت',   catIcon:'🎯', name:'Fluid Head Tripod',               ar:'تراipود رأس سائل احترافي',   rate:10},
  {id:'follow_focus',cat:'stabilization',catAr:'تثبيت',   catIcon:'🎯', name:'Follow Focus System',              ar:'فولو فوكس',                  rate:10},
  // Monitors & Recording
  {id:'atomos',     cat:'monitors', catAr:'شاشات وتسجيل', catIcon:'🖥', name:'Atomos Ninja 5" Monitor/Recorder', ar:'أتوموس نينجا 5 بوصة',        rate:20},
  {id:'field_mon',  cat:'monitors', catAr:'شاشات وتسجيل', catIcon:'🖥', name:'5" Field Monitor',                 ar:'شاشة ميدانية 5 بوصة',        rate:10},
  // Storage & Power
  {id:'cards',      cat:'storage',  catAr:'تخزين وطاقة',  catIcon:'💾', name:'Memory Cards Set (CFexpress + SD)',ar:'بطاقات ذاكرة CFexpress + SD', rate:5},
  {id:'ssd',        cat:'storage',  catAr:'تخزين وطاقة',  catIcon:'💾', name:'External SSD 2TB',                 ar:'SSD خارجي 2 تيرابايت',       rate:5},
  {id:'vmount',     cat:'storage',  catAr:'تخزين وطاقة',  catIcon:'💾', name:'V-Mount Battery Kit (×2 + charger)',ar:'بطاريات V-Mount ×2 + شاحن', rate:10},
  {id:'lpe6',       cat:'storage',  catAr:'تخزين وطاقة',  catIcon:'💾', name:'LP-E6 Battery Kit (×4 + dual charger)',ar:'بطاريات LP-E6 ×4 + شاحن',rate:5},
  // Drone
  {id:'drone',      cat:'drones',   catAr:'طائرات مسيّرة',catIcon:'🚁', name:'DJI Mini 4 Pro / Air 3',           ar:'طائرة مسيّرة DJI',          rate:80},
  // Accessories
  {id:'cage',       cat:'accessories',catAr:'إكسسوارات',  catIcon:'🔧', name:'SmallRig Camera Cage + Rig',       ar:'كيج وريج سمول ريج',          rate:10},
  {id:'nd_filter',  cat:'accessories',catAr:'إكسسوارات',  catIcon:'🔧', name:'Variable ND Filter Set',           ar:'فلترات ND متغيرة',           rate:8},
  {id:'magic_arm',  cat:'accessories',catAr:'إكسسوارات',  catIcon:'🔧', name:'Magic Arms + Clamps Set',          ar:'ذراع مرن + كلامبات',         rate:5},
  {id:'hdmi_cables',cat:'accessories',catAr:'إكسسوارات',  catIcon:'🔧', name:'HDMI Cables Set',                  ar:'مجموعة كابلات HDMI',         rate:5},
  {id:'headphones', cat:'accessories',catAr:'إكسسوارات',  catIcon:'🔧', name:'Studio Headphones',                ar:'سماعات استوديو',             rate:5},
];

const POST_OPTIONS = [
  {id:'editing',     name:'Video Editing',             ar:'مونتاج فيديو',                  desc:'Cut, sync, music, color correction',  descAr:'قص، مزامنة، موسيقى، تصحيح لون',   basePrice:150, reelPrice:50},
  {id:'colorgrade',  name:'Color Grading (DaVinci Resolve)',   ar:'تلوين سينمائي (DaVinci Resolve)',        desc:'Full cinematic grade — DaVinci Resolve',descAr:'تصحيح سينمائي كامل — DaVinci Resolve',   basePrice:150,  reelPrice:50},
  {id:'voiceover',   name:'Voice Over',                ar:'تعليق صوتي',                    desc:'Arabic/English VO recording',         descAr:'تسجيل تعليق صوتي عربي/إنجليزي',   basePrice:100,  fixed:true},
  {id:'graphics',    name:'Motion Graphics / Titles',  ar:'موشن جرافيك',                   desc:'Animated titles, lower thirds, end cards', descAr:'عناوين متحركة وتأثيرات', basePrice:80,  fixed:true},
  {id:'sound_design',name:'Sound Design & Mix',        ar:'تصميم صوتي ومكس',               desc:'Full audio mix, SFX, music licensing', descAr:'مكس صوتي كامل ومؤثرات',          basePrice:150, fixed:true},
  {id:'screenplay',  name:'Screenplay / Script',       ar:'كتابة سيناريو',                  desc:`External scriptwriter — 50–100 ${state.currency||"JOD"} depending on project`, descAr:`كاتب خارجي متعاون — 50 إلى 100 ${state.currency||"JOD"} حسب المشروع`, basePrice:75, fixed:true, scriptNote:true},
];

const REGIONS = [
  {id:'irbid',  icon:'🏠', name:'Irbid (Home)',     ar:'إربد (القاعدة)', cities:'Irbid · Ajloun · Jerash · Mafraq',  citiesAr:'إربد · عجلون · جرش · المفرق',          fee:0},
  {id:'amman',  icon:'🏙', name:'Amman / Central', ar:'عمّان / الوسط',  cities:'Amman · Zarqa · Balqa · Madaba',     citiesAr:'عمّان · الزرقاء · البلقاء · مادبا',    fee:25},
  {id:'south',  icon:'🏔', name:'South Jordan',    ar:'جنوب الأردن',   cities:'Karak · Tafila · Ma\'an · Aqaba',   citiesAr:'الكرك · الطفيلة · معان · العقبة',       fee:80},
  {id:'petra',  icon:'⛩', name:'Petra / Wadi Rum',ar:'البتراء / وادي رم',cities:'Petra · Wadi Rum · Wadi Musa',   citiesAr:'البتراء · وادي رم · وادي موسى',          fee:120},
  {id:'other',  icon:'✈️', name:'Outside Jordan',  ar:'خارج الأردن',   cities:'International / Special Location',   citiesAr:'دولي / موقع خاص',                       fee:null},
];

// Equipment categories order
const EQUIP_CATS = ['cameras','lenses','audio','lighting','stabilization','monitors','storage','drones','accessories'];

// ══════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════
// OWNER MODE — hidden feature, triggered by 5× logo clicks
// ══════════════════════════════════════════════════════════════
let isOwnerMode = false;
let logoClickCount = 0;
let logoClickTimer = null;
const OWNER_PIN = '0000'; // PIN to confirm owner mode
const OWNER_LS  = 'faii_owner_mode';

function applyOwnerMode(active) {
  isOwnerMode = active;
  if(active) document.body.classList.add('owner-mode');
  else document.body.classList.remove('owner-mode');
  
  const crewSection = document.querySelector('#sec-3');
  if(crewSection) {
    if(active) crewSection.classList.add('owner-mode');
    else crewSection.classList.remove('owner-mode');
  }
  const badge = document.getElementById('ownerBadge');
  if(badge) {
    if(active) badge.classList.add('show');
    else badge.classList.remove('show');
  }
  try { if(active) localStorage.setItem(OWNER_LS,'1'); else localStorage.removeItem(OWNER_LS); } catch(e){}
}

function handleLogoClick() {
  logoClickCount++;
  clearTimeout(logoClickTimer);
  logoClickTimer = setTimeout(()=>{ logoClickCount=0; }, 2000);
  if(logoClickCount >= 5) {
    logoClickCount = 0;
    clearTimeout(logoClickTimer);
    if(isOwnerMode) { exitOwnerMode(); return; }
    openOwnerPinModal();
  }
}

function openOwnerPinModal() {
  const existing = document.getElementById('ownerPinModal');
  if(existing) existing.remove();
  const modal = document.createElement('div');
  modal.id = 'ownerPinModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:4000;display:flex;align-items:center;justify-content:center;padding:20px;';
  modal.innerHTML = `
    <div style="background:var(--dark2);border:1px solid var(--border2);max-width:340px;width:100%;">
      <div style="background:var(--dark);padding:20px 22px;border-bottom:1px solid var(--border);text-align:center;">
        <div style="font-size:28px;margin-bottom:8px;">🔐</div>
        <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;color:var(--text);">Owner Access</div>
        <div style="font-size:11px;color:var(--text3);margin-top:4px;letter-spacing:0.5px;">Enter PIN to unlock editing</div>
      </div>
      <div style="padding:22px;">
        <div style="display:flex;gap:8px;justify-content:center;margin-bottom:18px;" id="pinDots">
          <div style="width:14px;height:14px;border-radius:50%;border:2px solid var(--border2);background:transparent;" id="dot0"></div>
          <div style="width:14px;height:14px;border-radius:50%;border:2px solid var(--border2);background:transparent;" id="dot1"></div>
          <div style="width:14px;height:14px;border-radius:50%;border:2px solid var(--border2);background:transparent;" id="dot2"></div>
          <div style="width:14px;height:14px;border-radius:50%;border:2px solid var(--border2);background:transparent;" id="dot3"></div>
        </div>
        <div id="pinError" style="text-align:center;font-size:11px;color:var(--red);min-height:16px;margin-bottom:10px;"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
          ${[1,2,3,4,5,6,7,8,9,'','0','⌫'].map(k=>`
            <button onclick="pinKey('${k}')"
              style="padding:14px 0;font-size:${k==='⌫'?'18':'16'}px;font-weight:600;cursor:pointer;
              background:var(--dark3);border:1px solid var(--border);color:var(--text);
              transition:var(--t);"
              onmouseover="this.style.borderColor='var(--gold)';this.style.color='var(--gold)'"
              onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text)'"
              ${k===''?'style="visibility:hidden;background:transparent;border:none;" disabled':''}
            >${k}</button>`).join('')}
        </div>
      </div>
      <div style="border-top:1px solid var(--border);padding:14px 22px;">
        <button onclick="document.getElementById('ownerPinModal').remove();pinBuffer='';"
          style="width:100%;padding:11px;font-size:12px;font-weight:600;cursor:pointer;
          background:transparent;border:1px solid var(--border2);color:var(--text3);letter-spacing:0.5px;text-transform:uppercase;">
          Cancel
        </button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', e=>{ if(e.target===modal){ modal.remove(); pinBuffer=''; }});
  modal.addEventListener('keydown', e=>{ if(e.key==='Escape'){ modal.remove(); pinBuffer=''; }});
}

let pinBuffer = '';
function pinKey(k) {
  if(k==='') return;
  if(k==='⌫') {
    pinBuffer = pinBuffer.slice(0,-1);
  } else if(pinBuffer.length < 4) {
    pinBuffer += k;
  }
  // Update dots
  for(let i=0;i<4;i++){
    const dot = document.getElementById('dot'+i);
    if(dot) dot.style.background = i < pinBuffer.length ? 'var(--gold)' : 'transparent';
  }
  if(pinBuffer.length === 4) {
    if(pinBuffer === OWNER_PIN) {
      document.getElementById('ownerPinModal')?.remove();
      pinBuffer = '';
      applyOwnerMode(true);
    } else {
      const err = document.getElementById('pinError');
      if(err) err.textContent = 'Incorrect PIN. Try again.';
      // Shake dots
      const dots = document.getElementById('pinDots');
      if(dots){ dots.style.animation='shake 0.4s'; setTimeout(()=>{ dots.style.animation=''; },400); }
      pinBuffer = '';
      for(let i=0;i<4;i++){
        const dot = document.getElementById('dot'+i);
        if(dot) dot.style.background='transparent';
      }
    }
  } else {
    const err = document.getElementById('pinError');
    if(err) err.textContent = '';
  }
}

function exitOwnerMode() {
  applyOwnerMode(false);
}


function toggleLang() {
  currentLang = currentLang === 'ar' ? 'en' : 'ar';
  const root = document.getElementById('htmlRoot');
  root.lang = currentLang;
  root.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  document.getElementById('langToggle').textContent = currentLang === 'ar' ? 'EN' : 'عربي';
  document.getElementById('btnReset').textContent = currentLang === 'ar' ? 'إعادة تعيين' : 'Reset';
  document.getElementById('btnGenerate').textContent = currentLang === 'ar' ? 'إنشاء العرض ✦' : 'Generate Offer ✦';
  renderTypeGrid();
  renderCrewTable();
  renderEquipGrid();
  renderPostOptions();
  renderRegionGrid();
  updateReelBreakdown();
  updateQuote();
  saveState();
}

function L(ar, en) { return currentLang === 'ar' ? ar : en; }

// ══════════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  const hadSaved = loadState();

  // Apply language
  const root = document.getElementById('htmlRoot');
  root.lang = currentLang;
  root.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  document.getElementById('langToggle').textContent = currentLang === 'ar' ? 'EN' : 'عربي';
  document.getElementById('btnReset').textContent = currentLang === 'ar' ? 'إعادة تعيين' : 'Reset';
  document.getElementById('btnGenerate').textContent = currentLang === 'ar' ? 'إنشاء العرض ✦' : 'Generate Offer ✦';

  // Restore form fields
  const el = (id) => document.getElementById(id);
  if(el('quoteDate')) el('quoteDate').value = state.quoteDate;
  if(el('preparedBy')) el('preparedBy').value = state.preparedBy;
  if(el('deliveryDays')) el('deliveryDays').value = state.deliveryDays;
  if(el('clientName')) el('clientName').value = state.clientName;
  if(el('clientCompany')) el('clientCompany').value = state.clientCompany;
  if(el('projectTitle')) el('projectTitle').value = state.projectTitle;
  if(el('projectNotes')) el('projectNotes').value = state.projectNotes;
  if(el('customEquip')) el('customEquip').value = state.customEquip || '';
  if(el('customTravel')) el('customTravel').value = state.customTravel || '';
  if(el('reelCount')) el('reelCount').textContent = state.reelCount;
  if(el('daysDisplay')) el('daysDisplay').textContent = state.days;
  if(el('reelWrap')) el('reelWrap').style.display = state.projectType==='reels'?'block':'none';

  renderTypeGrid();
  renderEquipGrid();
  renderPostOptions();
  renderRegionGrid();
  renderCrewTable();
  if(state.projectType==='reels') updateReelBreakdown();
  updateQuote();
  if(hadSaved && state.step) goStep(state.step);

  // Restore owner mode
  try { if(localStorage.getItem(OWNER_LS)==='1') applyOwnerMode(true); } catch(e){}

  // Auto-save on any input change
  document.addEventListener('change', saveState);
  document.addEventListener('click', saveState);
});

// ══════════════════════════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════════════════════════
function goStep(n) {
  if(navigator.vibrate) navigator.vibrate(30);
  playTick();
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.step-tab').forEach((t,i)=>{
    t.classList.remove('active','done');
    if(i+1<n) t.classList.add('done');
    if(i+1===n) {
      t.classList.add('active');
      t.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  });
  document.getElementById('sec-'+n).classList.add('active');
  state.step = n;

  const pb = document.getElementById('topProgressBar');
  if(pb) pb.style.width = ((n/6)*100) + '%';
  
  const mobBtn = document.querySelector('.mobile-quote-bar .mq-btn');
  if(mobBtn) {
    if(n < 6) {
      mobBtn.innerHTML = '<span class="ar-only">التالي ←</span><span class="en-only">Next →</span>';
      mobBtn.onclick = () => goStep(n + 1);
    } else {
      mobBtn.innerHTML = '<span class="ar-only">إنشاء العرض ✦</span><span class="en-only">Generate ✦</span>';
      mobBtn.onclick = showPreview;
    }
  }

  document.getElementById('rushNote').style.display = state.deliveryDays==='rush'?'block':'none';
  const mainEl = document.querySelector('.main');
  if(mainEl) mainEl.scrollTop = 0;
  window.scrollTo({top:0, behavior:'smooth'});
  saveState();
}

// ══════════════════════════════════════════════════════════════
// STEP 1: PROJECT TYPE & REELS
// ══════════════════════════════════════════════════════════════
function renderTypeGrid() {
  const grid = document.getElementById('typeGrid');
  grid.innerHTML = PROJECT_TYPES.filter(t => t.id !== 'reels').map(t=>`
    <div class="type-card grain-card ${state.projectType===t.id?'sel':''}" onclick="selectType('${t.id}')">
      <span class="type-icon">${t.icon}</span>
      <div class="type-name">${L(t.ar, t.name)}</div>
    </div>`).join('');
}

function selectType(id) {
  state.projectType = id;
  const type = PROJECT_TYPES.find(t=>t.id===id);

  // Set default crew — for reels: only cinematographer; for interview: 2 cinematographers + sound
  ROLES.forEach(r=>{
    let enabled = false;
    let qty = 1;
    if(id==='reels') {
      enabled = r.id==='cinematographer';
    } else if(id==='interview') {
      if(r.id==='cinematographer') { enabled=true; qty=2; }
      else if(r.id==='sound') { enabled=true; }
    } else {
      enabled = type.crew.includes(r.id);
    }
    state.crew[r.id] = {enabled, rate:r.rate, qty};
  });

  // Set default equipment
  if(id==='reels') {
    state.equipment = 'basic'; // basic = مشمول (cost=0 for reels)
    state.equipMode = 'tier';
    state.reelsEquipFree = true;
  } else if(id==='interview') {
    state.equipment = 'standard';
    state.equipMode = 'tier';
    state.reelsEquipFree = false;
  } else {
    state.reelsEquipFree = false;
  }

  // Set default post-production
  state.post = {};
  if(id==='reels') {
    state.post['editing'] = true; // included in price (cost=0 for reels)
    state.reelsEditingFree = true;
  } else if(id==='interview') {
    state.post['editing'] = true;
    state.post['graphics'] = true;
    state.reelsEditingFree = false;
  } else {
    state.reelsEditingFree = false;
  }

  const isReels = id==='reels';
  document.getElementById('reelWrap').style.display = isReels?'block':'none';
  renderTypeGrid();
  renderCrewTable();
  renderEquipGrid();
  renderPostOptions();
  updateReelBreakdown();
  updateQuote();
  saveState();
}

function changeReels(d) {
  state.reelCount = Math.max(1, Math.min(20, state.reelCount+d));
  document.getElementById('reelCount').textContent = state.reelCount;
  updateReelBreakdown();
  updateQuote();
  saveState();
}

function updateReelRate() {
  // Rate is now auto-calculated based on count and region
  updateReelBreakdown();
}

function getReelPackInfo() {
  const count = state.reelCount;
  const region = state.region;
  const isAmman = region==='amman' || region==='south' || region==='petra';
  // Pricing rules:
  // 1 reel: Irbid=150, Amman up to 250 (use 200 as base)
  // 3 reels pack: Irbid=135/reel, Amman=150/reel
  // 5 reels pack: Irbid=100/reel, Amman=135/reel
  let ratePerReel, packLabel, isSaving=false;
  if(count>=5) {
    ratePerReel = isAmman ? 135 : 100;
    packLabel = L(`باقة 5 ريلز (${ratePerReel} ${state.currency||"JOD"}/ريل)`, `5-Reel Pack (${ratePerReel} ${state.currency||"JOD"}/reel)`);
    isSaving = true;
  } else if(count>=3) {
    ratePerReel = isAmman ? 150 : 135;
    packLabel = L(`باقة 3 ريلز (${ratePerReel} ${state.currency||"JOD"}/ريل)`, `3-Reel Pack (${ratePerReel} ${state.currency||"JOD"}/reel)`);
    isSaving = true;
  } else {
    ratePerReel = isAmman ? 200 : 150; // single reel
    packLabel = null;
  }
  return {ratePerReel, packLabel, isSaving, count, isAmman};
}

function updateReelBreakdown() {
  if(state.projectType!=='reels') return;
  const info = getReelPackInfo();
  const {count, isSaving, isAmman} = info;
  const total = count * info.ratePerReel;
  const breakdown = document.getElementById('reelBreakdown');
  const packNotice = document.getElementById('packNotice');
  const packText = document.getElementById('packText');

  // Sync reelRate with calculated rate
  state.reelRate = info.ratePerReel;
  const reelRateInput = document.getElementById('reelRate');
  if(reelRateInput) reelRateInput.value = info.ratePerReel;

  const single1 = isAmman ? 200 : 150;
  const pack3 = isAmman ? 150 : 135;
  const pack5 = isAmman ? 135 : 100;

  if(breakdown) {
    breakdown.innerHTML = `
      <div class="reel-tier grain-card ${count===1?'active-tier':''}">
        <div class="rt-label">${L('ريل واحد','1 Reel')}</div>
        <div class="rt-price">${single1} ${state.currency||"JOD"}</div>
        <div class="rt-save">${L('السعر الأساسي','Base Price')}</div>
      </div>
      <div class="reel-tier grain-card ${count>=3&&count<5?'active-tier':''}">
        <div class="rt-label">${L('باقة 3 ريلز','3-Reel Pack')}</div>
        <div class="rt-price">${pack3} ${state.currency||"JOD"}</div>
        <div class="rt-save" style="color:var(--gold)">${L('توفير','Save`)} ${single1-pack3} ${state.currency||"JOD"}/${L(`ريل','reel')}</div>
      </div>
      <div class="reel-tier grain-card ${count>=5?'active-tier':''}">
        <div class="rt-label">${L('باقة 5 ريلز','5-Reel Pack')}</div>
        <div class="rt-price">${pack5} ${state.currency||"JOD"}</div>
        <div class="rt-save" style="color:var(--gold)">${L('أفضل قيمة!','Best Value!`)} −${single1-pack5} ${state.currency||"JOD"}/${L(`ريل','reel')}</div>
      </div>
      <div class="reel-tier" style="border:1px solid var(--gold);background:var(--gold-dim)">
        <div class="rt-label">${count} ${L('ريل × ','reels × ')}${info.ratePerReel} ${state.currency||"JOD"}</div>
        <div class="rt-price">${total} ${state.currency||"JOD"}</div>
        <div class="rt-save" style="color:var(--text3)">${L('المجموع الحالي','Current Total')}</div>
      </div>`;
  }
  if(isSaving && packNotice && packText) {
    packNotice.classList.add('show');
    const saving = (single1 - info.ratePerReel) * count;
    packText.textContent = L(
      `باقة محتوى! توفير ${saving} ${state.currency||"JOD"} على ${count} ريلز في جلسة واحدة`,
      `Content Pack! Saving ${saving} ${state.currency||"JOD"} on ${count} reels in one session`
    );
  } else if(packNotice) {
    packNotice.classList.remove('show');
  }
  updateQuote();
}

// ══════════════════════════════════════════════════════════════
// STEP 3: CREW
// ══════════════════════════════════════════════════════════════
function renderCrewTable() {
  const tbody = document.getElementById('crewBody');
  let rows = '';
  ROLES.forEach(r=>{
    if(r.id==='editor') return;
    const s = state.crew[r.id] || {enabled:false, rate:r.rate, qty:1};
    const total = s.enabled ? (s.rate*s.qty*state.days) : 0;
    let depWarn = '';
    if(r.id === 'cam_assistant' && (!state.crew['cinematographer'] || !state.crew['cinematographer'].enabled)) {
      depWarn = `<span class="dep-warn" title="${L('نوصي باختيار مصور سينمائي أولاً','DOP recommended first')}">⚠️</span>`;
    }
    rows += `<tr>
      <td onclick="document.getElementById('cb-' + '${r.id}').click()" style="cursor:pointer; text-align:center;">
        <input type="checkbox" id="cb-${r.id}" ${s.enabled?'checked':''} onchange="toggleRole('${r.id}',this.checked)" onclick="event.stopPropagation()">
      </td>
      <td class="role-info-td" style="position:relative; cursor:pointer;" onclick="document.getElementById('cb-' + '${r.id}').click()">
        <div class="role-name">${depWarn}${r.name}</div>
        <div class="role-name-ar">${depWarn}${r.ar}</div>
        ${r.hint ? `<div class="hint-tooltip" style="bottom: 80%; right: 0; transform: translateY(5px); z-index: 1000;">${L(r.hintAr, r.hint)}</div>` : ''}
      </td>
      <td>
        <span class="rate-display">${s.rate}</span>
        <div class="rate-input-wrap" onclick="event.stopPropagation()">
          <input type="number" value="${s.rate}" min="0" step="10" style="width:72px" oninput="setRate('${r.id}',this.value)">
        </div>
      </td>
      <td>
        <div class="qty-ctrl">
          <button onclick="setQty('${r.id}',-1)">−</button>
          <span id="qty-${r.id}">${s.qty}</span>
          <button onclick="setQty('${r.id}',1)">+</button>
        </div>
      </td>
      <td style="color:var(--gold);font-family:'Playfair Display',serif;font-size:13px;" id="rowtotal-${r.id}">
        ${s.enabled ? total+' ' + (state.currency||'JOD') : '—'}
      </td>
    </tr>`;
  });
  if(tbody) tbody.innerHTML = rows;
  updateDaysHint();
}

function toggleRole(id, checked) {
  if(!state.crew[id]) state.crew[id]={enabled:false,rate:ROLES.find(r=>r.id===id)?.rate||100,qty:1};
  state.crew[id].enabled = checked;
  updateRowTotal(id);
  window.activePulseId='crew-'+id; updateQuote();
  saveState();
}

function setRate(id, val) {
  if(!state.crew[id]) return;
  state.crew[id].rate = parseInt(val)||0;
  updateRowTotal(id);
  window.activePulseId='crew-'+id; updateQuote();
  saveState();
}

function setQty(id, d, e) {
  const s = state.crew[id];
  if(!s) return;
  if(e && d > 0) spawnCostGhost(e, '+' + (s.rate * (state.days||1)) + ' ' + (state.currency||'JOD'));
  if(e && d < 0 && s.qty > 1) spawnCostGhost(e, '-' + (s.rate * (state.days||1)) + ' ' + (state.currency||'JOD'));
  s.qty = Math.max(1, (s.qty||1)+d);
  document.getElementById('qty-'+id).textContent = s.qty;
  updateRowTotal(id);
  window.activePulseId='crew-'+id; updateQuote();
  saveState();
}

function updateRowTotal(id) {
  const s = state.crew[id];
  const el = document.getElementById('rowtotal-'+id);
  if(!el || !s) return;
  el.textContent = s.enabled ? (s.rate*s.qty*state.days)+' ' + (state.currency||'JOD') : '—';
}

function updateDaysHint() {
  const el = document.getElementById('daysHint');
  if(!el) return;
  if(state.days>1) {
    el.textContent = L(`(الأسعار × ${state.days} أيام)`, `(Rates × ${state.days} days)`);
    el.classList.add('show');
  } else {
    el.classList.remove('show');
  }
}

function changeDays(d) {
  state.days = Math.max(1, Math.min(30, state.days+d));
  document.getElementById('daysDisplay').textContent = state.days;
  ROLES.forEach(r => updateRowTotal(r.id));
  updateDaysHint();
  updateEquipItemsTotal();
  updateQuote();
  saveState();
}

function addCustomRole() {
  openCustomRoleModal();
}

function openCustomRoleModal() {
  // Remove any existing modal
  const existing = document.getElementById('customRoleModal');
  if(existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'customRoleModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;';
  modal.innerHTML = `
    <div style="background:var(--dark2);border:1px solid var(--border2);max-width:420px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.6);">
      <div style="background:var(--dark);padding:18px 22px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);">
        <div>
          <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;color:var(--text);">${L('إضافة دور مخصص','Add Custom Role')}</div>
          <div style="font-size:10px;color:var(--text3);margin-top:3px;letter-spacing:1px;text-transform:uppercase;">${L('سيُضاف للطاقم فوراً','Will be added to crew immediately')}</div>
        </div>
        <button onclick="document.getElementById('customRoleModal').remove()" style="background:transparent;border:none;color:var(--text2);font-size:22px;cursor:pointer;line-height:1;">×</button>
      </div>
      <div style="padding:22px;">
        <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:16px;">
          <label style="font-size:11px;font-weight:600;color:var(--text3);letter-spacing:0.5px;text-transform:uppercase;">${L('اسم الدور','Role Name')}</label>
          <input id="crModalName" type="text" placeholder="${L('مثال: مدير الإنتاج','e.g. Production Manager')}"
            style="background:var(--dark3);border:1px solid var(--border);color:var(--text);font-family:inherit;font-size:14px;padding:10px 12px;outline:none;width:100%;"
            onfocus="this.style.borderColor='var(--gold)'" onblur="this.style.borderColor='var(--border)'">
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:22px;">
          <label style="font-size:11px;font-weight:600;color:var(--text3);letter-spacing:0.5px;text-transform:uppercase;">${L('السعر اليومي (JD)','Day Rate (JD)')}</label>
          <input id="crModalRate" type="number" placeholder="100" min="0" step="10" value="100"
            style="background:var(--dark3);border:1px solid var(--border);color:var(--gold);font-family:'Playfair Display',serif;font-size:20px;font-weight:700;padding:10px 12px;outline:none;width:100%;max-width:160px;"
            onfocus="this.style.borderColor='var(--gold)'" onblur="this.style.borderColor='var(--border)'">
        </div>
        <div style="display:flex;gap:10px;">
          <button onclick="document.getElementById('customRoleModal').remove()"
            style="flex:1;padding:11px;font-size:12px;font-weight:600;cursor:pointer;background:transparent;border:1px solid var(--border2);color:var(--text2);letter-spacing:0.5px;text-transform:uppercase;">
            ${L('إلغاء','Cancel')}
          </button>
          <button onclick="confirmCustomRole()"
            style="flex:2;padding:11px;font-size:12px;font-weight:700;cursor:pointer;background:var(--gold);color:#0c0d0f;border:none;letter-spacing:0.5px;text-transform:uppercase;">
            + ${L('إضافة للطاقم','Add to Crew')}
          </button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);
  setTimeout(()=>{ const inp=document.getElementById('crModalName'); if(inp) inp.focus(); },50);
  // Close on backdrop click
  modal.addEventListener('click', e=>{ if(e.target===modal) modal.remove(); });
  // Enter to confirm
  modal.addEventListener('keydown', e=>{ if(e.key==='Enter') confirmCustomRole(); if(e.key==='Escape') modal.remove(); });
}

function confirmCustomRole() {
  const nameEl = document.getElementById('crModalName');
  const rateEl = document.getElementById('crModalRate');
  const name = nameEl ? nameEl.value.trim() : '';
  const rate = parseInt(rateEl ? rateEl.value : '0') || 0;
  if(!name) { nameEl && (nameEl.style.borderColor='var(--red)'); nameEl && nameEl.focus(); return; }
  const id = 'custom_'+Date.now();
  ROLES.push({id, name, ar:name, rate});
  state.crew[id] = {enabled:true, rate, qty:1};
  document.getElementById('customRoleModal')?.remove();
  renderCrewTable();
  updateQuote();
  saveState();
}

// ══════════════════════════════════════════════════════════════
// STEP 4: EQUIPMENT
// ══════════════════════════════════════════════════════════════
function setEquipMode(mode) {
  state.equipMode = 'tier';
  updateQuote();
}

function renderEquipItems() { /* individual items mode removed */ }
function toggleEquipItem(id) { /* individual items mode removed */ }
function updateEquipItemsTotal() { /* individual items mode removed */ }

function renderEquipGrid() {
  const grid = document.getElementById('equipGrid');
  if(!grid) return;
  grid.innerHTML = EQUIPMENT_TIERS.map(e=>`
    <div class="equip-card grain-card ${state.equipment===e.id?'sel':''}" onclick="selectTier('${e.id}')">
      <div class="equip-tier">${L(e.tierAr, e.tier)}</div>
      <div class="equip-name">${L(e.nameAr, e.name)}</div>
      <div class="equip-list">${L(e.itemsAr, e.items)}</div>
      <div class="equip-price">${e.price} ${state.currency||"JOD"}/${L('يوم','day')}</div>
    </div>`).join('');
}

function selectTier(id) {
  state.equipment = id;
  renderEquipGrid();
  window.activePulseId='equip'; updateQuote();
  saveState();
}

// individual items mode removed

// ══════════════════════════════════════════════════════════════
// STEP 5: POST-PRODUCTION
// ══════════════════════════════════════════════════════════════
function togglePost(id, checked) {
  let sel = state.post[id];
  if(typeof sel === 'boolean' || !sel) {
    sel = { enabled: false, rate: POST_OPTIONS.find(p=>p.id===id)?.basePrice||150, qty: 1 };
  }
  if(typeof checked === 'boolean') {
    sel.enabled = checked;
  } else {
    sel.enabled = !sel.enabled;
  }
  state.post[id] = sel;
  renderPostOptions();
  window.activePulseId='post-'+id; updateQuote();
  saveState();
}

function setPostRate(id, val) {
  let sel = state.post[id];
  if(typeof sel === 'boolean' || !sel) {
    sel = { enabled: false, rate: POST_OPTIONS.find(p=>p.id===id)?.basePrice||150, qty: 1 };
  }
  sel.rate = parseInt(val) || 0;
  state.post[id] = sel;
  
  // Update the visible rate text so it syncs if user exits owner mode
  const cards = document.querySelectorAll('.post-option');
  cards.forEach(card => {
    if(card.innerHTML.includes(`'${id}'`)) {
      const display = card.querySelector('.rate-display');
      if(display) display.textContent = (sel.qty > 1 ? sel.qty + ' × ' : '') + sel.rate + ' ' + (state.currency||'JOD');
    }
  });

  window.activePulseId='post-'+id; updateQuote();
  saveState();
}

function setPostQty(id, d) {
  let sel = state.post[id];
  if(typeof sel === 'boolean' || !sel) {
    sel = { enabled: false, rate: POST_OPTIONS.find(p=>p.id===id)?.basePrice||150, qty: 1 };
  }
  sel.qty = Math.max(1, (sel.qty||1) + d);
  state.post[id] = sel;
  
  // Update the visible quantity text manually to avoid re-rendering and stealing focus
  const cards = document.querySelectorAll('.post-option');
  cards.forEach(card => {
    if(card.innerHTML.includes(`'${id}'`)) {
      const qtySpan = card.querySelector('.post-qty-box span');
      if(qtySpan) qtySpan.textContent = sel.qty;
      const display = card.querySelector('.rate-display');
      if(display) display.textContent = (sel.qty > 1 ? sel.qty + ' × ' : '') + sel.rate + ' ' + (state.currency||'JOD');
    }
  });

  window.activePulseId='post-'+id; updateQuote();
  saveState();
}

function renderPostOptions() {
  const isReels = state.projectType === 'reels';
  document.getElementById('postOptions').innerHTML = POST_OPTIONS.map(p=>{
    let sel = state.post[p.id];
    if(typeof sel === 'boolean') {
      sel = { enabled: sel, rate: p.basePrice, qty: 1 };
      state.post[p.id] = sel;
    } else if(!sel) {
      sel = { enabled: false, rate: p.basePrice, qty: 1 };
    }

    if(isReels && p.id==='editing') {
      return `<div class="post-option grain-card sel" style="pointer-events:none;opacity:0.85;">
        <div class="post-option-left">
          <input type="checkbox" checked disabled>
          <div>
            <div class="post-option-name">${L(p.ar, p.name)}</div>
            <div class="post-option-desc" style="color:var(--green)">✓ ${L('مشمول في سعر الريل','Included in reel price')}</div>
          </div>
        </div>
        <div class="post-price" style="color:var(--green);">${L('مشمول','Included')}</div>
      </div>`;
    }

    const extraNote = p.scriptNote ? `<div class="post-option-desc" style="color:var(--text3);margin-top:3px;">50–100 ${state.currency||"JOD"} ${L('حسب المشروع','depending on project')}</div>` : '';

    return `<div class="post-option grain-card ${sel.enabled?'sel':''}">
      <div class="post-option-left" onclick="togglePost('${p.id}')" style="flex:1; cursor:pointer;">
        <input type="checkbox" ${sel.enabled?'checked':''} onchange="togglePost('${p.id}', this.checked)" onclick="event.stopPropagation()">
        <div>
          <div class="post-option-name">${L(p.ar, p.name)}</div>
          <div class="post-option-desc">${L(p.descAr, p.desc)}</div>
          ${extraNote}
        </div>
      </div>
      <div class="post-price-wrap" style="display:flex; align-items:center;">
        
        <div class="post-qty-box" onclick="event.stopPropagation()" style="margin-right:15px; margin-left:15px;">
          <button onclick="setPostQty('${p.id}', -1)">−</button>
          <span>${sel.qty}</span>
          <button onclick="setPostQty('${p.id}', 1)">+</button>
        </div>

        <div class="post-price" style="min-width: 50px; text-align: end;">
          <span class="rate-display">${sel.qty > 1 ? sel.qty + ' × ' : ''}${sel.rate} ${state.currency||"JOD"}</span>
          <div class="rate-input-wrap" onclick="event.stopPropagation()">
            <input type="number" value="${sel.rate}" min="0" step="10" oninput="setPostRate('${p.id}', this.value)" style="width:72px; background:var(--dark4); border:1px solid var(--border); border-radius:var(--radius-md); color:var(--foreground); font-size:13px; padding:5px 8px; text-align:center;">
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
}

// ══════════════════════════════════════════════════════════════
// STEP 6: LOCATION
// ══════════════════════════════════════════════════════════════
function renderRegionGrid() {
  document.getElementById('regionGrid').innerHTML = REGIONS.map(r=>`
    <div class="region-card grain-card ${state.region===r.id?'sel':''}" onclick="selectRegion('${r.id}')">
      <div class="region-icon">${r.icon}</div>
      <div class="region-name">${L(r.ar, r.name)}</div>
      <div class="region-cities">${L(r.citiesAr, r.cities)}</div>
      <div class="region-fee">${r.fee===null?L('مخصص','Custom'):'+'+(r.fee||L('بدون رسوم','Free'))+' JD/'+L('يوم','day')}</div>
    </div>`).join('');
  document.getElementById('customTravelWrap').style.display = state.region==='other'?'block':'none';
}

function selectRegion(id) {
  state.region = id;
  renderRegionGrid();
  if(state.projectType==='reels') updateReelBreakdown();
  updateQuote();
  saveState();
}

// ══════════════════════════════════════════════════════════════
// CALCULATION ENGINE
// ══════════════════════════════════════════════════════════════
function calcQuote() {
  // ── CREW ─────────────────────────────────
  let crewTotal = 0;
  const crewLines = [];
  const isReels = state.projectType==='reels';

  ROLES.forEach(r=>{
    if(r.id==='editor') return; // no longer a crew role
    const s = state.crew[r.id];
    if(!s || !s.enabled) return;
    // For reels: crew is included in the reel price — show as included (cost = 0)
    if(isReels) {
      crewLines.push({name:r.name, nameAr:r.ar, rate:s.rate, qty:s.qty, days:state.days, total:0, isFree:true});
      return;
    }
    const total = s.rate * s.qty * state.days;
    crewTotal += total;
    crewLines.push({name:r.name, nameAr:r.ar, rate:s.rate, qty:s.qty, days:state.days, total});
  });

  // REEL PRODUCTION (separate from crew)
  let reelTotal = 0, reelLines = [];
  if(isReels) {
    const info = getReelPackInfo();
    reelTotal = info.count * info.ratePerReel;
    reelLines.push({
      name:`Instagram Reels Production (×${info.count})`,
      nameAr:`إنتاج ريلز انستغرام (×${info.count})`,
      rate:info.ratePerReel,
      qty:info.count,
      days:1,
      total:reelTotal,
      isReel:true,
      packLabel:info.packLabel
    });
  }

  // ── EQUIPMENT ────────────────────────────
  let equipTotal = 0;
  const equipLines = [];
  const ceVal = parseInt(document.getElementById('customEquip')?.value||'0')||0;

  // For reels: basic equipment is included (free), no cost added
  const reelsBasicEquipFree = isReels && (state.equipment==='basic' || !state.equipment);

  if(ceVal>0) {
    equipTotal = ceVal * state.days;
    equipLines.push({name:'Custom Equipment', nameAr:'معدات مخصصة', rate:ceVal, qty:1, days:state.days, total:equipTotal});
  } else if(state.equipment && !reelsBasicEquipFree) {
    const tier = EQUIPMENT_TIERS.find(e=>e.id===state.equipment);
    if(tier) {
      equipTotal = tier.price * state.days;
      equipLines.push({name:`Equipment — ${tier.name}`, nameAr:`معدات — ${tier.nameAr}`, rate:tier.price, qty:1, days:state.days, total:equipTotal});
    }
  }

  // ── POST-PRODUCTION ───────────────────────
  let postTotal = 0;
  const postLines = [];
  const isRush = state.deliveryDays==='rush';
  const isSeven = state.deliveryDays==='7';
  POST_OPTIONS.forEach(p=>{
    let sel = state.post[p.id];
    if(!sel) return;
    if(typeof sel === 'boolean') {
      if(!sel) return;
      sel = { enabled: true, rate: p.basePrice, qty: 1 };
    } else {
      if(!sel.enabled) return;
    }

    if(state.projectType === 'reels' && p.id === 'editing') {
      postLines.push({
        name: p.name + L(' (مشمول بالسعر)','  (included in reel price)'),
        nameAr: p.ar + ' (مشمول بالسعر)',
        price: 0,
        isFree: true
      });
      return;
    }

    let price = sel.rate * sel.qty;
    let extraStrEn = '';
    let extraStrAr = '';
    
    // Delivery multiplier
    if (p.id==='editing' || p.id==='colorgrade') {
      if (isRush) {
        price = Math.round(price * 1.5);
        extraStrEn = ' (Rush +50%)';
        extraStrAr = ' (سريع +50%)';
      } else if (isSeven) {
        price = Math.round(price * 1.25);
        extraStrEn = ' (7 Days +25%)';
        extraStrAr = ' (7 أيام +25%)';
      }
    }
    
    postTotal += price;
    postLines.push({
      name: p.name + (sel.qty>1?' ×'+sel.qty:'') + extraStrEn,
      nameAr: p.ar + (sel.qty>1?' ×'+sel.qty:'') + extraStrAr,
      price
    });
  });

  // ── TRAVEL ───────────────────────────────
  let travelFee = 0;
  if(state.region) {
    const reg = REGIONS.find(r=>r.id===state.region);
    if(reg && reg.fee!==null) travelFee = reg.fee * state.days;
    else travelFee = parseInt(document.getElementById('customTravel')?.value||'0')||0;
  }

  // ── TOTALS & DISCOUNT ────────────────────
  const subtotal = crewTotal + reelTotal + equipTotal + postTotal + travelFee;
  let discountPct = 0, discountLabel = '', discountLabelAr = '';

  // Advanced Tiered Discount System
  // Dynamically scale thresholds based on currency so it remains fair.
  let exScale = 1;
  if (state.currency === 'USD') exScale = 1.41;
  else if (state.currency === 'SAR') exScale = 5.29;
  else if (state.currency === 'AED') exScale = 5.18;

  const t1 = 800 * exScale;
  const t2 = 1500 * exScale;
  const t3 = 3000 * exScale;

  if (state.discountMode === 'none') {
    discountPct = 0;
  } else if (state.discountMode === 'custom_pct') {
    discountPct = state.discountVal || 0;
    discountLabel = `Special Discount −${discountPct}%`;
    discountLabelAr = `خصم خاص −${discountPct}%`;
  } else if (state.discountMode === 'custom_amt') {
    // Custom amount will be handled below
    discountPct = 0;
  } else {
    // Auto Volume Discount
    if (subtotal >= t3) {
      discountPct = 10; 
      discountLabel = 'Premium Volume Discount −10%'; 
      discountLabelAr = 'خصم ذهبي (حجم عمل) −10%';
    } else if (subtotal >= t2) {
      discountPct = 7; 
      discountLabel = 'Volume Discount −7%'; 
      discountLabelAr = 'خصم فضي (حجم عمل) −7%';
    } else if (subtotal >= t1) {
      discountPct = 5; 
      discountLabel = 'Project Discount −5%'; 
      discountLabelAr = 'خصم تشجيعي −5%';
    }
  }

  let rawDiscount = Math.round(subtotal * discountPct/100);
  if (state.discountMode === 'custom_amt') {
    rawDiscount = state.discountVal || 0;
    discountLabel = 'Special Discount';
    discountLabelAr = 'خصم خاص';
  }
  let afterDiscount = subtotal - rawDiscount;
  let totalRounded = Math.round(afterDiscount/50)*50 || afterDiscount;
  
  // If custom discount, don't round the final total to preserve exact math
  if (state.discountMode === 'custom_amt' || state.discountMode === 'custom_pct') {
    totalRounded = afterDiscount;
  }
  
  // Calculate EXACT discount amount so UI math adds up perfectly
  let discountAmt = 0;
  if (discountPct > 0 || state.discountMode === 'custom_amt') {
    discountAmt = Math.max(0, subtotal - totalRounded);
  }

  return {
    crewTotal, crewLines,
    reelTotal, reelLines,
    equipTotal, equipLines,
    postTotal, postLines,
    travelFee,
    subtotal,
    discountPct, discountAmt, discountLabel, discountLabelAr,
    total: totalRounded,
    rawTotal: subtotal
  };
}

// ══════════════════════════════════════════════════════════════
// SIDEBAR UPDATE
// ══════════════════════════════════════════════════════════════
function updateQuote() {
  // Sync state from inputs
  const sync = (id, key) => { const el=document.getElementById(id); if(el) state[key]=el.value; };
  sync('clientName','clientName'); sync('clientCompany','clientCompany');
  sync('projectTitle','projectTitle'); sync('quoteDate','quoteDate');
  sync('preparedBy','preparedBy'); sync('deliveryDays','deliveryDays');
  sync('projectNotes','projectNotes');
  state.reelRate = parseInt(document.getElementById('reelRate')?.value||'150')||150;
  state.customEquip = parseInt(document.getElementById('customEquip')?.value||'0')||0;
  state.customTravel = parseInt(document.getElementById('customTravel')?.value||'0')||0;

  if(!state.projectType) return;
  const q = calcQuote();
  const isReels = state.projectType==='reels';

  // Discount bar
  const db = document.getElementById('discountBar');
  if(q.discountPct>0) {
    db.classList.add('show');
    document.getElementById('discountPct').textContent = L(q.discountLabelAr, q.discountLabel);
  } else { db.classList.remove('show'); }

  // Mobile total
  const mt = document.getElementById('mobileTotal');
  if(mt.textContent !== q.total+' ' + (state.currency||'JOD')){
    animateValue(mt, parseInt(mt.textContent)||0, q.total, 400);
    mt.classList.remove('sb-total-bump');
    void mt.offsetWidth;
    mt.classList.add('sb-total-bump');
  }

  // Build sidebar HTML
  const type = PROJECT_TYPES.find(t=>t.id===state.projectType);
  let html = `<div class="sb-section">
    <div class="sb-section-title">${L('المشروع','Project')}</div>
    <div class="sb-line">
      <span class="sb-line-label">${type?.icon||''} ${L(type?.ar||'',type?.name||'—')}</span>
      <span class="sb-line-val muted">${state.days} ${L('يوم','day')}</span>
    </div>
    ${state.projectType==='reels'?`<div class="sb-line"><span class="sb-line-label">${L('عدد الريلز','Reels')}</span><span class="sb-line-val">${state.reelCount}</span></div>`:''}
  </div>`;

  if(q.reelTotal>0) {
    html+=`<div class="sb-section"><div class="sb-section-title">${L('إنتاج الريلز','Reel Production')}</div>`;
    q.reelLines.forEach(l=>{
      const packInfo = l.packLabel ? `<div style="font-size:10px;color:var(--green);margin-top:2px;">🎯 ${l.packLabel}</div>` : '';
      html+=`<div class="sb-line"><span class="sb-line-label">${state.reelCount} ${L('ريل','reels')} × ${l.rate} ${state.currency||"JOD"}${packInfo?'<br>'+packInfo:''}</span><span class="sb-line-val">${l.total} ${state.currency||"JOD"}</span></div>`;
    });
    html+=`</div>`;
  }

  if(q.crewTotal>0 || (q.crewLines.length>0 && isReels)) {
    html+=`<div class="sb-section"><div class="sb-section-title">${L('الطاقم','Crew')}</div>`;
    q.crewLines.forEach(l=>{
      if(l.isFree) {
        html+=`<div class="sb-line ${window.activePulseId==='crew-'+l.id ? 'pulse-update' : ''}"><span class="sb-line-label">${L(l.nameAr,l.name)}${l.qty>1?' ×'+l.qty:''}</span><span class="sb-line-val" style="color:var(--green);font-family:'Inter',sans-serif;font-size:11px;">✓ ${L('مشمول','Incl.')}</span></div>`;
      } else {
        html+=`<div class="sb-line ${window.activePulseId==='crew-'+l.id ? 'pulse-update' : ''}"><span class="sb-line-label">${L(l.nameAr,l.name)}${l.qty>1?' ×'+l.qty:''}</span><span class="sb-line-val">${l.total} ${state.currency||"JOD"}</span></div>`;
      }
    });
    html+=`</div>`;
  }

  if(state.projectType==='reels' && (state.equipment==='basic' || !state.equipment)) {
    html+=`<div class="sb-section"><div class="sb-section-title">${L('المعدات','Equipment')}</div>
    <div class="sb-line"><span class="sb-line-label">📦 ${L('المعدات الأساسية','Basic Equipment')}</span><span class="sb-line-val" style="color:var(--green)">✓ ${L('مشمولة','Included')}</span></div></div>`;
  } else if(q.equipTotal>0) {
    html+=`<div class="sb-section"><div class="sb-section-title">${L('المعدات','Equipment')}</div>`;
    html+=`<div class="sb-line ${window.activePulseId==='equip' ? 'pulse-update' : ''}"><span class="sb-line-label">${L('إيجار معدات','Equipment Rental')}</span><span class="sb-line-val">${q.equipTotal} ${state.currency||"JOD"}</span></div>`;
    html+=`</div>`;
  }

  if(q.postTotal>0 || q.postLines.some(l=>l.isFree)) {
    html+=`<div class="sb-section"><div class="sb-section-title">${L('ما بعد الإنتاج','Post-Production')}</div>`;
    q.postLines.forEach(l=>{
      if(l.isFree) {
        html+=`<div class="sb-line ${window.activePulseId==='post-'+l.id ? 'pulse-update' : ''}"><span class="sb-line-label">${L(l.nameAr,l.name)}</span><span class="sb-line-val" style="color:var(--green);font-family:'Inter',sans-serif;font-size:11px;">✓ ${L('مشمول','Incl.')}</span></div>`;
      } else {
        html+=`<div class="sb-line ${window.activePulseId==='post-'+l.id ? 'pulse-update' : ''}"><span class="sb-line-label">${L(l.nameAr,l.name)}</span><span class="sb-line-val">${l.price} ${state.currency||"JOD"}</span></div>`;
      }
    });
    html+=`</div>`;
  }

  if(q.travelFee>0) {
    const reg = REGIONS.find(r=>r.id===state.region);
    html+=`<div class="sb-section"><div class="sb-section-title">${L('السفر','Travel')}</div>
    <div class="sb-line"><span class="sb-line-label">${L(reg?.ar||'سفر',reg?.name||'Travel')}</span><span class="sb-line-val">${q.travelFee} ${state.currency||"JOD"}</span></div></div>`;
  }
  
  if(q.discountAmt > 0) {
    html+=`<div class="sb-section"><div class="sb-section-title" style="color:var(--gold)">${L('الخصم','Discount')}</div>
    <div class="sb-line"><span class="sb-line-label" style="color:var(--gold); font-weight:700;">${L(q.discountLabelAr, q.discountLabel)}</span><span class="sb-line-val" style="color:var(--gold); font-weight:700;">− ${q.discountAmt} ${state.currency||"JOD"}</span></div></div>`;
  }

  html+=`<hr class="sb-divider" style="margin-top:18px;border-top:2px solid var(--gold-b);">
  <div class="sb-total">
    <div>
      <div class="sb-total-label">${L('المجموع الكلي','Total Quote')}</div>
      ${q.discountPct>0?`<div class="sb-total-old">${q.rawTotal} ${state.currency||"JOD"}</div>`:''}
    </div>
    <div style="text-align:end">
      <div class="sb-total-new">${q.total} ${state.currency||"JOD"}</div>
      ${q.discountPct>0?`<div class="sb-discount-badge">${L('توفير','SAVE')} ${q.discountAmt} ${state.currency||"JOD"}</div>`:''}
    </div>
  </div>`;

  document.getElementById('sbBody').innerHTML = html;
}

// ══════════════════════════════════════════════════════════════
// PRICE OFFER DOCUMENT
// ══════════════════════════════════════════════════════════════
function showInlineAlert(msgAr, msgEn) {
  const existing = document.getElementById('inlineAlertOverlay');
  if(existing) existing.remove();
  const ov = document.createElement('div');
  ov.id = 'inlineAlertOverlay';
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:3000;display:flex;align-items:center;justify-content:center;padding:20px;';
  ov.innerHTML = `
    <div style="background:var(--dark2);border:1px solid var(--border2);max-width:360px;width:100%;text-align:center;">
      <div style="padding:28px 24px;">
        <div style="font-size:32px;margin-bottom:12px;">⚠️</div>
        <div style="font-family:'Playfair Display',serif;font-size:16px;font-weight:700;color:var(--text);margin-bottom:8px;">${L(msgAr, msgEn)}</div>
      </div>
      <div style="border-top:1px solid var(--border);padding:14px 24px;">
        <button onclick="document.getElementById('inlineAlertOverlay').remove();goStep(1);"
          style="background:var(--gold);color:#0c0d0f;border:none;padding:11px 28px;font-size:13px;font-weight:700;cursor:pointer;letter-spacing:0.5px;width:100%;">
          ${L('اختر نوع المشروع','Select Project Type')}
        </button>
      </div>
    </div>`;
  document.body.appendChild(ov);
  ov.addEventListener('click', e=>{ if(e.target===ov) ov.remove(); });
}


window.resetCustom = function(key) {
  state[key] = null;
  saveState();
  showPreview();
}

function showPreview() {
  if(!state.projectType){ showInlineAlert('يرجى اختيار نوع المشروع أولاً','Please select a project type first.'); return; }
  
  const cName = document.getElementById('clientName');
  if(!cName.value.trim()){
    goStep(2);
    cName.classList.add('shake-error');
    setTimeout(()=>cName.classList.remove('shake-error'), 500);
    cName.focus();
    return;
  }

  const btns = document.querySelectorAll('#btnGenerate, .mq-btn');
  const oldTexts = [];
  btns.forEach((btn, i) => { 
    oldTexts[i] = btn.innerHTML; 
    btn.innerHTML = '<span class="ar-only">جاري الحساب...</span><span class="en-only">Calculating...</span>'; 
    btn.style.opacity = '0.7'; 
    btn.style.pointerEvents = 'none'; 
  });
  
  setTimeout(() => {
    btns.forEach((btn, i) => { 
      btn.innerHTML = oldTexts[i]; 
      btn.style.opacity = '1'; 
      btn.style.pointerEvents = 'auto'; 
    });
    
    const q = calcQuote();
    const type = PROJECT_TYPES.find(t=>t.id===state.projectType);
    const today = state.quoteDate || new Date().toISOString().split('T')[0];
    const region = REGIONS.find(r=>r.id===state.region);

  // Calculate expiry date (30 days from quote date)
  const quoteD = new Date(today);
  quoteD.setDate(quoteD.getDate()+30);
  const expiryDate = quoteD.toISOString().split('T')[0];

  let rows = '';

  // Reel lines
  q.reelLines.forEach(l=>{
    const packInfo = l.packLabel ? `<br><span style="font-size:11px;color:var(--green)">🎯 Content Pack — ${l.packLabel}</span>` : '';
    rows+=`<tr>
      <td>${l.name}${packInfo}</td>
      <td>${l.rate} ${state.currency||"JOD"}/reel</td>
      <td>${l.qty} reel${l.qty>1?'s':''}</td>
      <td>${l.total} ${state.currency||"JOD"}</td>
    </tr>`;
  });

  // Crew lines
  q.crewLines.forEach(l=>{
    if(l.isFree) {
      rows+=`<tr>
        <td>${l.name}${l.qty>1?' ×'+l.qty:''}<br><span style="font-size:11px;color:var(--green)">Included in reel price</span></td>
        <td style="color:var(--green)">—</td>
        <td>—</td>
        <td style="color:var(--green)">Included</td>
      </tr>`;
    } else {
      rows+=`<tr>
        <td>${l.name}</td>
        <td>${l.rate} ${state.currency||"JOD"}/day</td>
        <td>${l.qty>1?l.qty+'× ':''}${l.days} day${l.days>1?'s':''}</td>
        <td>${l.total} ${state.currency||"JOD"}</td>
      </tr>`;
    }
  });

  // Equipment lines
  if(state.projectType==='reels' && (state.equipment==='basic'||!state.equipment)) {
    rows+=`<tr>
      <td>Equipment — Basic Setup<br><span style="font-size:11px;color:var(--green)">Included in reel price</span></td>
      <td style="color:var(--green)">—</td>
      <td>—</td>
      <td style="color:var(--green)">Included</td>
    </tr>`;
  } else if(q.equipTotal>0) {
    const tier = EQUIPMENT_TIERS.find(e=>e.id===state.equipment);
    rows+=`<tr>
      <td>Equipment Rental${tier?'<br><span style="font-size:11px;color:var(--text3)">'+tier.name+'</span>':''}</td>
      <td>${Math.round(q.equipTotal/state.days)} ${state.currency||"JOD"}/day</td>
      <td>${state.days} day${state.days>1?'s':''}</td>
      <td>${q.equipTotal} ${state.currency||"JOD"}</td>
    </tr>`;
  }

  // Post lines
  q.postLines.forEach(l=>{
    if(l.isFree) {
      rows+=`<tr>
        <td>${l.name}</td>
        <td style="color:var(--green)">—</td>
        <td>—</td>
        <td style="color:var(--green)">Included</td>
      </tr>`;
    } else {
      rows+=`<tr>
        <td>${l.name}</td>
        <td>${l.price} ${state.currency||"JOD"}</td>
        <td>1</td>
        <td>${l.price} ${state.currency||"JOD"}</td>
      </tr>`;
    }
  });

  // Travel
  if(q.travelFee>0) {
    rows+=`<tr>
      <td>Travel / Transportation${region?'<br><span style="font-size:11px;color:var(--text3)">'+region.name+'</span>':''}</td>
      <td>${Math.round(q.travelFee/state.days)} ${state.currency||"JOD"}/day</td>
      <td>${state.days} day${state.days>1?'s':''}</td>
      <td>${q.travelFee} ${state.currency||"JOD"}</td>
    </tr>`;
  }

  const delivLabel = state.deliveryDays==='rush'?'3 days or less (Rush Delivery)':`${state.deliveryDays} working days after shooting`;
  const randCode = Math.random().toString(36).substring(2, 6).toUpperCase();
  const dateStr = today.replace(/-/g, '').substring(2);
  const refNumber = `FH-${dateStr}-${randCode}`;
  
  let paymentText = '— Down payment of 50% upon signing the contract.<br>— Final payment of 50% upon delivery of the final version.<br>';
  if(state.paymentTerms === '30_40_30') {
    paymentText = '— Down payment of 30% upon signing, 40% before production, 30% upon final delivery.<br>';
  } else if(state.paymentTerms === 'net_30') {
    paymentText = '— Payment is due Net 30 days after final delivery.<br>';
  }

  document.getElementById('quotePreview').innerHTML = `
  <div class="quote-doc">
    <div class="q-top">
      <div class="q-title">PRICE OFFER</div>
      <div class="q-subtitle">${state.projectTitle || type.name}</div>
      <div class="q-meta">
        <div class="q-meta-block">
          <p><strong>From:</strong></p>
          <p>${state.preparedBy}</p>
          <p>Faii House Production</p>
          <p>Faii.House.jo@gmail.com</p>
          <p>+962799256345</p>
        </div>
        <div class="q-meta-block">
          ${state.clientName?`<p><strong>To:</strong></p><p>${state.clientName}</p>${state.clientCompany?`<p>${state.clientCompany}</p>`:''}`:''}
        </div>
        <div class="q-meta-block" style="text-align:end;">
          <p><strong>REF:</strong> ${refNumber}</p>
          <p><strong>Date:</strong> ${today}</p>
          <p><strong>Valid Until:</strong> ${expiryDate}</p>
          <p><strong>Delivery:</strong> ${delivLabel}</p>
          <p><strong>Days:</strong> ${state.days} shooting day${state.days>1?'s':''}</p>
          ${state.projectType==='reels'?`<p><strong>Reels:</strong> ${state.reelCount}</p>`:''}
        </div>
      </div>
    </div>
    <div class="q-divider"></div>
    <div class="q-body">
      <table class="q-table">
        <thead>
          <tr>
            <th>Item Description</th>
            <th>Cost</th>
            <th>Qty / Duration</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
          ${q.discountAmt > 0 ? `<tr>
            <td colspan="3" style="text-align:right; font-weight:700; color:var(--gold);">${q.discountLabel}</td>
            <td style="font-weight:700; color:var(--gold);">− ${q.discountAmt} ${state.currency||"JOD"}</td>
          </tr>` : ''}
        </tbody>
      </table>
      <div class="q-subtotal">
        <div>
          <div style="font-size:11px;font-weight:700;color:var(--text3);letter-spacing:1.5px">TOTAL</div>
          <div style="font-size:11px;color:var(--text3)">All services included · Tax-exempt</div>
        </div>
        <div style="display:flex;align-items:baseline;gap:12px">
          ${q.discountPct>0?`<span class="q-sub-old">${q.rawTotal} ${state.currency||"JOD"}</span>`:''}
          <span class="q-sub-new">${q.total} ${state.currency||"JOD"}</span>
        </div>
      </div>
      ${q.discountPct>0?`<div style="background:rgba(212,175,55,0.08);border:1px solid rgba(212,175,55,0.2);padding:10px 14px;font-size:12px;color:var(--gold);margin-bottom:18px;">
        🎯 ${q.discountLabel} applied — You save ${q.discountAmt} ${state.currency||"JOD"}
      </div>`:''}
      
      
      <div class="q-details-wrap" style="position:relative; margin-bottom:20px;">
        <div style="font-size:10px;font-weight:700;color:var(--text3);letter-spacing:2px;margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
          <span>DETAILS & TERMS</span>
          ${isOwnerMode ? `<button class="btn-sm btn-ghost" onclick="resetCustom(\'customTerms\')" style="font-size:9px; padding:2px 8px; min-height:0; display:${state.customTerms?'inline-flex':'none'};">Reset Default</button>` : ''}
        </div>
        <div class="q-details" 
             ${isOwnerMode ? 'contenteditable="true" spellcheck="false" onblur="state.customTerms=this.innerHTML;saveState();"' : ''} 
             style="${isOwnerMode ? 'outline:none; padding:12px; border:1px dashed var(--border); border-radius:8px; cursor:text; margin-bottom:0;' : 'margin-bottom:0;'}">
          ${state.customTerms ? state.customTerms : `— Video delivery: ${delivLabel}.<br>
— This offer is valid until: <strong style="color:var(--text)">${expiryDate}</strong> (30 days from issue date).<br>
— Client has the right to request changes · ${state.deliveryDays==='rush'?'1 revision':'2 revisions'} included.<br>
${paymentText}— Equipment rental and transportation fees are included in the total.<br>
— The above price is final and tax-exempt.<br>
${state.projectNotes?'— '+state.projectNotes+'<br>':''}
— Any additional taxes imposed by relevant authorities are the responsibility of the client.`}
        </div>
        ${isOwnerMode ? '<div style="font-size:9px; color:var(--primary); margin-top:6px; text-align:right;">✦ You can click and edit the text above. It will be saved automatically.</div>' : ''}
      </div>
    </div>
    <div class="q-footer" style="${isOwnerMode ? 'align-items:flex-start;' : ''}">
      <div class="q-footer-left">
        <div class="ty" style="margin-bottom:10px;">Thank<br>You<span>.</span></div>
        ${isOwnerMode ? `<button class="btn-sm btn-ghost" onclick="resetCustom('customContact')" style="font-size:9px; padding:2px 8px; min-height:0; display:${state.customContact?'inline-flex':'none'}; margin-bottom:4px;">Reset Default</button>` : ''}
        <div class="contact" 
             ${isOwnerMode ? 'contenteditable="true" spellcheck="false" onblur="state.customContact=this.innerHTML;saveState();"' : ''} 
             style="${isOwnerMode ? 'outline:none; padding:8px; border:1px dashed var(--border); border-radius:6px; cursor:text;' : ''}">
          ${state.customContact ? state.customContact : `Faii.House.jo@gmail.com<br>+962799256345<br>+962796016640`}
        </div>
      </div>
      <div class="q-footer-right" style="${isOwnerMode ? 'display:flex; flex-direction:column; align-items:flex-end;' : ''}">
        <div class="send" style="margin-bottom:10px;">SEND<br>PAYMENT</div>
        ${isOwnerMode ? `<button class="btn-sm btn-ghost" onclick="resetCustom('customBank')" style="font-size:9px; padding:2px 8px; min-height:0; display:${state.customBank?'inline-flex':'none'}; margin-bottom:4px;">Reset Default</button>` : ''}
        <div class="cliq" 
             ${isOwnerMode ? 'contenteditable="true" spellcheck="false" onblur="state.customBank=this.innerHTML;saveState();"' : ''} 
             style="${isOwnerMode ? 'outline:none; padding:8px; border:1px dashed var(--border); border-radius:6px; cursor:text; text-align:right;' : ''}">
          ${state.customBank ? state.customBank : `CliQ: AHMAD00HAD<br>IBAN: JO47ARAB181000000018121212308500`}
        </div>
      </div>
    </div>
  </div>`;
  document.getElementById('quoteModal').classList.add('show');
  playSuccess();
  if(typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#ffffff', '#2ecc71']
    });
  }
  }, 800);
}

function closeModal() {
  document.getElementById('quoteModal').classList.remove('show');
}

// ══════════════════════════════════════════════════════════════
// WHATSAPP
// ══════════════════════════════════════════════════════════════
function sendWhatsApp() {
  if(!state.projectType){
    showInlineAlert('يرجى إنشاء عرض السعر أولاً','Please build a quote first.');
    return;
  }
  const q = calcQuote();
  const type = PROJECT_TYPES.find(t=>t.id===state.projectType);
  const today = state.quoteDate || new Date().toISOString().split('T')[0];
  const quoteD = new Date(today);
  quoteD.setDate(quoteD.getDate()+30);
  const expiryDate = quoteD.toISOString().split('T')[0];

  let msg = `*Faii House Production — Price Offer*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  if(state.clientName) msg += `*Client:* ${state.clientName}${state.clientCompany?' — '+state.clientCompany:''}\n`;
  msg += `*Project:* ${state.projectTitle || type.name}\n`;
  msg += `*Date:* ${today}  |  *Valid Until:* ${expiryDate}\n`;
  msg += `*Shooting Days:* ${state.days}\n`;
  if(state.projectType==='reels') msg += `*Reels:* ${state.reelCount}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  if(q.crewTotal>0) msg += `🎬 *Crew:* ${q.crewTotal} ${state.currency||"JOD"}\n`;
  if(q.reelTotal>0) msg += `📱 *Reel Production:* ${q.reelTotal} ${state.currency||"JOD"}\n`;
  if(q.equipTotal>0) msg += `📷 *Equipment:* ${q.equipTotal} ${state.currency||"JOD"}\n`;
  if(q.postTotal>0) msg += `🎞 *Post-Production:* ${q.postTotal} ${state.currency||"JOD"}\n`;
  if(q.travelFee>0) msg += `🚗 *Travel:* ${q.travelFee} ${state.currency||"JOD"}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  if(q.discountPct>0) msg += `💚 *${q.discountLabel}* — Save ${q.discountAmt} ${state.currency||"JOD"}\n`;
  msg += `💰 *TOTAL: ${q.total} ${state.currency||"JOD"}*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `Down payment 50% upon contract signing.\nFaii.House.jo@gmail.com`;

  const url = `https://wa.me/962799256345?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

// ══════════════════════════════════════════════════════════════
// NEGOTIATE
// ══════════════════════════════════════════════════════════════
function openNegotiate(){
  if(!state.projectType){
    showInlineAlert('يرجى إنشاء عرض السعر أولاً','Please build a quote first.');
    return;
  }
  const q = calcQuote();
  const existing = document.getElementById('negotiateModal');
  if(existing) existing.remove();
  const ar = currentLang === 'ar';
  const modal = document.createElement('div');
  modal.id = 'negotiateModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:3000;display:flex;align-items:center;justify-content:center;padding:20px;';
  modal.innerHTML = `
    <div style="background:var(--dark2);border:1px solid var(--border2);max-width:460px;width:100%;direction:${ar?'rtl':'ltr'};">
      <div style="padding:24px 24px 8px;text-align:center;border-bottom:1px solid var(--border);">
        <div style="font-size:32px;margin-bottom:8px;">🤝</div>
        <div style="font-family:'Playfair Display',serif;font-size:19px;font-weight:700;color:var(--gold);margin-bottom:6px;">${ar?'تفاوض على السعر':'Negotiate the Price'}</div>
        <div style="font-size:12px;color:var(--text3);line-height:1.7;">${ar?'كل عروضنا قابلة للتفاوض. أخبرنا بميزانيتك أو السعر الذي تراه مناسباً، وسنحاول الوصول لحل يناسب الطرفين.':'All our offers are negotiable. Tell us your budget or the price you find fair, and we will try to meet in the middle.'}</div>
      </div>
      <div style="padding:20px 24px;display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text2);background:var(--dark);padding:10px 12px;border:1px solid var(--border);">
          <span>${ar?'العرض الحالي':'Current Offer'}</span>
          <span style="color:var(--gold);font-weight:700;font-family:'Playfair Display',serif;">${q.total} ${state.currency||"JOD"}</span>
        </div>
        <div>
          <label style="display:block;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:var(--text3);margin-bottom:6px;">${ar?'السعر / الميزانية المقترحة (دينار)':'Your Proposed Price / Budget (JD)'}</label>
          <input type="number" id="negotiatePrice" min="0" placeholder="${ar?'مثال: 1500':'e.g. 1500'}" style="width:100%;padding:11px 12px;background:var(--dark);border:1px solid var(--border2);color:var(--text);font-size:14px;font-family:inherit;">
        </div>
        <div>
          <label style="display:block;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:var(--text3);margin-bottom:6px;">${ar?'ملاحظة (اختياري)':'Note (optional)'}</label>
          <textarea id="negotiateNote" rows="3" placeholder="${ar?'أي تفاصيل تساعدنا على تلبية ميزانيتك...':'Any details that help us match your budget...'}" style="width:100%;padding:11px 12px;background:var(--dark);border:1px solid var(--border2);color:var(--text);font-size:13px;font-family:inherit;resize:vertical;"></textarea>
        </div>
      </div>
      <div style="display:flex;border-top:1px solid var(--border);">
        <button onclick="document.getElementById('negotiateModal').remove()" style="flex:1;padding:14px;font-size:13px;font-weight:600;cursor:pointer;background:transparent;border:none;border-inline-end:1px solid var(--border);color:var(--text2);">${ar?'إلغاء':'Cancel'}</button>
        <button onclick="sendNegotiation()" style="flex:1.4;padding:14px;font-size:13px;font-weight:700;cursor:pointer;background:var(--gold);color:#0c0d0f;border:none;letter-spacing:0.5px;text-transform:uppercase;">${ar?'إرسال التفاوض':'Send Negotiation'}</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  setTimeout(()=>document.getElementById('negotiatePrice')?.focus(),50);
}

function sendNegotiation(){
  const priceEl = document.getElementById('negotiatePrice');
  const noteEl = document.getElementById('negotiateNote');
  const proposed = parseFloat(priceEl?.value || '0');
  const note = (noteEl?.value || '').trim();
  if(!proposed || proposed <= 0){
    priceEl?.focus();
    priceEl.style.borderColor = '#e74c3c';
    return;
  }
  const q = calcQuote();
  const type = PROJECT_TYPES.find(t=>t.id===state.projectType);
  const diff = q.total - proposed;
  const pct = q.total > 0 ? Math.round((diff/q.total)*100) : 0;

  let msg = `*Faii House — Price Negotiation 🤝*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  if(state.clientName) msg += `*Client:* ${state.clientName}${state.clientCompany?' — '+state.clientCompany:''}\n`;
  msg += `*Project:* ${state.projectTitle || type.name}\n`;
  msg += `*Shooting Days:* ${state.days}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `💰 *Our Offer:* ${q.total} ${state.currency||"JOD"}\n`;
  msg += `🤝 *Client Proposal:* ${proposed} ${state.currency||"JOD"}\n`;
  if(diff !== 0) msg += `📊 *Difference:* ${diff} ${state.currency||"JOD"} (${pct}%)\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  if(note) msg += `📝 *Note:*\n${note}\n━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `Looking forward to reaching a deal that works for both of us.`;

  const url = `https://wa.me/962799256345?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
  document.getElementById('negotiateModal')?.remove();
}

// ══════════════════════════════════════════════════════════════
// RESET (preserves localStorage only after explicit confirmation; clears it too on reset)
// ══════════════════════════════════════════════════════════════
function resetAll() {
  openResetConfirmModal();
}

function openResetConfirmModal() {
  const existing = document.getElementById('resetConfirmModal');
  if(existing) existing.remove();
  const modal = document.createElement('div');
  modal.id = 'resetConfirmModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.82);z-index:3000;display:flex;align-items:center;justify-content:center;padding:20px;';
  modal.innerHTML = `
    <div style="background:var(--dark2);border:1px solid var(--border2);max-width:380px;width:100%;">
      <div style="padding:28px 24px;text-align:center;">
        <div style="font-size:30px;margin-bottom:12px;">🗑️</div>
        <div style="font-family:'Playfair Display',serif;font-size:17px;font-weight:700;color:var(--text);margin-bottom:8px;">${L('إعادة تعيين كل شيء؟','Reset Everything?')}</div>
        <div style="font-size:12px;color:var(--text3);line-height:1.7;">${L('سيتم حذف جميع البيانات المحفوظة تلقائياً. لا يمكن التراجع عن هذا الإجراء.','All auto-saved data will be cleared. This action cannot be undone.')}</div>
      </div>
      <div style="display:flex;border-top:1px solid var(--border);">
        <button onclick="document.getElementById('resetConfirmModal').remove()"
          style="flex:1;padding:14px;font-size:13px;font-weight:600;cursor:pointer;background:transparent;border:none;border-inline-end:1px solid var(--border);color:var(--text2);">
          ${L('إلغاء','Cancel')}
        </button>
        <button onclick="doReset()"
          style="flex:1;padding:14px;font-size:13px;font-weight:700;cursor:pointer;background:var(--red);color:#fff;border:none;">
          ${L('نعم، إعادة تعيين','Yes, Reset')}
        </button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', e=>{ if(e.target===modal) modal.remove(); });
}

function doReset() {
  document.getElementById('resetConfirmModal')?.remove();
  try { localStorage.removeItem(LS_KEY); } catch(e){}
  state = DEFAULT_STATE();
  const el = (id) => document.getElementById(id);
  if(el('quoteDate')) el('quoteDate').value = state.quoteDate;
  if(el('preparedBy')) el('preparedBy').value = 'Ahmad Haddad';
  if(el('deliveryDays')) el('deliveryDays').value = '14';
  ['clientName','clientCompany','projectTitle','projectNotes','customEquip','customTravel']
    .forEach(id=>{ const e=el(id); if(e) e.value=''; });
  if(el('reelWrap')) el('reelWrap').style.display='none';
  if(el('reelCount')) el('reelCount').textContent='1';
  if(el('reelRate')) el('reelRate').value=150;
  if(el('daysDisplay')) el('daysDisplay').textContent='1';
  if(el('discountBar')) el('discountBar').classList.remove('show');
  if(el('packNotice')) el('packNotice').classList.remove('show');
  if(el('customTravelWrap')) el('customTravelWrap').style.display='none';
  renderTypeGrid();
  renderCrewTable();
  renderEquipGrid();
  renderPostOptions();
  renderRegionGrid();
  goStep(1);
  el('sbBody').innerHTML=`<div class="sb-empty"><span class="sb-empty-icon">🎬</span><p class="ar-only">اختر نوع المشروع لبدء بناء عرض السعر</p><p class="en-only">Select a project type to start</p></div>`;
  el('mobileTotal').textContent='0 ' + (state.currency||'JOD');
}
