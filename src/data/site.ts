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

export const team = [
  { name: "أحمد", role: "Director / Founder", image: teamAhmad },
  { name: "إيمن", role: "Cinematographer", image: teamYman },
  { name: "معتز", role: "Editor & Colorist", image: teamMotaz },
  { name: "قيس", role: "Sound Designer", image: teamQais },
  { name: "المصري", role: "Producer", image: teamMasri },
];

export const clients = [c1, cMouje, cSalwa, cZawaya, cAbadelah, cTabarak, cNamani, cCannella, cAcai, cFa];

export type PortCategory = "all" | "film" | "documentary" | "ads";

export const portfolio: { image: string; title: string; category: Exclude<PortCategory, "all"> }[] = [
  { image: pFilm1, title: "Short Film — Frame 1", category: "film" },
  { image: pFilm2, title: "Short Film — Frame 2", category: "film" },
  { image: pFilm3, title: "Short Film — Frame 3", category: "film" },
  { image: p1stFilm, title: "First Film", category: "film" },
  { image: pMasri, title: "Masri", category: "film" },
  { image: pKanana, title: "Kanana", category: "film" },
  { image: pOmar, title: "Omar", category: "film" },
  { image: pAser, title: "Aser", category: "film" },
  { image: pDoc1, title: "Khan Zaid", category: "documentary" },
  { image: pDoc2, title: "Documentary Still", category: "documentary" },
  { image: pDoc3, title: "Documentary Story", category: "documentary" },
  { image: pAd1, title: "Brand Ad 01", category: "ads" },
  { image: pAd2, title: "Brand Ad 02", category: "ads" },
  { image: pAd3, title: "Brand Ad 03", category: "ads" },
  { image: pAd4, title: "Brand Ad 04", category: "ads" },
  { image: pAd5, title: "Brand Ad 05", category: "ads" },
  { image: pAcai, title: "Acai Campaign", category: "ads" },
  { image: pEzwiti, title: "Ezwiti", category: "ads" },
];

export const services = [
  { icon: "Film", title: "إنتاج أفلام قصيرة", desc: "حكايات سينمائية تنبض بالحياة، من السيناريو إلى الشاشة." },
  { icon: "Megaphone", title: "إعلانات سينمائية", desc: "إعلانات لا تُنسى، نروي قصة علامتك التجارية بأسلوب سينمائي." },
  { icon: "Palette", title: "تلوين سينمائي", desc: "نمنح صورتك مزاجها وروحها عبر معالجة ألوان احترافية." },
  { icon: "Camera", title: "تصوير فوتوغرافي", desc: "صور تحفظ اللحظة بدقة وجمال يخلّدان التفاصيل." },
  { icon: "Lightbulb", title: "تدريب وورش عمل", desc: "ننقل خبرتنا للجيل القادم من صنّاع الصورة." },
  { icon: "Music", title: "موسيقى وتأثيرات صوتية", desc: "هويّة صوتية أصلية تكمل التجربة البصرية." },
];
