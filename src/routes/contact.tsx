import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import { useSiteContent } from "@/hooks/use-site-content";
import { submitContactMessage } from "@/lib/leads.functions";
import { Mail, MapPin, Phone, Instagram, Facebook, Linkedin, Send, Check } from "lucide-react";

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
    links: [{ rel: "canonical", href: "https://faiihouse.lovable.app/contact" }],
  }),
});

function ContactPage() {
  const { contact } = useSiteContent();
  const submit = useServerFn(submitContactMessage);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [refCode] = useState(() => `FH-${Math.floor(100000 + Math.random() * 900000)}`);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      await submit({ data: form });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذّر الإرسال، حاول مجددًا");
    } finally {
      setSending(false);
    }
  };

  const info = [
    { Icon: MapPin, title: "العنوان", value: contact.address },
    { Icon: Phone, title: "اتصل بنا", value: contact.phone },
    { Icon: Mail, title: "البريد", value: contact.email },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SiteHeader />

      <section className="pt-40 pb-16 px-6 lg:px-10 relative grain">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-xs tracking-[0.4em] text-primary mb-6">— GET IN TOUCH</div>
            <h1 className="font-display leading-[0.95] text-balance" style={{ fontSize: "clamp(3rem, 9vw, 8rem)" }}>
              لنتحدّث عن <span className="text-primary">فكرتك.</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-8 text-lg text-muted-foreground max-w-2xl">
              نحن فريلانسر — متاحون في كل الأوقات. أرسل لنا فكرتك متى ما جاءتك، وسنعود إليك بأقرب وقت.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-28 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-10">
          {/* LEFT — Cinema Ticket */}
          <div className="lg:col-span-2">
            <Reveal>
              <div className="ticket shadow-elevated">
                <div className="flex items-center justify-between mb-5">
                  <div className="font-display text-primary tracking-[0.35em] text-xs">ADMIT ONE</div>
                  <div className="font-display text-xs text-muted-foreground">№ {refCode}</div>
                </div>
                <div className="font-display text-3xl text-foreground mb-2">Faii House</div>
                <div className="text-xs text-muted-foreground tracking-[0.25em]">CINEMATIC PRODUCTION</div>

                <div className="ticket-divider" />

                <div className="space-y-5">
                  {info.map(({ Icon, title, value }) => (
                    <div key={title} className="group flex items-start gap-4">
                      <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        <Icon size={16} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] tracking-[0.3em] text-primary mb-1">{title}</div>
                        <div className="text-foreground text-sm break-words" dir="ltr">{value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="ticket-divider" />

                <div className="flex items-center justify-between">
                  <div className="text-[10px] tracking-[0.3em] text-muted-foreground">FOLLOW</div>
                  <div className="flex gap-2">
                    {[
                      { Icon: Instagram, href: contact.instagram, label: "Instagram" },
                      { Icon: Facebook, href: contact.facebook, label: "Facebook" },
                      { Icon: Linkedin, href: contact.linkedin, label: "LinkedIn" },
                    ].map(({ Icon, href, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-foreground/80 hover:text-primary hover:border-primary hover:rotate-12 transition-all"
                      >
                        <Icon size={14} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* RIGHT — Form or Success */}
          <div className="lg:col-span-3">
            <Reveal delay={150}>
              {sent ? (
                <div className="ticket shadow-elevated relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Check size={28} strokeWidth={3} />
                    </div>
                    <div>
                      <div className="font-display text-primary text-xs tracking-[0.35em]">MESSAGE RECEIVED</div>
                      <div className="font-display text-3xl text-foreground">استلمنا رسالتك</div>
                    </div>
                  </div>
                  <div className="ticket-divider" />
                  <p className="text-muted-foreground leading-relaxed">
                    شكرًا لتواصلك مع فَيّ. سنراجع رسالتك ونعود لك في أقرب وقت ممكن — عادةً خلال 24 ساعة.
                  </p>
                  <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                    <div>الرقم المرجعي</div>
                    <div className="font-display text-primary tracking-widest">{refCode}</div>
                  </div>
                  <button
                    onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); }}
                    className="mt-6 text-sm text-primary hover:underline"
                  >
                    إرسال رسالة أخرى ←
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="p-8 md:p-10 rounded-3xl bg-surface border border-border shadow-elevated">
                  <div className="flex items-center justify-between mb-8">
                    <div className="text-xs tracking-[0.35em] text-primary">— NEW MESSAGE</div>
                    <div className="text-[10px] tracking-[0.3em] text-muted-foreground">TAKE ONE</div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="field">
                      <input
                        id="c-name"
                        placeholder=" "
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                      <label htmlFor="c-name">الاسم</label>
                    </div>
                    <div className="field">
                      <input
                        id="c-email"
                        type="email"
                        placeholder=" "
                        required
                        dir="ltr"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                      <label htmlFor="c-email">البريد الإلكتروني</label>
                    </div>
                  </div>

                  <div className="field mt-5">
                    <textarea
                      id="c-msg"
                      placeholder=" "
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                    <label htmlFor="c-msg">رسالتك</label>
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="relative mt-8 inline-flex items-center gap-3 rounded-full bg-gradient-primary px-8 py-4 text-primary-foreground font-medium hover:shadow-glow transition-all disabled:opacity-70 overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-primary-foreground/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                    <span className="relative">{sending ? "جارٍ الإرسال..." : "إرسال الرسالة"}</span>
                    <Send size={16} className="relative" />
                  </button>

                  {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
