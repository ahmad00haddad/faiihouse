import { createFileRoute, Link } from "@tanstack/react-router";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import BudgetCalculatorWidget from "@/components/BudgetCalculatorWidget";
import { useSiteContent } from "@/hooks/use-site-content";
import { Film, Megaphone, Palette, Camera, Lightbulb, Music, ArrowLeft, type LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = { Film, Megaphone, Palette, Camera, Lightbulb, Music };

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: "خدماتنا — Faii House" },
      { name: "description", content: "إنتاج أفلام قصيرة، إعلانات سينمائية، تلوين، تصوير فوتوغرافي، ورش عمل وموسيقى تصويرية." },
      { property: "og:title", content: "خدماتنا — Faii House" },
      { property: "og:description", content: "إنتاج أفلام قصيرة، إعلانات سينمائية، تلوين، تصوير فوتوغرافي، ورش عمل وموسيقى تصويرية." },
      { property: "og:url", content: "https://faiihouse.lovable.app/services" },
    ],
    links: [
      { rel: "canonical", href: "https://faiihouse.lovable.app/services" },
    ],
  }),
});

function ServicesPage() {
  const { services } = useSiteContent();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="pt-40 pb-16 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-xs tracking-[0.35em] text-primary mb-4">— SERVICES</div>
            <h1 className="font-display text-5xl md:text-7xl text-foreground leading-tight text-balance">
              كل ما تحتاجه <br /><span className="text-primary">تحت سقف واحد.</span>
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl">
              من السيناريو إلى التسليم النهائي — نقدّم خدمة سينمائية متكاملة بمعايير عالمية.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
          {services.map((s, i) => {
            const Icon = iconMap[(s as { icon?: string }).icon ?? "Film"] ?? Film;
            return (
              <Reveal key={s.title} delay={i * 60}>
                <div className="group relative p-10 rounded-3xl border border-border bg-surface hover:bg-surface-elevated transition-all duration-500 overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/15 transition-all" />
                  <div className="relative flex items-start gap-6">
                    <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center text-primary-foreground">
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="font-display text-xs text-primary tracking-[0.3em]">
                        {String(i + 1).padStart(2, "0")} / 06
                      </div>
                      <h2 className="mt-2 text-2xl text-foreground">{s.title}</h2>
                      <p className="mt-3 text-muted-foreground leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="py-20 px-6 lg:px-10 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <BudgetCalculatorWidget />
          </Reveal>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-10 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <h2 className="font-display text-3xl md:text-5xl text-foreground text-balance">
              جاهز لنبدأ المشروع التالي؟
            </h2>
            <Link to="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-3.5 text-primary-foreground font-medium hover:shadow-glow transition-all">
              تواصل معنا <ArrowLeft size={18} />
            </Link>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
