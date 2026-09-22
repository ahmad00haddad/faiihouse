const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

// 1. Add Tooltip CSS
const styleTagEnd = '</style>';
const tooltipCSS = `
/* Micro-interaction: Tooltips for Roles */
.hint-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px; height: 14px;
  border-radius: 50%;
  background: rgba(212,175,55,0.15);
  color: var(--gold);
  font-size: 10px;
  font-weight: bold;
  margin-right: 6px;
  margin-left: 6px;
  cursor: help;
  position: relative;
  transition: all 0.3s ease;
}
.hint-icon:hover {
  background: var(--gold);
  color: var(--background);
  transform: scale(1.1);
}
.hint-tooltip {
  position: absolute;
  bottom: 150%;
  right: 50%;
  transform: translateX(50%) translateY(5px);
  width: max-content;
  max-width: 220px;
  background: var(--surface-elevated);
  border: 1px solid rgba(212,175,55,0.3);
  padding: 10px 12px;
  border-radius: 6px;
  color: var(--foreground);
  font-size: 11px;
  font-weight: 500;
  line-height: 1.5;
  text-align: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 100;
  box-shadow: 0 8px 16px rgba(0,0,0,0.4);
  pointer-events: none;
}
.hint-icon:hover .hint-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(50%) translateY(0);
}
.hint-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  right: 50%;
  transform: translateX(50%);
  border-width: 5px;
  border-style: solid;
  border-color: var(--surface-elevated) transparent transparent transparent;
}
`;
html = html.replace(styleTagEnd, tooltipCSS + '\n' + styleTagEnd);

// 2. Update ROLES array with hints
const oldRolesRegex = /const ROLES = \[[\s\S]*?\];/;
const newRoles = `const ROLES = [
  {id:'director',       name:'Director',                ar:'مخرج',                rate:200, hint:'Vision of the project. Directs performance to ensure the best outcome.', hintAr:'رؤية المشروع. يدير الأداء الفني ويوجه الممثلين والطاقم لضمان خروج الفيديو بأفضل شكل.'},
  {id:'cinematographer',name:'Cinematographer / DOP',   ar:'مصور سينمائي',        rate:200, hint:'The visual creator. Responsible for camera movement, angles, and the cinematic touch.', hintAr:'صانع الصورة. مسؤول عن حركة الكاميرا، زوايا التصوير، واللمسة السينمائية.'},
  {id:'producer',       name:'Producer',                ar:'منتج',                rate:150, hint:'The Maestro. Manages budget, schedule, and logistics to ensure smooth execution.', hintAr:'المايسترو. يدير ميزانية المشروع، المواعيد، وتنسيق كافة التفاصيل اللوجستية لضمان سير العمل.'},
  {id:'cam_assistant',  name:'Camera Assistant / AC',   ar:'مساعد كاميرا',        rate:100, hint:'Essential for shooting speed. Pulls focus and preps lenses.', hintAr:'الداعم الأساسي لسرعة التصوير. يتأكد من وضوح الفوكس (التركيز) وتجهيز العدسات.'},
  {id:'gaffer',         name:'Gaffer',                  ar:'مضيء',                rate:150, hint:'Master of shadows and light. Adds depth and mood to avoid flat images.', hintAr:'مهندس الظلال والضوء. يضيف العمق والمزاج للقطات لتجنب الصورة المسطحة أو الباهتة.'},
  {id:'sound',          name:'Sound / Boom Operator',   ar:'مشغل صوت',            rate:100, hint:'50% of video quality is sound. Ensures crisp dialogue and noise isolation.', hintAr:'لأن 50% من جودة الفيديو هي الصوت. يضمن نقاء الحوار وعزل الضوضاء.'},
  {id:'photographer',   name:'Photographer',            ar:'مصور فوتوغرافي',      rate:200, hint:'Captures high-res moments for campaigns and social media.', hintAr:'لتوثيق اللحظات بصور عالية الدقة لاستخدامها في الحملات الإعلانية والسوشيال ميديا.'},
  {id:'driver',         name:'Driver / Transportation', ar:'سائق',               rate:50,  hint:'Safe and fast transport for crew and equipment between locations.', hintAr:'نقل آمن وسريع للطاقم والمعدات بين مواقع التصوير لتوفير الوقت والجهد.'},
  {id:'art_director',   name:'Art Director',            ar:'مدير فني',            rate:100, hint:'Aesthetics engineer. Responsible for set design, colors, and props.', hintAr:'مهندس الجماليات. مسؤول عن الديكور، الألوان، الأزياء، وشكل المكان أمام الكاميرا.'},
  {id:'voiceover_talent',name:'Voice Over Artist',      ar:'مؤدي صوتي',          rate:75,  hint:'Professional voice telling your brand\\'s story with an impactful tone.', hintAr:'صوت احترافي يروي قصة علامتك التجارية ويوصل رسالتك بنبرة مؤثرة.'},
  {id:'preprod',        name:'Pre-Production',          ar:'ما قبل الإنتاج',      rate:100, hint:'Planning phase: scripting, storyboarding, and scheduling to avoid surprises.', hintAr:'مرحلة التخطيط المسبق، تشمل كتابة السيناريو، الستوري بورد، وجدولة التصوير لتجنب المفاجآت.'},
  {id:'location_scout', name:'Location Scouting',       ar:'اختيار موقع',        rate:150, hint:'Finding the best locations for the story and securing permits.', hintAr:'البحث عن أفضل الأماكن التي تناسب قصة الفيديو واستخراج التصاريح اللازمة.'},
  {id:'casting',        name:'Casting',                 ar:'اختيار ممثلين',      rate:200, hint:'Auditioning and selecting the best faces to represent your brand.', hintAr:'البحث واختبار الأداء لاختيار أفضل الوجوه التي تمثل علامتك التجارية.'},
  {id:'actor',          name:'Actor/Actress',           ar:'ممثل/ممثلة',         rate:50,  hint:'The faces that will deliver the message and interact with the product.', hintAr:'الوجوه التي ستنقل رسالة الفيديو وتتفاعل مع المنتج أو الخدمة.'},
];`;
html = html.replace(oldRolesRegex, newRoles);

// 3. Update renderCrewTable to inject the tooltips
const oldCrewName = `<div class="role-name">\${L(r.ar, r.name)}</div>`;
const newCrewName = `<div class="role-name" style="display:flex; align-items:center;">
          \${L(r.ar, r.name)}
          \${r.hint ? \`<span class="hint-icon">?<span class="hint-tooltip">\${L(r.hintAr, r.hint)}</span></span>\` : ''}
        </div>`;
html = html.replace(oldCrewName, newCrewName); // Note: Since renderCrewTable is rendered via a loop, replacing the template literal directly is sufficient.

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Added tooltips for all roles.');
