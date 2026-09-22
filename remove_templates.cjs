const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

const oldTemplatesBlock = `// NEW PROJECT TEMPLATES
  {id:'musicvideo', icon:'🎸', name:'Music Video', ar:'فيديو كليب موسيقي', range:\`800–3,000 \${state.currency||"JOD"}\`, crew:['director','cinematographer','gaffer','art_director'], defaultEquip:'cinema', defaultPost:['editing','colorgrade']},
  {id:'food', icon:'🍔', name:'Food & Product Promo', ar:'تصوير منتجات وأطعمة', range:\`600–2,000 \${state.currency||"JOD"}\`, crew:['cinematographer','gaffer','art_director'], defaultEquip:'cinema', defaultPost:['editing','colorgrade','sounddesign']},
  {id:'realestate', icon:'🏢', name:'Real Estate Tour', ar:'تصوير عقاري ومعماري', range:\`400–1,500 \${state.currency||"JOD"}\`, crew:['cinematographer','photographer'], defaultEquip:'standard', defaultPost:['editing','colorgrade']},
  {id:'elearning', icon:'📚', name:'E-Learning / Course', ar:'دورات تدريبية', range:\`400–1,500 \${state.currency||"JOD"}\`, crew:['cinematographer','sound'], defaultEquip:'standard', defaultPost:['editing','graphics']},
  {id:'livestream', icon:'🔴', name:'Live Streaming', ar:'بث مباشر لفعالية', range:\`600–2,000 \${state.currency||"JOD"}\`, crew:['director','cinematographer','cam_assistant','sound'], defaultEquip:'advanced', defaultPost:[]},
  {id:'fashion', icon:'👗', name:'Fashion Film', ar:'فيديو أزياء وعروض', range:\`900–3,000 \${state.currency||"JOD"}\`, crew:['director','cinematographer','gaffer','art_director','photographer'], defaultEquip:'cinema', defaultPost:['editing','colorgrade','sounddesign']},
  {id:'motion', icon:'🎨', name:'Motion Graphics', ar:'موشن جرافيك متكامل', range:\`300–1,500 \${state.currency||"JOD"}\`, crew:['preprod','voiceover_talent'], defaultEquip:'basic', defaultPost:['graphics','sounddesign','script']},
  {id:'automotive', icon:'🏎️', name:'Automotive Promo', ar:'فيديو سيارات وحركة', range:\`700–3,000 \${state.currency||"JOD"}\`, crew:['director','cinematographer','sound','driver'], defaultEquip:'advanced', defaultPost:['editing','colorgrade','sounddesign']},`;

const newTemplatesBlock = `// NEW PROJECT TEMPLATES
  {id:'realestate', icon:'🏢', name:'Real Estate Tour', ar:'تصوير عقاري ومعماري', range:\`400–1,500 \${state.currency||"JOD"}\`, crew:['cinematographer','photographer'], defaultEquip:'standard', defaultPost:['editing','colorgrade']},`;

html = html.replace(oldTemplatesBlock, newTemplatesBlock);
fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Removed rejected templates.');
