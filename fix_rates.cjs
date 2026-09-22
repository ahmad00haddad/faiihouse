const fs = require('fs');
let html = fs.readFileSync('public/quote-builder/index.html', 'utf8');

// 1. Update Art Director Rate
html = html.replace(`id:'art_director',   name:'Art Director',            ar:'مدير فني',            rate:100,`,
                    `id:'art_director',   name:'Art Director',            ar:'مدير فني',            rate:150,`);

// 2. Split Actor into Main and Extra
const oldActorFull = `{id:'actor',          name:'Actor/Actress',           ar:'ممثل/ممثلة',         rate:50,  hint:'The faces that will deliver the message and interact with the product.', hintAr:'الوجوه التي ستنقل رسالة الفيديو وتتفاعل مع المنتج أو الخدمة.'},`;
const newActorFull = `{id:'main_actor',     name:'Main Actor',              ar:'ممثل رئيسي',         rate:150, hint:'Professional talent to deliver dialogue and lead the story.', hintAr:'ممثل محترف لأداء الحوارات وقيادة قصة الإعلان وجذب انتباه المشاهد.'},
  {id:'extra_actor',    name:'Extras / Background',     ar:'مؤدي ثانوي (كومبارس)',rate:50,  hint:'Background talent to fill the scene and add natural life.', hintAr:'أشخاص لملء خلفية المشهد وإضافة حيوية وواقعية لبيئة التصوير.'},`;

html = html.replace(oldActorFull, newActorFull);

fs.writeFileSync('public/quote-builder/index.html', html);
console.log('Fixed actor and art director pricing');
