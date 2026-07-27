# خطة: تحسينات UI بمستوى Awwwards — Faii House

**المبدأ:** لا نعيد التصميم. نضيف طبقات بصرية وحركية على الهوية الحالية (برتقالي/أسود سينمائي، Jeddah/LostSignal، grain/vignette). التركيز على **About** + **Contact/Jobs**، مع لمسات على الرئيسية والهيدر تخدم كل الصفحات.

---

## 1) طبقات عالمية (تخدم كل الصفحات)

**Custom cinematic cursor** — نقطة برتقالية صغيرة + حلقة تتأخر بـ lerp، تتضخّم على الروابط/الأزرار، تتحول لـ "PLAY" على مصغرات الأعمال. مُعطّل على اللمس/`prefers-reduced-motion`. (استبدال أنيق للـ `MagneticCursor` الحالي أو تطويره).

**Section transitions** — بين كل قسمين: شريط رفيع بلون primary يمتد من اليسار لليمين عند دخول القسم (IntersectionObserver + CSS scale-x).

**Scroll-driven counters/typography** — العناوين الضخمة تتحرك أفقيًا ببطء مع السكرول (`translateX` مربوط بـ scroll progress) — إحساس Kinetic بدون مكتبات جديدة.

**Reduced-motion switch** — زر صغير في الفوتر: "تهدئة الحركة" يضبط `data-motion="reduced"` على `<html>`، يوقف الكرسر/السويب/الـ marquee.

---

## 2) صفحة About — إعادة تنسيق سينمائية

الحالة الحالية: عنوانان + فقرتان نص. سنحوّلها إلى **رحلة سينمائية** من 5 مشاهد:

**Scene 1 — Overture (Hero)**
- عنوان ضخم `text-[clamp(4rem,12vw,11rem)]` بأحرف تتحرك واحدًا واحدًا (SplitText الحالي).
- خلفية: صورة سينمائية شبه شفافة + grain + vignette + **frame-count counter** أعلى اليمين ("FRAME 001 / 005") يتغير مع السكرول.
- Marquee عمودي جانبي بكلمات: "CINEMA · STORY · GRAIN · LIGHT · ARBID".

**Scene 2 — Manifesto (Kinetic Text)**
- نص المانيفستو (`about.body`) يظهر كلمة-كلمة مع السكرول عبر scroll-linked opacity (خطوة بخطوة، ليس دفعة واحدة). كل جملة تحتها خط رفيع يرسم نفسه.

**Scene 3 — Two Pillars (أهدافنا / طموحاتنا)**
- شبكة أفقية مقسّمة بخط عمودي متحرك (film-strip). كل عمود عليه رقم عملاق شفاف (`01`, `02`) خلف النص.
- Hover: العمود يميل قليلًا (`transform: perspective + rotateY(2deg)`)، grain يشتد.

**Scene 4 — Timeline "Reel" (جديد)**
- شريط أفلام أفقي متمرّر (drag/scroll snap) بمراحل الشركة: التأسيس → أول عمل → 140+ علامة → اليوم.
- كل بطاقة على شكل frame أفلام (`film-strip` مطبّق حاليًا) مع سنة كبيرة + وصف قصير.
- يُدار من الأدمن (حقل `timeline` جديد في `site_content`).

**Scene 5 — Signature CTA**
- سطر عملاق يتحرّك أفقيًا `مشروعك · القادم · مع فَيّ · مشروعك · القادم` (marquee).
- زر واحد كبير "لنبدأ" مع تأثير swipe عند hover.

---

## 3) صفحة Contact — تجربة أفضل

**Layout جديد:**
- عمود أيسر (2/5): **بطاقة عنوان تفاعلية** بشكل تذكرة سينما (rounded corners مقطوعة، ثقوب perforation) تحمل الإيميل/الهاتف/العنوان — كل سطر يكشف نفسه على hover مع صوت "click" بصري (خط primary يمر تحته).
- عمود أيمن (3/5): **نموذج بخطوة واحدة لكن بحقول متتابعة** — كل حقل يظهر بعد ملء السابق (staggered reveal)، مع عداد "1 / 3" أعلى النموذج.

**Micro-interactions:**
- الحقل النشط: `border` primary + توهج خفيف + label يطفو للأعلى (floating label بحركة سلسة).
- زر الإرسال: يتحول لـ progress bar أثناء الإرسال ثم لـ ✓ عند النجاح، بدل toast بارد.
- بعد النجاح: **شاشة confirmation سينمائية** — بطاقة تذكرة "MESSAGE RECEIVED" مع رقم مرجعي وهمي، بدل السطر النصي الحالي.

**Sidebar روابط اجتماعية:**
- الأيقونات الحالية تصبح دوائر بحواف film-strip دوّارة عند hover.

---

## 4) صفحة Jobs — نفس الفلسفة

**Hero:**
- بدل العنوان الثابت: نص يتبدّل بين وظائف افتراضية `[كاتب إعلانات] / [مصور] / [محرر]` (typewriter)، مع تثبيت "كاتب إعلانات" في النهاية.
- بطاقة الوصف (REMOTE · FREELANCE) تصبح **بطاقة "CASTING CALL"** بأسلوب بوستر فيلم قديم — إطار مزدوج، طوابع vintage، خلفية ورق مطوي.

**نموذج التقديم:**
- بدل الكومة الحالية من الحقول → **stepper بثلاث خطوات** (المعلومات / المهارات / لمستك الخاصة) مع مؤشر تقدم سينمائي (film reel spinning).
- كل خطوة تدخل مع film-cut transition (نفس المكوّن الحالي `PageTransition` معاد استخدامه محليًا).

**Success state:**
- بطاقة "AUDITION SUBMITTED" مع لقطة film clapperboard.

---

## 5) لمسات على الرئيسية (بسيطة، غير مزعجة)

- **Hero Showreel card:** إضافة video preview فعلي بدل الـ 6 مصغرات — عند hover، أول مصغّرة تتحول لـ auto-play muted 4 ثواني ثم تنتقل للتالية.
- **Stats:** خط أفقي رفيع يربط الأرقام الأربعة عند دخول القسم (draws left-to-right).
- **Featured Work cards:** إضافة رقم فيلم `#001, #002...` أعلى اليمين + كود توقيت `00:42:11` أسفل اليسار (تفاصيل editorial).
- **CTA النهائي:** النص العملاق يتبع الماوس بميلان طفيف (`perspective + mouse parallax`).

---

## 6) Admin — دعم المحتوى الجديد

- إضافة تبويب **"Timeline"** لإدارة مشاهد صفحة About (Scene 4).
- إضافة حقل `hero.frameCounterLabel` (اختياري).
- بدون تغيير في auth أو business logic.

---

## أولوية التنفيذ

| # | العنصر | التأثير | الجهد |
|---|---|---|---|
| P0 | About كاملة (5 مشاهد) | ⭐⭐⭐⭐⭐ | كبير |
| P0 | Contact — بطاقة تذكرة + stepped form + success cinematic | ⭐⭐⭐⭐⭐ | متوسط |
| P0 | Jobs — casting call + stepper | ⭐⭐⭐⭐ | متوسط |
| P1 | Custom cinematic cursor + section transitions + reduce-motion | ⭐⭐⭐⭐ | متوسط |
| P1 | Timeline admin + `site_content` migration | ⭐⭐⭐ | صغير |
| P2 | لمسات الرئيسية (Stats line, film numbers, hero video preview) | ⭐⭐⭐ | متوسط |

## تفاصيل تقنية

- **بدون مكتبات جديدة** — نستخدم CSS transforms + `IntersectionObserver` + hooks موجودة. مسموح `framer-motion` فقط لو ضروري (موجود؟ لا — سنبقى على CSS + rAF).
- **RTL-safe:** كل حركة أفقية تحترم `dir="rtl"` (marquee يعكس اتجاهه، swipe transitions تنعكس).
- **Perf:** كل حركة `will-change` فقط أثناء الحركة، `content-visibility: auto` للأقسام السفلية، الصور الجديدة `loading="lazy"` + `LazyImage`.
- **A11y:** كل الحركات تحترم `prefers-reduced-motion` والزر اليدوي في الفوتر. الحقول تحتفظ بـ semantic labels خلف floating labels.
- **Migration:** `site_content` تضاف حقول `timeline` (array) و`hero.frameCounterLabel` — GRANT + RLS متكرر من الأنماط الموجودة.

## معايير القبول

- About تعطي إحساس "قصة تُروى" لا "صفحة معلومات".
- كل زر/حقل في Contact/Jobs يعطي feedback بصري خلال 100ms من التفاعل.
- Lighthouse Performance ≥ 85 على الموبايل بعد التغييرات.
- كل الحركات تختفي كاملة مع `prefers-reduced-motion: reduce`.

---

هل أبدأ من **About** كخطوة أولى، أم تريدني أبني الطبقات العالمية (cursor + transitions) أولًا؟
