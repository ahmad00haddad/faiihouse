import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Play } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import { clients, portfolio, services } from "@/data/site";
import slide1 from "@/assets/faii/slide1.webp";
import banner from "@/assets/faii/baner.webp";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Faii House — استوديو سينمائي من الأردن" },
      { name: "description", content: "نصنع الأفلام، الإعلانات السينمائية، الوثائقيات والتلوين السينمائي. شركة فَيّ هاوس من إربد، الأردن." },
    ],
  }),
});

function HomePage() {
  const featured = portfolio.slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={slide1} alt="" className="w-full h-full object-cover scale-105" />
          <div className="absolute inset-0 bg-gradient-to-l from-background/40 via-background/70 to-background" />
          <div className="absolute inset-0 bg-fade-bottom" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-32 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8">
            <Reveal>
              <div className="inline-flex items-center gap-3 text-xs tracking-[0.35em] text-primary mb-6">
                <span className="w-10 h-px bg-primary" /> CINEMATIC STUDIO · EST. AMMAN
              </div>
            </Reveal>
            <Reveal delay={120}>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl text-foreground leading-[0.95] text-balance">
                نروي <span className="text-primary">الحكاية</span><br />
                كما تتراءى في مخيّلتنا
              </h1>
            </Reveal>
            <Reveal delay={240}>
              <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
                فَيّ هاوس استوديو إنتاج سينمائي من إربد. نُترجم الأفكار إلى صور تتنفّس،
                وأصوات تترك أثرًا، ولقطات تظلّ في الذاكرة.
              </p>
            </Reveal>
            <Reveal delay={360}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/portfolio" className="group inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-3.5 text-primary-foreground font-medium hover:shadow-glow transition-all">
                  شاهد أعمالنا
                  <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-foreground hover:border-primary hover:text-primary transition-all">
                  <Play size={16} /> ابدأ مشروعك
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-4 hidden lg:block">
            <Reveal delay={500}>
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full" />
                <div className="relative rounded-3xl border border-border bg-surface/60 backdrop-blur-md p-8 shadow-elevated">
                  <div className="text-xs tracking-[0.3em] text-primary mb-2">SHOWREEL</div>
                  <div className="font-display text-4xl text-foreground">2025</div>
                  <p className="mt-3 text-sm text-muted-foreground">آخر أعمال الاستوديو، مجموعة مختارة من المشاريع.</p>
                  <div className="mt-6 grid grid-cols-3 gap-2">
                    {featured.slice(0, 6).map((p) => (
                      <div key={p.title} className="aspect-square rounded-lg overflow-hidden">
                        <img src={p.image} alt="" loading="lazy" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="absolute bottom-8 inset-x-0 flex justify-center text-xs tracking-[0.3em] text-muted-foreground">
          <span className="animate-pulse">SCROLL</span>
        </div>
      </section>

      {/* MARQUEE STATS */}
      <section className="border-y border-border bg-surface/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { n: "+50", l: "مشروع منجز" },
            { n: "+30", l: "علامة تجارية" },
            { n: "+8", l: "سنوات من الإبداع" },
            { n: "100%", l: "شغف بالحرفة" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 80}>
              <div>
                <div className="font-display text-4xl md:text-5xl text-primary">{s.n}</div>
                <div className="mt-2 text-sm text-muted-foreground tracking-wide">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="py-28 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
              <div>
                <div className="text-xs tracking-[0.35em] text-primary mb-3">— WHAT WE DO</div>
                <h2 className="font-display text-4xl md:text-6xl text-foreground">خدماتنا السينمائية</h2>
              </div>
              <Link to="/services" className="text-sm text-primary hover:underline flex items-center gap-1">
                كل الخدمات <ArrowLeft size={14} />
              </Link>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-3xl overflow-hidden">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 60}>
                <div className="group h-full bg-surface p-8 hover:bg-surface-elevated transition-all duration-500">
                  <div className="text-5xl font-display text-primary/40 group-hover:text-primary transition-colors">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mt-4 text-xl text-foreground">{s.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED WORK */}
      <section className="py-28 px-6 lg:px-10 bg-surface/30">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
              <div>
                <div className="text-xs tracking-[0.35em] text-primary mb-3">— SELECTED WORK</div>
                <h2 className="font-display text-4xl md:text-6xl text-foreground">من أعمالنا</h2>
              </div>
              <Link to="/portfolio" className="text-sm text-primary hover:underline flex items-center gap-1">
                المعرض الكامل <ArrowLeft size={14} />
              </Link>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-4">
            {featured.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <div className="group relative aspect-[4/5] rounded-2xl overflow-hidden">
                  <img src={p.image} alt={p.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80" />
                  <div className="absolute bottom-0 inset-x-0 p-6">
                    <div className="text-xs tracking-[0.25em] text-primary mb-1 uppercase">{p.category}</div>
                    <div className="text-lg text-foreground">{p.title}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENTS */}
      <section className="py-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <div className="text-xs tracking-[0.35em] text-primary mb-3">— TRUSTED BY</div>
              <h2 className="font-display text-3xl md:text-5xl text-foreground">شركاء النجاح</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 items-center">
            {clients.map((c, i) => (
              <Reveal key={i} delay={i * 40}>
                <div className="aspect-[3/2] rounded-xl bg-surface border border-border flex items-center justify-center p-6 hover:border-primary/50 transition-all">
                  <img src={c} alt="" loading="lazy" className="max-h-full max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 px-6 lg:px-10 overflow-hidden">
        <div className="absolute inset-0">
          <img src={banner} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <Reveal>
            <h2 className="font-display text-4xl md:text-7xl text-foreground text-balance">
              لديك فكرة؟ <span className="text-primary">لنحوّلها لفيلم.</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              تواصل معنا اليوم ولنبدأ رحلة إنتاج مشروعك السينمائي.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <Link to="/contact" className="mt-10 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-8 py-4 text-primary-foreground font-medium hover:shadow-glow transition-all">
              ابدأ المحادثة <ArrowLeft size={18} />
            </Link>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
