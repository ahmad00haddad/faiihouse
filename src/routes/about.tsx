import { createFileRoute } from "@tanstack/react-router";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import { team } from "@/data/site";
import { Instagram, Linkedin } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "عن فَيّ — Faii House" },
      { name: "description", content: "تعرّف على شركة فَيّ هاوس، فريقها، رؤيتها وقصتها في عالم الإنتاج السينمائي." },
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
              مجموعة من الأصدقاء، <br />
              <span className="text-primary">ورؤية واحدة</span> للسينما.
            </h1>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-3xl">
              بدأت فَيّ هاوس من إربد كحلم مشترك بين أصدقاء يعشقون الصورة. اليوم،
              تحوّلنا إلى استوديو متكامل يضمّ مخرجين، مصوّرين، مهندسي صوت ومُلوّنين
              يجمعهم الشغف نفسه: أن نروي قصصًا تستحقّ أن تُروى.
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
              أن نصبح المرجع الأول للإنتاج السينمائي في المنطقة، وأن ندعم الجيل
              الجديد من صنّاع الصورة ليجدوا بيتًا حقيقيًا لمواهبهم.
            </p>
          </Reveal>
        </div>
      </section>

      <section id="team" className="py-28 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-xs tracking-[0.35em] text-primary mb-3">— THE TEAM</div>
              <h2 className="font-display text-4xl md:text-6xl text-foreground">الفريق الذي يصنع الفرق</h2>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {team.map((m, i) => (
              <Reveal key={m.name} delay={i * 80}>
                <div className="group relative aspect-[3/4] rounded-2xl overflow-hidden">
                  <img src={m.image} alt={m.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-5">
                    <div className="text-lg text-foreground">{m.name}</div>
                    <div className="text-xs text-primary tracking-wider mt-1">{m.role}</div>
                    <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href="#" className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground/80 hover:text-primary hover:border-primary"><Instagram size={14} /></a>
                      <a href="#" className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-foreground/80 hover:text-primary hover:border-primary"><Linkedin size={14} /></a>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
