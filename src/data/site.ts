import teamAhmad from "@/assets/faii/team-ahmad.webp";
import teamYman from "@/assets/faii/team-yman.webp";
import teamMotaz from "@/assets/faii/team-motaz.webp";
import teamQais from "@/assets/faii/team-qais.webp";
import teamMasri from "@/assets/faii/team-masri.webp";

import c1 from "@/assets/faii/client1.webp";
import cMouje from "@/assets/faii/client-mouje.webp";
import cSalwa from "@/assets/faii/client-salwa.webp";
import cZawaya from "@/assets/faii/client-zawaya.webp";
import cAbadelah from "@/assets/faii/client-abadelah.webp";
import cTabarak from "@/assets/faii/client-tabarak.webp";
import cNamani from "@/assets/faii/client-namani.webp";
import cCannella from "@/assets/faii/client-cannella.webp";
import cAcai from "@/assets/faii/client-acai.webp";
import cFa from "@/assets/faii/client-fa.webp";
import cMarouf from "@/assets/faii/client-marouf.png";
import cAljamal from "@/assets/faii/client-aljamal.png";
import cAzrar from "@/assets/faii/client-azrar.png";
import cKhanzaid from "@/assets/faii/client-khanzaid.png";
import cMc from "@/assets/faii/client-mc.png";
import cHussein from "@/assets/faii/client-hussein.png";
import cEmsherif from "@/assets/faii/client-emsherif.png";
import cUsaid from "@/assets/faii/client-usaid.png";
import cFadi from "@/assets/faii/client-fadi.png";
import cBidaya from "@/assets/faii/client-bidaya.png";

import pFilm1 from "@/assets/faii/port-film1.webp";
import pFilm2 from "@/assets/faii/port-film2.webp";
import pFilm3 from "@/assets/faii/port-film3.webp";
import pDoc1 from "@/assets/faii/port-doc1.webp";
import pDoc2 from "@/assets/faii/port-doc2.webp";
import pDoc3 from "@/assets/faii/port-doc3.webp";
import pAd1 from "@/assets/faii/port-ad1.webp";
import pAd2 from "@/assets/faii/port-ad2.webp";
import pAd3 from "@/assets/faii/port-ad3.webp";
import pAd4 from "@/assets/faii/port-ad4.webp";
import pAd5 from "@/assets/faii/port-ad5.webp";
import pAcai from "@/assets/faii/port-acai.webp";
import pEzwiti from "@/assets/faii/port-ezwiti.webp";
import pMasri from "@/assets/faii/port-masri.webp";
import pKanana from "@/assets/faii/port-kanana.webp";
import pOmar from "@/assets/faii/port-omar.webp";
import pAser from "@/assets/faii/port-aser.webp";
import p1stFilm from "@/assets/faii/port-1stfilm.webp";

// Team data kept for legacy reasons but no longer rendered on the public site.
export const team = [
  { name: "أحمد", role: "Director / Founder", image: teamAhmad },
  { name: "إيمن", role: "Cinematographer", image: teamYman },
  { name: "معتز", role: "Editor & Colorist", image: teamMotaz },
  { name: "قيس", role: "Sound Designer", image: teamQais },
  { name: "المصري", role: "Producer", image: teamMasri },
];

export type Client = { name: string; image: string };
export const clients: Client[] = [
  { name: "Mouje", image: cMouje },
  { name: "Salwa", image: cSalwa },
  { name: "Zawaya", image: cZawaya },
  { name: "Abadelah", image: cAbadelah },
  { name: "Tabarak", image: cTabarak },
  { name: "Namani", image: cNamani },
  { name: "Cannella", image: cCannella },
  { name: "Acai", image: cAcai },
  { name: "Fa", image: cFa },
  { name: "Client", image: c1 },
  { name: "Marouf", image: cMarouf },
  { name: "Aljamal", image: cAljamal },
  { name: "Azrar", image: cAzrar },
  { name: "Khan Zaid", image: cKhanzaid },
  { name: "MC", image: cMc },
  { name: "Celebrating Al Hussein", image: cHussein },
  { name: "Em Sherif", image: cEmsherif },
  { name: "USAID", image: cUsaid },
  { name: "Fadi", image: cFadi },
  { name: "Bidaya", image: cBidaya },
];

export type PortCategory = "all" | "film" | "documentary" | "ads";

export type PortfolioItem = {
  image: string;
  title: string;
  category: Exclude<PortCategory, "all">;
  behance?: string;
};

export const portfolio: PortfolioItem[] = [
  { image: pFilm1, title: "Short Film — Frame 1", category: "film", behance: "https://www.behance.net/faiihouse" },
  { image: pFilm2, title: "Short Film — Frame 2", category: "film", behance: "https://www.behance.net/faiihouse" },
  { image: pFilm3, title: "Short Film — Frame 3", category: "film", behance: "https://www.behance.net/faiihouse" },
  { image: p1stFilm, title: "First Film", category: "film", behance: "https://www.behance.net/faiihouse" },
  { image: pMasri, title: "Masri", category: "film", behance: "https://www.behance.net/faiihouse" },
  { image: pKanana, title: "Kanana", category: "film", behance: "https://www.behance.net/faiihouse" },
  { image: pOmar, title: "Omar", category: "film", behance: "https://www.behance.net/faiihouse" },
  { image: pAser, title: "Aser", category: "film", behance: "https://www.behance.net/faiihouse" },
  { image: pDoc1, title: "Khan Zaid", category: "documentary", behance: "https://www.behance.net/faiihouse" },
  { image: pDoc2, title: "Documentary Still", category: "documentary", behance: "https://www.behance.net/faiihouse" },
  { image: pDoc3, title: "Documentary Story", category: "documentary", behance: "https://www.behance.net/faiihouse" },
  { image: pAd1, title: "Brand Ad 01", category: "ads", behance: "https://www.behance.net/faiihouse" },
  { image: pAd2, title: "Brand Ad 02", category: "ads", behance: "https://www.behance.net/faiihouse" },
  { image: pAd3, title: "Brand Ad 03", category: "ads", behance: "https://www.behance.net/faiihouse" },
  { image: pAd4, title: "Brand Ad 04", category: "ads", behance: "https://www.behance.net/faiihouse" },
  { image: pAd5, title: "Brand Ad 05", category: "ads", behance: "https://www.behance.net/faiihouse" },
  { image: pAcai, title: "Acai Campaign", category: "ads", behance: "https://www.behance.net/faiihouse" },
  { image: pEzwiti, title: "Ezwiti", category: "ads", behance: "https://www.behance.net/faiihouse" },
];

export const services = [
  { icon: "Film", title: "إنتاج أفلام قصيرة", desc: "حكايات سينمائية تنبض بالحياة، من السيناريو إلى الشاشة." },
  { icon: "Megaphone", title: "إعلانات سينمائية", desc: "إعلانات لا تُنسى، نروي قصة علامتك التجارية بأسلوب سينمائي." },
  { icon: "Palette", title: "تلوين سينمائي", desc: "نمنح صورتك مزاجها وروحها عبر معالجة ألوان احترافية." },
  { icon: "Camera", title: "تصوير فوتوغرافي", desc: "صور تحفظ اللحظة بدقة وجمال يخلّدان التفاصيل." },
  { icon: "Lightbulb", title: "تدريب وورش عمل", desc: "ننقل خبرتنا للجيل القادم من صنّاع الصورة." },
  { icon: "Music", title: "موسيقى وتأثيرات صوتية", desc: "هويّة صوتية أصلية تكمل التجربة البصرية." },
];

export const SHOWREEL_URL = "https://www.youtube.com/watch?v=yB-VOx0gS54";

// Default content shape — used as fallback when no Cloud content has been saved yet
// and as the seed structure for the admin editor.
export type SiteContent = {
  hero: { kicker: string; title1: string; titleHighlight: string; tagline: string; subtitle: string };
  about: { title: string; body: string; goals: string; ambition: string };
  stats: { value: string; label: string }[];
  contact: { phone: string; email: string; address: string; instagram: string; facebook: string; linkedin: string; behance: string };
  showreelUrl: string;
  services: { title: string; desc: string }[];
  portfolio: { image: string; title: string; category: "film" | "documentary" | "ads"; behance: string }[];
  clients: { name: string; image: string }[];
};

export const defaultContent: SiteContent = {
  hero: {
    kicker: "CINEMATIC PRODUCTION · EST. IRBID",
    title1: "نروي",
    titleHighlight: "الحكاية",
    tagline: "كما تتراءى في مخيّلتنا",
    subtitle:
      "فَيّ هاوس — شركة إنتاج سينمائي من إربد، فريق وأصدقاء من الشباب نُترجم الأفكار إلى صور تتنفّس، وأصوات تترك أثرًا، ولقطات تظلّ في الذاكرة.",
  },
  about: {
    title: "مجموعة من الأصدقاء، ورؤية واحدة للسينما.",
    body: "فَيّ هاوس شركة إنتاج سينمائي من إربد — فريق وأصدقاء من الشباب يعشقون الصورة، نعمل معًا كفريق متكامل من المرحلة الأولى للفكرة وحتى تسليم اللقطة الأخيرة. لسنا استوديو تقليدي؛ نحن مجموعة شغوفين بالسينما، نُسخّر شغفنا لإنجاز كل مشروع على أكمل وجه.",
    goals:
      "أن نقدّم محتوى سينمائي عربي بمعايير عالمية، ونرفع سقف الجودة في السوق المحلي عبر مشاريع تجمع بين الحرفة العالية والروح الأصيلة.",
    ambition:
      "أن نصبح من أبرز شركات الإنتاج السينمائي في المنطقة، وأن ندعم الجيل الجديد من صنّاع الصورة ليجدوا بيتًا حقيقيًا لمواهبهم.",
  },
  stats: [
    { value: "+300", label: "مشروع منجز" },
    { value: "+140", label: "علامة تجارية" },
    { value: "+8", label: "سنوات من الإبداع" },
    { value: "100%", label: "شغف بالحرفة" },
  ],
  contact: {
    phone: "+962 79 925 6345",
    email: "faii.house.jo@gmail.com",
    address: "الأردن — إربد",
    instagram: "https://www.instagram.com/faii.house/",
    facebook: "https://www.facebook.com/faii.house.jo",
    linkedin: "https://www.linkedin.com/company/faiihouse/",
    behance: "https://www.behance.net/faiihouse",
  },
  showreelUrl: SHOWREEL_URL,
  services,
  portfolio: portfolio.map((p) => ({ image: p.image, title: p.title, category: p.category, behance: p.behance ?? "https://www.behance.net/faiihouse" })),
  clients,
};
