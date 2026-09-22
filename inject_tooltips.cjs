const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

// 1. Update PROJECT_TYPES with descriptions
const typesRegex = /const PROJECT_TYPES = \[([\s\S]*?)\];/;
const newTypes = `const PROJECT_TYPES = [
  {id:'reels',   icon:'📱',name:'Instagram Reels',   ar:'ريلز انستغرام',    range:\`100–250 \${state.currency||"JOD"}\`, crew:['cinematographer'],  pack:true,  reelBased:true, defaultEquip:'basic', defaultPost:['editing'],
   desc:'Short, trendy videos designed for viral reach on social media.', descAr:'فيديوهات قصيرة وعصرية مصممة خصيصاً للانتشار السريع على المنصات.'},
  {id:'interview',icon:'🎙',name:'Interview / Podcast',ar:'مقابلة / بودكاست',range:\`300–800 \${state.currency||"JOD"}\`,   crew:['cinematographer','sound'], defaultEquip:'standard', defaultPost:['editing','graphics'],
   desc:'High-quality filmed dialogues to highlight personalities and stories.', descAr:'جلسات حوارية مصورة بجودة عالية لتسليط الضوء على الشخصيات والقصص.'},
  {id:'corporate',icon:'🏢',name:'Corporate Video',   ar:'فيديو مؤسسي',      range:\`600–2,000 \${state.currency||"JOD"}\`, crew:['director','cinematographer','producer'], defaultEquip:'standard', defaultPost:['editing','colorgrade','graphics'],
   desc:'Professional video reflecting your company\\'s identity and achievements.', descAr:'فيديو احترافي يعكس هوية شركتك، رؤيتها، وإنجازاتها أمام عملائك.'},
  {id:'commercial',icon:'📺',name:'Commercial / TVC', ar:'إعلان تجاري',      range:\`800–4,000 \${state.currency||"JOD"}\`, crew:['director','cinematographer','producer','gaffer','art_director'], defaultEquip:'pro', defaultPost:['editing','colorgrade','sound_design','motion'],
   desc:'High-end creative ad for TV and campaigns to boost sales.', descAr:'إعلان إبداعي عالي الجودة مخصص للحملات الإعلانية لزيادة المبيعات.'},
  {id:'documentary',icon:'🎥',name:'Documentary',     ar:'فيلم وثائقي',       range:\`600–3,000 \${state.currency||"JOD"}\`, crew:['director','cinematographer','sound','location_scout'], defaultEquip:'standard', defaultPost:['editing','colorgrade','subtitles'],
   desc:'Deep, cinematic storytelling to immortalize events or figures.', descAr:'سرد قصصي عميق وموثق بأسلوب سينمائي لتخليد الأحداث أو الشخصيات.'},
  {id:'shortfilm',icon:'🎞',name:'Short Film',        ar:'فيلم قصير',          range:\`800–3,800 \${state.currency||"JOD"}\`, crew:['director','cinematographer','producer','sound','main_actor'], defaultEquip:'pro', defaultPost:['editing','colorgrade','sound_design'],
   desc:'Full cinematic drama production telling a scripted story.', descAr:'إنتاج سينمائي درامي متكامل يروي قصة مكتوبة بطاقم وممثلين.'},
  {id:'event',   icon:'🎤',name:'Event Coverage',     ar:'تغطية فعالية',       range:\`300–1,500 \${state.currency||"JOD"}\`, crew:['cinematographer','photographer'], defaultEquip:'standard', defaultPost:['editing'],
   desc:'Comprehensive documentation of events and conferences.', descAr:'توثيق شامل وحيوي لفعالياتك ومؤتمراتك لأرشفة اللحظات المهمة.'},
  {id:'photovideo',icon:'📷',name:'Photo + Video',    ar:'صور + فيديو',        range:\`500–2,500 \${state.currency||"JOD"}\`, crew:['cinematographer','photographer','art_director'], defaultEquip:'standard', defaultPost:['editing','colorgrade'],
   desc:'Combined package for both photography and videography needs.', descAr:'حزمة متكاملة تغطي احتياجك من الصور الفوتوغرافية والفيديو في آن واحد.'},
  {id:'realestate', icon:'🏢', name:'Real Estate Tour', ar:'تصوير عقاري ومعماري', range:\`400–1,500 \${state.currency||"JOD"}\`, crew:['cinematographer','photographer'], defaultEquip:'standard', defaultPost:['editing','colorgrade'],
   desc:'Visually appealing tours highlighting architecture and spaces.', descAr:'جولات بصرية جذابة تبرز جماليات العقار والمساحات المعمارية للبيع.'}
];`;
html = html.replace(typesRegex, newTypes);

// 2. Add CSS for Tooltip
const tooltipCSS = `
/* Type Tooltip */
.type-tooltip {
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%) translateY(8px) scale(0.95);
  background: rgba(15, 15, 15, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(212,175,55,0.3);
  color: var(--foreground);
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 11px;
  line-height: 1.6;
  width: max-content;
  max-width: 220px;
  text-align: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  z-index: 100;
  pointer-events: none;
  box-shadow: 0 10px 25px rgba(0,0,0,0.6);
  white-space: normal;
}
.type-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px;
  border-style: solid;
  border-color: rgba(212,175,55,0.3) transparent transparent transparent;
}
.type-card:hover .type-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0) scale(1);
}
@media (max-width: 768px) {
  .type-tooltip {
    display: none; /* Tooltips on hover don't work cleanly on touch devices */
  }
}
`;
if(!html.includes('/* Type Tooltip */')) {
  html = html.replace('</style>', tooltipCSS + '\n</style>');
}

// 3. Update renderTypeGrid
const oldRender = `<div class="type-name">\${L(t.ar, t.name)}</div>
    </div>\`).join('');`;
const newRender = `<div class="type-name">\${L(t.ar, t.name)}</div>
      <div class="type-tooltip">\${L(t.descAr, t.desc)}</div>
    </div>\`).join('');`;
html = html.replace(oldRender, newRender);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Tooltips injected successfully.');
