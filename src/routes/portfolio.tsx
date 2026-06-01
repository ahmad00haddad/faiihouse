import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import { type PortCategory } from "@/data/site";
import { useSiteContent } from "@/hooks/use-site-content";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/portfolio")({
  component: PortfolioPage,
  head: () => ({
    meta: [
      { title: "أعمالنا — Faii House" },
      { name: "description", content: "معرض أعمال فَيّ هاوس — أفلام قصيرة، وثائقيات وإعلانات سينمائية." },
    ],
  }),
});

const filters: { id: PortCategory; label: string }[] = [
  { id: "all", label: "الكل" },
  { id: "film", label: "أفلام قصيرة" },
  { id: "documentary", label: "وثائقيات" },
  { id: "ads", label: "إعلانات" },
];

function PortfolioPage() {
  const { portfolio } = useSiteContent();
  const [active, setActive] = useState<PortCategory>("all");
  const items = useMemo(() => {
    const reversed = [...portfolio].reverse();
    return active === "all" ? reversed : reversed.filter((p) => p.category === active);
  }, [active, portfolio]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="pt-40 pb-12 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-xs tracking-[0.35em] text-primary mb-4">— PORTFOLIO</div>
            <h1 className="font-display text-5xl md:text-7xl text-foreground leading-tight text-balance">
              قصص <span className="text-primary">صنعناها</span> بكاميراتنا.
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl">
              اضغط على أي مشروع لمشاهدة تفاصيله الكاملة على Behance.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-12 flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActive(f.id)}
                  className={`px-5 py-2.5 rounded-full text-sm border transition-all ${
                    active === f.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-foreground/80 hover:text-primary hover:border-primary"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((p, i) => (
              <Reveal key={p.title + i} delay={(i % 6) * 60}>
                <a
                  href={p.behance ?? "https://www.behance.net/faiihouse"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group relative aspect-[4/5] rounded-2xl overflow-hidden bg-surface"
                >
                  <img src={p.image} alt={p.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-90" />
                  <div className="absolute top-4 left-4 w-9 h-9 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all">
                    <ExternalLink size={14} />
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform">
                    <div className="text-xs tracking-[0.25em] text-primary uppercase">{p.category}</div>
                    <div className="mt-1 text-lg text-foreground">{p.title}</div>
                  </div>
                  <div className="absolute top-0 inset-x-0 h-2 film-strip translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-500" />
                  <div className="absolute bottom-0 inset-x-0 h-2 film-strip translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500" />
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
