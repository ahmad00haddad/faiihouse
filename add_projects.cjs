const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const oldProjectTypes = `const PROJECT_TYPES = [
  {id:'reels',   icon:'📱',name:'Instagram Reels',   ar:'ريلز انستغرام',    range:\`100–250 \${state.currency||"JOD"}\`, crew:['cinematographer'],  pack:true,  reelBased:true,
   defaultEquip:'basic', defaultPost:['editing']},
  {id:'interview',icon:'🎙',name:'Interview / Podcast',ar:'مقابلة / بودكاست',range:\`300–800 \${state.currency||"JOD"}\`,   crew:['cinematographer','cinematographer2','sound'],
   defaultEquip:'standard', defaultPost:['editing','graphics']},
  {id:'corporate',icon:'🏢',name:'Corporate Video',   ar:'فيديو مؤسسي',      range:\`600–2,000 \${state.currency||"JOD"}\`, crew:['director','cinematographer','sound','cam_assistant','driver']},
  {id:'commercial',icon:'📺',name:'Commercial / TVC', ar:'إعلان تجاري',      range:\`800–4,000 \${state.currency||"JOD"}\`, crew:['director','cinematographer','producer','gaffer','sound','cam_assistant','driver']},
  {id:'documentary',icon:'🎥',name:'Documentary',     ar:'فيلم وثائقي',       range:\`600–3,000 \${state.currency||"JOD"}\`, crew:['director','cinematographer','sound','driver']},
  {id:'shortfilm',icon:'🎞',name:'Short Film',        ar:'فيلم قصير',          range:\`800–3,800 \${state.currency||"JOD"}\`, crew:['director','cinematographer','producer','cam_assistant','gaffer','sound','driver']},
  {id:'event',   icon:'🎤',name:'Event Coverage',     ar:'تغطية فعالية',       range:\`300–1,500 \${state.currency||"JOD"}\`, crew:['cinematographer','sound']},
  {id:'photovideo',icon:'📷',name:'Photo + Video',    ar:'صور + فيديو',        range:\`500–2,500 \${state.currency||"JOD"}\`, crew:['cinematographer','photographer','sound','driver']},
];`;

const newProjectTypes = `const PROJECT_TYPES = [
  {id:'reels',   icon:'📱',name:'Instagram Reels',   ar:'ريلز انستغرام',    range:\`100–250 \${state.currency||"JOD"}\`, crew:['cinematographer'],  pack:true,  reelBased:true,
   defaultEquip:'basic', defaultPost:['editing']},
  {id:'interview',icon:'🎙',name:'Interview / Podcast',ar:'مقابلة / بودكاست',range:\`300–800 \${state.currency||"JOD"}\`,   crew:['cinematographer','sound'],
   defaultEquip:'standard', defaultPost:['editing','graphics']},
  {id:'corporate',icon:'🏢',name:'Corporate Video',   ar:'فيديو مؤسسي',      range:\`600–2,000 \${state.currency||"JOD"}\`, crew:['director','cinematographer','sound','cam_assistant','driver']},
  {id:'commercial',icon:'📺',name:'Commercial / TVC', ar:'إعلان تجاري',      range:\`800–4,000 \${state.currency||"JOD"}\`, crew:['director','cinematographer','producer','gaffer','sound','cam_assistant','driver']},
  {id:'documentary',icon:'🎥',name:'Documentary',     ar:'فيلم وثائقي',       range:\`600–3,000 \${state.currency||"JOD"}\`, crew:['director','cinematographer','sound','driver']},
  {id:'shortfilm',icon:'🎞',name:'Short Film',        ar:'فيلم قصير',          range:\`800–3,800 \${state.currency||"JOD"}\`, crew:['director','cinematographer','producer','cam_assistant','gaffer','sound','driver']},
  {id:'event',   icon:'🎤',name:'Event Coverage',     ar:'تغطية فعالية',       range:\`300–1,500 \${state.currency||"JOD"}\`, crew:['cinematographer','sound']},
  {id:'photovideo',icon:'📷',name:'Photo + Video',    ar:'صور + فيديو',        range:\`500–2,500 \${state.currency||"JOD"}\`, crew:['cinematographer','photographer','sound','driver']},
  
  // NEW PROJECT TEMPLATES
  {id:'musicvideo', icon:'🎸', name:'Music Video', ar:'فيديو كليب موسيقي', range:\`800–3,000 \${state.currency||"JOD"}\`, crew:['director','cinematographer','gaffer','art_director'], defaultEquip:'cinema', defaultPost:['editing','colorgrade']},
  {id:'food', icon:'🍔', name:'Food & Product Promo', ar:'تصوير منتجات وأطعمة', range:\`600–2,000 \${state.currency||"JOD"}\`, crew:['cinematographer','gaffer','art_director'], defaultEquip:'cinema', defaultPost:['editing','colorgrade','sounddesign']},
  {id:'realestate', icon:'🏢', name:'Real Estate Tour', ar:'تصوير عقاري ومعماري', range:\`400–1,500 \${state.currency||"JOD"}\`, crew:['cinematographer','photographer'], defaultEquip:'standard', defaultPost:['editing','colorgrade']},
  {id:'elearning', icon:'📚', name:'E-Learning / Course', ar:'دورات تدريبية', range:\`400–1,500 \${state.currency||"JOD"}\`, crew:['cinematographer','sound'], defaultEquip:'standard', defaultPost:['editing','graphics']},
  {id:'livestream', icon:'🔴', name:'Live Streaming', ar:'بث مباشر لفعالية', range:\`600–2,000 \${state.currency||"JOD"}\`, crew:['director','cinematographer','cam_assistant','sound'], defaultEquip:'advanced', defaultPost:[]},
  {id:'fashion', icon:'👗', name:'Fashion Film', ar:'فيديو أزياء وعروض', range:\`900–3,000 \${state.currency||"JOD"}\`, crew:['director','cinematographer','gaffer','art_director','photographer'], defaultEquip:'cinema', defaultPost:['editing','colorgrade','sounddesign']},
  {id:'motion', icon:'🎨', name:'Motion Graphics', ar:'موشن جرافيك متكامل', range:\`300–1,500 \${state.currency||"JOD"}\`, crew:['preprod','voiceover_talent'], defaultEquip:'basic', defaultPost:['graphics','sounddesign','script']},
  {id:'automotive', icon:'🏎️', name:'Automotive Promo', ar:'فيديو سيارات وحركة', range:\`700–3,000 \${state.currency||"JOD"}\`, crew:['director','cinematographer','sound','driver'], defaultEquip:'advanced', defaultPost:['editing','colorgrade','sounddesign']},
];`;

html = html.replace(oldProjectTypes, newProjectTypes);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Added 8 new project templates.');
