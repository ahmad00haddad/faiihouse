import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import SplitText from "@/components/SplitText";
import { useSiteContent } from "@/hooks/use-site-content";
import banner from "@/assets/faii/baner.webp";
import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "عن فَيّ — Faii House" },
      { name: "description", content: "فَيّ هاوس — شركة إنتاج سينمائي من إربد. قصة، رؤية، وأصدقاء يصنعون الصورة." },
      { property: "og:title", content: "عن فَيّ — Faii House" },
      { property: "og:description", content: "فَيّ هاوس — شركة إنتاج سينمائي من إربد. قصة، رؤية، وأصدقاء يصنعون الصورة." },
      { property: "og:url", content: "https://faiihouse.lovable.app/about" },
    ],
    links: [{ rel: "canonical", href: "https://faiihouse.lovable.app/about" }],
  }),
});

function ManifestoParagraph({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let rafId: number;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const start = vh * 0.9;
        const end = vh * 0.2;
        const raw = (start - rect.top) / (start - end);
        setProgress(Math.min(1, Math.max(0, raw)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const words = text.split(/(\s+)/);
  const totalWords = words.filter((w) => !/^\s+$/.test(w)).length;
  const activeCount = Math.floor(progress * totalWords);
  let wordIdx = 0;

  return (
    <p ref={ref} className="text-xl md:text-3xl leading-relaxed font-display text-foreground/40">
      {words.map((w, i) => {
        if (/^\s+$/.test(w)) return <span key={i}>{w}</span>;
        const on = wordIdx < activeCount;
        wordIdx++;
        return (
          <span
            key={i}
            style={{
              color: on ? "var(--foreground)" : undefined,
              transition: "color 0.4s var(--ease-cinematic)",
            }}
          >
            {w}
          </span>
        );
      })}
    </p>
  );
}

function AboutPage() {
  const { about } = useSiteContent();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SiteHeader />

      {/* Scene 1 + 2 — Overture merged with Manifesto */}
      <section className="relative pt-28 pb-16 px-6 lg:px-10 grain vignette overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={banner} alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto w-full">
          <Reveal>
            <div className="text-xs tracking-[0.4em] text-primary mb-5">— SCENE 01 · OVERTURE</div>
          </Reveal>
          <h1 className="font-display leading-[1.15] text-balance text-3xl md:text-5xl max-w-3xl">
            <SplitText text="مجموعة أصدقاء" as="span" className="inline" />{" "}
            <SplitText text="ورؤية واحدة." as="span" className="inline text-primary" delay={200} />
          </h1>

          <div className="mt-12 h-px w-full bg-border" />

          <Reveal delay={300}>
            <div className="mt-12 mb-6 text-xs tracking-[0.4em] text-primary">— SCENE 02 · MANIFESTO</div>
          </Reveal>
          <ManifestoParagraph text={about.body} />
        </div>
      </section>

      {/* Kinetic strip */}
      <div className="kinetic-strip">
        <div className="kinetic-strip-track">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i}>
              CINEMATIC · <span className="solid">FAII</span> · IRBID · STORY · <span className="solid">2026</span> ·{" "}
            </span>
          ))}
        </div>
      </div>

      {/* Scene 3 — Two Pillars */}
      <section className="relative py-20 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-xs tracking-[0.4em] text-primary mb-10">— SCENE 03 · TWO PILLARS</div>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { num: "01", label: "OUR GOALS", title: "أهدافنا", body: about.goals },
              { num: "02", label: "OUR AMBITION", title: "طموحاتنا", body: about.ambition },
            ].map((p, i) => (
              <Reveal key={p.num} delay={i * 150}>
                <div className="grain-card relative p-7 md:p-9 h-full rounded-2xl border border-border transition-transform duration-500 hover:-translate-y-1">
                  <div
                    className="font-display leading-none absolute top-5 left-6 select-none pointer-events-none"
                    style={{ fontSize: "3.75rem", color: "transparent", WebkitTextStroke: "1px var(--primary)", opacity: 0.3 }}
                  >
                    {p.num}
                  </div>
                  <div className="relative z-10">
                    <div className="text-xs tracking-[0.35em] text-primary mb-3">— {p.label}</div>
                    <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">{p.title}</h2>
                    <p className="text-muted-foreground leading-relaxed text-base whitespace-pre-line">{p.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Scene 4 — Signature CTA */}
      <section className="relative py-20 px-6 lg:px-10 border-t border-border overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative">
          <Reveal>
            <div className="text-xs tracking-[0.4em] text-primary mb-6">— SCENE 04 · CUT TO YOU</div>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="font-display leading-[1.1] text-foreground text-balance text-4xl md:text-6xl">
              دورك <span className="text-primary">الآن.</span>
            </h2>
          </Reveal>
          <Reveal delay={280}>
            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
              مشروعك القادم يستحق قصة تُروى كما يجب — لنبدأ.
            </p>
          </Reveal>
          <Reveal delay={420}>
            <Link
              to="/contact"
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-gradient-primary px-8 py-4 text-primary-foreground font-medium hover:shadow-glow transition-all group"
            >
              <span>لنبدأ محادثة</span>
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
          </Reveal>
        </div>
      </section>


      <SiteFooter />
    </div>
  );
}
