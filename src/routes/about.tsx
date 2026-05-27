import { createFileRoute } from "@tanstack/react-router";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import { useSiteContent } from "@/hooks/use-site-content";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "عن فَيّ — Faii House" },
      { name: "description", content: "فَيّ هاوس — شركة إنتاج سينمائي من إربد. فريق وأصدقاء يعملون معًا لإنجاز مشاريع تستحقّ أن تُروى." },
    ],
  }),
});

function AboutPage() {
  const { about } = useSiteContent();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="pt-40 pb-20 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-xs tracking-[0.35em] text-primary mb-4">— ABOUT US</div>
            <h1 className="font-display text-5xl md:text-7xl text-foreground leading-tight text-balance">
              {about.title}
            </h1>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-3xl whitespace-pre-line">
              {about.body}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-10 border-y border-border bg-surface/30">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <Reveal>
            <div className="text-xs tracking-[0.35em] text-primary mb-3">— OUR GOALS</div>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4">أهدافنا</h2>
            <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">
              {about.goals}
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="text-xs tracking-[0.35em] text-primary mb-3">— OUR AMBITION</div>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4">طموحاتنا</h2>
            <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">
              {about.ambition}
            </p>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
