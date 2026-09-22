const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

// Replace PROJECT_TYPES
const typesRegex = /const PROJECT_TYPES = \[([\s\S]*?)\];/;
const newTypes = `const PROJECT_TYPES = [
  {id:'reels',   icon:'📱',name:'Instagram Reels',   ar:'ريلز انستغرام',    range:\`100–250 \${state.currency||"JOD"}\`, crew:['cinematographer'],  pack:true,  reelBased:true, defaultEquip:'basic', defaultPost:['editing']},
  {id:'interview',icon:'🎙',name:'Interview / Podcast',ar:'مقابلة / بودكاست',range:\`300–800 \${state.currency||"JOD"}\`,   crew:['cinematographer','sound'], defaultEquip:'standard', defaultPost:['editing','graphics']},
  {id:'corporate',icon:'🏢',name:'Corporate Video',   ar:'فيديو مؤسسي',      range:\`600–2,000 \${state.currency||"JOD"}\`, crew:['director','cinematographer','producer'], defaultEquip:'standard', defaultPost:['editing','colorgrade','graphics']},
  {id:'commercial',icon:'📺',name:'Commercial / TVC', ar:'إعلان تجاري',      range:\`800–4,000 \${state.currency||"JOD"}\`, crew:['director','cinematographer','producer','gaffer','art_director'], defaultEquip:'pro', defaultPost:['editing','colorgrade','sound_design','motion']},
  {id:'documentary',icon:'🎥',name:'Documentary',     ar:'فيلم وثائقي',       range:\`600–3,000 \${state.currency||"JOD"}\`, crew:['director','cinematographer','sound','location_scout'], defaultEquip:'standard', defaultPost:['editing','colorgrade','subtitles']},
  {id:'shortfilm',icon:'🎞',name:'Short Film',        ar:'فيلم قصير',          range:\`800–3,800 \${state.currency||"JOD"}\`, crew:['director','cinematographer','producer','sound','main_actor'], defaultEquip:'pro', defaultPost:['editing','colorgrade','sound_design']},
  {id:'event',   icon:'🎤',name:'Event Coverage',     ar:'تغطية فعالية',       range:\`300–1,500 \${state.currency||"JOD"}\`, crew:['cinematographer','photographer'], defaultEquip:'standard', defaultPost:['editing']},
  {id:'photovideo',icon:'📷',name:'Photo + Video',    ar:'صور + فيديو',        range:\`500–2,500 \${state.currency||"JOD"}\`, crew:['cinematographer','photographer','art_director'], defaultEquip:'standard', defaultPost:['editing','colorgrade']},
  {id:'realestate', icon:'🏢', name:'Real Estate Tour', ar:'تصوير عقاري ومعماري', range:\`400–1,500 \${state.currency||"JOD"}\`, crew:['cinematographer','photographer'], defaultEquip:'standard', defaultPost:['editing','colorgrade']}
];`;

html = html.replace(typesRegex, newTypes);

// Replace selectType
const selectTypeRegex = /function selectType\(id\) \{[\s\S]*?saveState\(\);\n\}/;
const newSelectType = `function selectType(id) {
  state.projectType = id;
  const type = PROJECT_TYPES.find(t=>t.id===id);

  // Set default crew
  ROLES.forEach(r=>{
    let enabled = false;
    let qty = 1;
    if(id==='reels') {
      enabled = r.id==='cinematographer';
    } else if(id==='interview') {
      if(r.id==='cinematographer') { enabled=true; qty=2; }
      else if(r.id==='sound') { enabled=true; }
    } else {
      enabled = type.crew && type.crew.includes(r.id);
    }
    state.crew[r.id] = {enabled, rate:r.rate, qty};
  });

  // Set default equipment
  if(type.defaultEquip) {
     state.equipment = type.defaultEquip;
  } else {
     state.equipment = 'basic';
  }
  
  if (id === 'reels') {
      state.reelsEquipFree = true;
  } else {
      state.reelsEquipFree = false;
  }
  state.equipMode = 'tier';

  // Set default post-production
  state.post = {};
  if(type.defaultPost) {
     type.defaultPost.forEach(p => {
         state.post[p] = { enabled: true, rate: POST_OPTIONS.find(o=>o.id===p)?.basePrice||150, qty: 1 };
     });
  }
  
  state.reelsEditingFree = (id === 'reels');

  const isReels = id==='reels';
  const reelWrap = document.getElementById('reelWrap');
  if(reelWrap) reelWrap.style.display = isReels?'block':'none';
  
  renderTypeGrid();
  renderCrewTable();
  renderEquipGrid();
  renderPostOptions();
  if(isReels) updateReelBreakdown();
  updateQuote();
  saveState();
}`;

html = html.replace(selectTypeRegex, newSelectType);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Fixed defaults logic');
