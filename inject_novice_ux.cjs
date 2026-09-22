const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

// 1. UPDATE ROLES HINTS
html = html.replace(/hintAr:'رؤية المشروع\. يدير الأداء الفني ويوجه الممثلين والطاقم لضمان خروج الفيديو بأفضل شكل\.'/g, "hintAr:'يضمن خروج الفيديو كقصة احترافية ويدير أداء الممثلين.'");
html = html.replace(/hintAr:'صانع الصورة\. مسؤول عن حركة الكاميرا، زوايا التصوير، واللمسة السينمائية\.'/g, "hintAr:'يتحكم بالكاميرا ليضمن خروج الصورة بأجمل شكل سينمائي جذاب.'");
html = html.replace(/hintAr:'المايسترو\. يدير ميزانية المشروع، المواعيد، وتنسيق كافة التفاصيل اللوجستية لضمان سير العمل\.'/g, "hintAr:'المدير اللوجستي الذي يحل المشاكل في الموقع لتجلس أنت وترتاح.'");
html = html.replace(/hintAr:'الداعم الأساسي لسرعة التصوير\. يتأكد من وضوح الفوكس \(التركيز\) وتجهيز العدسات\.'/g, "hintAr:'يضمن وضوح الصورة (الفوكس) لتجنب إعادة اللقطات وتضييع وقتك.'");
html = html.replace(/hintAr:'مهندس الظلال والضوء\. يضيف العمق والمزاج للقطات لتجنب الصورة المسطحة أو الباهتة\.'/g, "hintAr:'الإضاءة هي سر السينما؛ هو من يمنع صورتك من أن تبدو باهتة.'");
html = html.replace(/hintAr:'لأن 50% من جودة الفيديو هي الصوت\. يضمن نقاء الحوار وعزل الضوضاء\.'/g, "hintAr:'لأن 50% من جودة الفيديو هي الصوت. يضمن نقاء الحوار وعزل الضوضاء.'"); // keep
html = html.replace(/hintAr:'لتوثيق اللحظات بصور عالية الدقة لاستخدامها في الحملات الإعلانية والسوشيال ميديا\.'/g, "hintAr:'توثيق عالي الدقة جاهز للاستخدام المباشر في السوشيال ميديا.'");
html = html.replace(/hintAr:'نقل آمن وسريع للطاقم والمعدات بين مواقع التصوير لتجنب تأخير جدول العمل\.'/g, "hintAr:'نقل سريع للطاقم والمعدات بين المواقع لتوفير وقت التصوير.'");
html = html.replace(/hintAr:'مهندس الجماليات\. مسؤول عن تصميم الديكور، الألوان، وتوفير الإكسسوارات لتناسب رؤية العمل\.'/g, "hintAr:'يصمم الديكور والألوان والخلفيات لتناسب هوية علامتك التجارية.'");

// Inject Role Hints into Table HTML
const roleHTMLRegex = /<div class="role-name">(\$\{depWarn\}\$\{r\.name\} \/ \$\{r\.ar\})<\/div>/;
html = html.replace(roleHTMLRegex, `<div class="role-name">$1</div><div class="role-hint" style="font-size:10px; color:var(--text3); margin-top:4px; line-height:1.4;">\${L(r.hintAr, r.hint)}</div>`);

// 2. UPDATE EQUIPMENT BADGES & DESCRIPTIONS
const equipRegex = /const EQUIPMENT_TIERS = \[([\s\S]*?)\];/;
const newEquip = `const EQUIPMENT_TIERS = [
  {id:'none', tier:'None', tierAr:'بدون', name:'No Equipment', nameAr:'مقدمة من العميل', items:'Client provided', itemsAr:'مقدمة من طرف العميل', price:0, badge:'', badgeAr:''},
  {id:'basic',   tier:'Basic',    tierAr:'أساسي',    name:'Standard Setup',    nameAr:'إعداد قياسي',     items:'Sony FX3/A7SIII', itemsAr:'كاميرا Sony وعدسات وإضاءة بسيطة', price:100, badge:'Ideal for Social Media 📱', badgeAr:'مثالي للسوشيال ميديا 📱'},
  {id:'standard',tier:'Standard', tierAr:'قياسي',    name:'Full Camera Kit',   nameAr:'طقم كاميرا كامل', items:'Multiple Lenses + Lighting', itemsAr:'معدات إضاءة متكاملة وصوت نقي', price:200, badge:'Corporate & Interviews 🏢', badgeAr:'للشركات والمقابلات 🏢'},
  {id:'pro',     tier:'Pro',      tierAr:'احترافي',  name:'Cinema Package',    nameAr:'باقة سينمائية',   items:'Cinema Camera + Drone', itemsAr:'معدات ضخمة وحركة كاميرا احترافية', price:350, badge:'TV Quality 📺', badgeAr:'جودة إعلانات التلفزيون 📺'},
  {id:'red',     tier:'Premium',  tierAr:'بريميوم',  name:'RED / ALEXA Kit',   nameAr:'طقم RED / ALEXA', items:'RED Camera + Studio Gear', itemsAr:'أعلى كاميرات السينما العالمية (رد / ألكسا)', price:550, badge:'Netflix Standard 🍿', badgeAr:'جودة سينما عالمية 🍿'}
];`;
html = html.replace(equipRegex, newEquip);

// Inject Badge into Equipment Render
const equipRenderRegex = /<div class="equip-name">(\$\{L\(e\.nameAr, e\.name\)\})<\/div>/;
html = html.replace(equipRenderRegex, `$1<div style="margin-top:6px; margin-bottom:2px; font-size:10px; color:var(--gold); font-weight:600; padding:2px 0;">\${e.badgeAr ? L(e.badgeAr, e.badge) : ''}</div>`);
// Note: removing the duplicate wrap for equip-name since I captured $1. Wait, let me replace it correctly:
html = html.replace(/<div class="equip-tier">\$\{L\(e\.tierAr, e\.tier\)\}<\/div>/, 
`<div class="equip-tier">\${L(e.tierAr, e.tier)}</div>\${e.badgeAr ? \`<div style="font-size:10px; color:var(--gold); font-weight:700; margin:4px 0 6px; padding:2px 8px; background:rgba(212,175,55,0.1); border-radius:4px; display:inline-block;">\${L(e.badgeAr, e.badge)}</div>\` : ''}`);

// 3. UPDATE POST-PRODUCTION DESCRIPTIONS
html = html.replace(/descAr:'قص، مزامنة، موسيقى، تصحيح لون'/g, "descAr:'قص وتجميع اللقطات لاختيار الأفضل وبناء القصة.'");
html = html.replace(/descAr:'تصحيح سينمائي كامل — DaVinci Resolve'/g, "descAr:'نقلة نوعية تجعل ألوان الفيديو تبدو كفيلم سينمائي.'");
html = html.replace(/descAr:'تسجيل تعليق صوتي عربي\/إنجليزي'/g, "descAr:'تسجيل صوت احترافي يروي قصة إعلانك بأسلوب مقنع.'");
html = html.replace(/descAr:'عناوين متحركة وتأثيرات'/g, "descAr:'تحريك النصوص والشعارات لشرح الأفكار بصرياً.'");
html = html.replace(/descAr:'مكس صوتي كامل، مؤثرات، ترخيص'/g, "descAr:'إضافة مؤثرات وموسيقى تزيد من حماس واندماج المشاهد.'");

// 4. THE TRUST BANNER & 5. THE RAW FOOTAGE WARNING
const step3TitleRegex = /<h2 class="en-only">Crew<\/h2>[\s\S]*?<\/div>/;
html = html.replace(step3TitleRegex, `$&
    <div id="trust-banner" style="background: rgba(46, 204, 113, 0.08); border: 1px solid rgba(46, 204, 113, 0.2); color: #2ecc71; padding: 12px 16px; border-radius: 8px; font-size: 12px; margin-bottom: 20px; display: none; line-height: 1.5;">
      ✨ <span id="trust-banner-text"></span>
    </div>`);

const selectTypeFooterRegex = /const isReels = id==='reels';/;
html = html.replace(selectTypeFooterRegex, `const isReels = id==='reels';
  const trustBanner = document.getElementById('trust-banner');
  const typeName = L(type.ar, type.name);
  if(trustBanner) {
    trustBanner.style.display = 'block';
    document.getElementById('trust-banner-text').textContent = L(\`بناءً على اختيارك لمشروع (\${typeName})، قمنا بتحديد الطاقم والمعدات الموصى بها لضمان أفضل نتيجة لك. يمكنك التعديل كما تشاء.\`, \`Based on your selection (\${typeName}), we've pre-selected the optimal crew and equipment. Feel free to adjust.\`);
  }`);

const step5BottomRegex = /<div class="step-nav-btns">/;
html = html.replace(step5BottomRegex, `
    <div id="warn-editing-container" style="background: rgba(231, 76, 60, 0.08); border: 1px solid rgba(231, 76, 60, 0.2); color: #e74c3c; padding: 12px 16px; border-radius: 8px; font-size: 12px; margin-bottom: 20px; display: none; line-height: 1.5; font-weight: 500;">
      ⚠️ <span class="ar-only">تنبيه: سيتم تسليمك المادة الخام غير منتجة (Raw Footage) لأنك لم تقم باختيار المونتاج.</span>
      <span class="en-only">Warning: You will receive unedited raw footage since Video Editing is not selected.</span>
    </div>
    $&`);

const updateQuotePostRegex = /document\.getElementById\('discountPct'\)\.textContent = L\(q\.discountLabelAr, q\.discountLabel\);/;
html = html.replace(updateQuotePostRegex, `$&
  
  // Update Editing Warning
  const warnEdit = document.getElementById('warn-editing-container');
  if(warnEdit) {
    const isEditingEnabled = state.post['editing']?.enabled || state.reelsEditingFree;
    warnEdit.style.display = isEditingEnabled ? 'none' : 'block';
  }`);


fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Injected Novice UX updates successfully');
