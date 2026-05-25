import { createFileRoute } from "@tanstack/react-router";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";

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
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="pt-40 pb-20 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-xs tracking-[0.35em] text-primary mb-4">— ABOUT US</div>
            <h1 className="font-display text-5xl md:text-7xl text-foreground leading-tight text-balance">
              فريق وأصدقاء من إربد، <br />
              <span className="text-primary">شغفنا واحد</span> — السينما.
            </h1>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-3xl">
              فَيّ هاوس شركة إنتاج سينمائي من إربد. لسنا استوديو تقليدي — نحن
              مجموعة من الأصدقاء، شباب يجمعنا حبّ الصورة والحكاية، نعمل معًا
              كفريق متكامل من المرحلة الأولى للفكرة وحتى تسليم اللقطة الأخيرة،
              لنُنجز كل مشروع على أكمل وجه.
            </p>
          </Reveal>
          <Reveal delay={280}>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-3xl">
              ما يميّزنا هو هذا الترابط — أصدقاء قبل أن نكون زملاء عمل، نعشق ما
              نفعله، ونعامل كل مشروع كأنّه فيلمنا الأول.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-10 border-y border-border bg-surface/30">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <Reveal>
            <div className="text-xs tracking-[0.35em] text-primary mb-3">— OUR GOALS</div>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4">أهدافنا</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              أن نقدّم محتوى سينمائي عربي بمعايير عالمية، ونرفع سقف الجودة في
              السوق المحلي عبر مشاريع تجمع بين الحرفة العالية والروح الأصيلة.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="text-xs tracking-[0.35em] text-primary mb-3">— OUR AMBITION</div>
            <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4">طموحاتنا</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              أن نصبح من أبرز شركات الإنتاج السينمائي في المنطقة، وأن ندعم الجيل
              الجديد من صنّاع الصورة ليجدوا بيتًا حقيقيًا لمواهبهم.
            </p>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
