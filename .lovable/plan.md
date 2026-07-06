
# خطة التدقيق الشامل — Faii House

هدف الخطة: تنفيذ Audit فعلي (Live + Repo) خلال جولات مُقننة، وتسليم تقرير نهائي واحد يحدد بوضوح: هل الموقع جاهز للنشر؟ وهل جاهز مستقبلاً للتحويل إلى تطبيق موبايل؟ لا يُبدأ بأي تعديل كود قبل موافقتك على التقرير النهائي.

---

## 1) نطاق التدقيق

- **الواجهة الحية:** `/`, `/about`, `/services`, `/portfolio`, `/jobs`, `/contact`, `/admin/login`, `/admin`, `/sitemap.xml`, `/quote-builder/index.html`, صفحة 404.
- **المستودع:** `src/routes/*`, `src/components/*`, `src/data/site.ts`, `src/lib/*.functions.ts` (admin-auth, site-content, upload), `src/integrations/supabase/*`, `src/server.ts`, `public/quote-builder/*`, `wrangler.jsonc`, `vite.config.ts`.
- **الطبقة الخلفية (Lovable Cloud):** جداول `site_content`, `admin_sessions`, سياسات RLS، الـ Storage buckets، الـ Server Functions.

---

## 2) المنهجية (5 مراحل)

1. **فهم المنتج والسياق** — تحديد المستخدم، المهمة الأساسية، الرحلات الحرجة.
2. **مسح استكشافي** — Playwright على 3 مقاسات (375 / 768 / 1440) + Console/Network + مراجعة بنية الكود.
3. **تدقيق محوري تفصيلي** — 6 محاور (§4).
4. **تصنيف وأولوية** — حرج / عالٍ / متوسط / منخفض.
5. **تقرير + Roadmap** — Quick Wins → Pre-Launch → Post-Launch → Mobile-Ready.

كل عيب يُوثَّق ببطاقة موحّدة:
```text
ID | المحور | المكان (ملف:سطر أو URL)
الوصف | خطوات إعادة الإنتاج | الحالي مقابل المتوقع
الأثر | السبب المرجّح | الشدة | الحل المقترح | التقدير
```

---

## 3) المخرجات النهائية

- **A. ملخص تنفيذي** — 5 مخاطر رئيسية + قرار جاهزية النشر + قرار جاهزية الموبايل.
- **B. بطاقات عيوب** مرتبة حسب المحور والشدة.
- **C. لوحة تقييم جاهزية** (UX / Perf / A11y / Security / Ops / Mobile) — درجات + مبررات.
- **D. Phased Roadmap** بخمس مراحل قابلة للتنفيذ.

---

## 4) المحاور الستة — ما سيتم فحصه فعلياً

### المحور 1 — UX/UI
- وضوح CTA في كل صفحة، سلامة الهرمية والاتساق البصري.
- microcopy عربي/RTL، حالات (loading/empty/error) في `useSiteContent`, `admin.index`, `contact form`.
- إمكانية النقر واللمس، ثبات الحركات (SplitText/Reveal/MagneticCursor) على الأجهزة الضعيفة.
- **خطأ Hydration معروف** في الهيرو (نصنع/نروي) — يُوثَّق ضمن هذا المحور.

### المحور 2 — بنية المعلومات والتدفقات
- خريطة صفحات + خريطة رحلة "عميل يريد عرض سعر" ورحلة "متقدم لوظيفة" ورحلة "أدمن يحدّث محتوى".
- كفاءة التنقل موبايل/ديسكتوب، وجود Breadcrumbs، سلامة الروابط الداخلية والخارجية (Behance/Instagram).

### المحور 3 — الأداء + A11y + Responsiveness
- **الأداء:** حجم الـ bundle، تحميل الصور (`.webp/.png` في `src/assets/faii/*`)، LCP في `/`, CLS بسبب الحركات، تكلفة `SmoothScroll (Lenis) + MagneticCursor` على الموبايل.
- **A11y:** بنية العناوين، تباين الألوان في الثيم، `alt`, `aria-label`, focus states، دعم لوحة المفاتيح، `prefers-reduced-motion`.
- **Responsive:** كسور layout عند 375px، حجم الأزرار للمس، طول قوائم `SiteHeader`.

### المحور 4 — المنطق الوظيفي والأمان
- **admin-auth.functions.ts:** كلمة مرور افتراضية `admin12345` — خطر حرج قبل النشر. آلية تخزين التوكن في المتصفح، صلاحية 7 أيام، غياب rate-limit.
- **upload.functions.ts + site-content:** التحقق من نوع/حجم الملفات، تعقيم مدخلات JSON، إشعارات الفشل.
- **Contact form:** هل تُرسل الرسائل فعلياً؟ (mailto/edge fn/webhook) — تحقق من عدم فقد الرسائل.
- **quote-builder:** تحقق مدخلات، حالات edge، حفظ الحالة، مشاركة النتيجة.
- **RLS + GRANTs** على `site_content`, `admin_sessions` عبر `supabase--linter` و `security--get_table_schema`.
- Race conditions في تحديث `site_content` من عدة تبويبات أدمن.

### المحور 5 — جاهزية النشر والإنتاج
- SEO: `head()` في كل route، og:image لكل leaf، sitemap، robots، canonical، JSON-LD.
- المراقبة: `error-capture` + `renderErrorPage` كافيان؟ هل يوجد مسار لجمع الأخطاء client-side؟
- الأسرار: `.env`, `ADMIN_USERNAME/PASSWORD`, مفاتيح Supabase — هل خرجت للـ client bundle؟
- Build/Deploy: نجاح `build:dev`، سلامة `wrangler.jsonc`، توافق مع Cloudflare Workers.
- التوثيق التشغيلي: هل يستطيع مطور جديد التشغيل من README؟

### المحور 6 — جاهزية التحويل للموبايل
- فصل منطق البيانات (`hooks/use-site-content`, `lib/*.functions.ts`) عن الـ presentation.
- إمكانية إعادة استخدام الـ Server Functions كـ API لتطبيق React Native/Expo لاحقاً.
- تقييم design tokens في `styles.css` كأساس لنظام تصميم متعدد المنصات.
- تدفقات hover/scroll-heavy (Lenis, MagneticCursor, marquee) — ما البدائل الملائمة للموبايل؟
- الحكم: **PWA-first** أم **Native rebuild** أم **Hybrid Capacitor wrapper**.

---

## 5) الأدوات والتقنيات المستخدمة أثناء التدقيق

- Playwright headless (375/768/1440) + لقطات لكل صفحة + قياس Web Vitals.
- `supabase--linter`, `security--get_table_schema`, `security--run_security_scan`.
- قراءة `runtime-errors` و `console/network` logs.
- تحليل حجم الحزم عبر build output.
- مراجعة يدوية للكود لرصد coupling وتكرار المسؤوليات.

---

## 6) خارطة الطريق المرحلية (مقترحة — تُحدَّث بعد التدقيق)

| المرحلة | المدة | المحتوى |
|---|---|---|
| **P0 — Security Hotfix** | 24 ساعة | تغيير كلمة الأدمن الافتراضية، مراجعة RLS، إخفاء أي سر مسرَّب |
| **P1 — Quick Wins UX** | 2–3 أيام | إصلاح hydration mismatch، حالات فارغة/خطأ، تباين، A11y أساسي |
| **P2 — Pre-Launch** | 5–7 أيام | أداء (صور/حزم)، SEO كامل، contact form موثوق، monitoring |
| **P3 — Post-Launch Hardening** | 1–2 أسبوع | logging منظم، rate-limit للأدمن، اختبارات دخان، توثيق تشغيلي |
| **P4 — Mobile Readiness** | حسب القرار | فصل طبقات، API عام، design tokens، PWA أو Capacitor |

---

## 7) ما سيحدث بعد موافقتك

1. أنفّذ التدقيق الفعلي (جولات Playwright + قراءة عميقة للكود + Supabase linter).
2. أعود بتقرير واحد مطابق للهيكل أعلاه، مع بطاقات العيوب المرقّمة والقرارَين الحاسمَين (جاهزية النشر / جاهزية الموبايل).
3. تختار أنت المرحلة/العيوب التي نبدأ بها فعلياً، ونفتح جلسة Build لكل دفعة.

---

## هل أبدأ التدقيق بهذا النطاق كما هو، أم تريد:
- توسيعه ليشمل تدقيق محتوى/نسخة عربية؟
- تضييقه لاستبعاد محور معيّن (مثلاً الموبايل الآن)؟
- إعطاء أولوية لمحور محدد يُسلَّم أولاً قبل بقية المحاور؟
