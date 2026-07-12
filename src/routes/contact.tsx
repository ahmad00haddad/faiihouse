import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import { useSiteContent } from "@/hooks/use-site-content";
import { Mail, MapPin, Phone, Instagram, Facebook, Linkedin, Send } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "تواصل معنا — Faii House" },
      { name: "description", content: "تواصل مع فَيّ هاوس — شركة الإنتاج السينمائي في إربد، الأردن." },
      { property: "og:title", content: "تواصل معنا — Faii House" },
      { property: "og:description", content: "تواصل مع فَيّ هاوس — شركة الإنتاج السينمائي في إربد، الأردن." },
      { property: "og:url", content: "https://faiihouse.lovable.app/contact" },
    ],
    links: [
      { rel: "canonical", href: "https://faiihouse.lovable.app/contact" },
    ],
  }),
});

function ContactPage() {
  const { contact } = useSiteContent();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `الاسم: ${form.name}\nالبريد: ${form.email}\n\n${form.message}`;
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(
      "رسالة جديدة من موقع فَيّ",
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const info = [
    { Icon: MapPin, title: "العنوان", value: contact.address },
    { Icon: Phone, title: "اتصل بنا", value: contact.phone },
    { Icon: Mail, title: "البريد", value: contact.email },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="pt-40 pb-12 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-xs tracking-[0.35em] text-primary mb-4">— CONTACT</div>
            <h1 className="font-display text-5xl md:text-7xl text-foreground leading-tight text-balance">
              لنتحدّث عن <span className="text-primary">فكرتك.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
              نحن فريلانسر — متاحون في كل الأوقات. أرسل لنا فكرتك متى ما جاءتك،
              وسنرجع لك في أقرب وقت ممكن.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {info.map(({ Icon, title, value }, i) => (
              <Reveal key={title} delay={i * 60}>
                <div className="flex items-start gap-4 p-6 rounded-2xl bg-surface border border-border hover:border-primary/50 transition-all">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="text-sm tracking-[0.2em] text-primary mb-1">{title}</div>
                    <div className="text-foreground" dir="ltr">{value}</div>
                  </div>
                </div>
              </Reveal>
            ))}
            <Reveal delay={240}>
              <div className="flex gap-3 p-6">
                {[
                  { Icon: Instagram, href: contact.instagram, label: "Instagram" },
                  { Icon: Facebook, href: contact.facebook, label: "Facebook" },
                  { Icon: Linkedin, href: contact.linkedin, label: "LinkedIn" },
                ].map(({ Icon, href, label }, i) => (
                  <a key={i} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-foreground/80 hover:text-primary hover:border-primary transition-all">
                    <Icon size={16} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-3">
            <Reveal delay={120}>
              <form onSubmit={onSubmit} className="p-8 md:p-10 rounded-3xl bg-surface border border-border shadow-elevated">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">الاسم</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">البريد الإلكتروني</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary outline-none transition-colors" dir="ltr" />
                  </div>
                </div>
                <div className="mt-5">
                  <label className="block text-sm text-muted-foreground mb-2">رسالتك</label>
                  <textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary outline-none transition-colors resize-none" />
                </div>
                <button type="submit" className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-3.5 text-primary-foreground font-medium hover:shadow-glow transition-all">
                  إرسال <Send size={16} />
                </button>
                {sent && (
                  <p className="mt-4 text-sm text-primary">سيتم فتح بريدك الإلكتروني لإكمال الإرسال.</p>
                )}
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
