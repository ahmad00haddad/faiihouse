import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import { submitJobApplication } from "@/lib/leads.functions";
import { Briefcase, Send } from "lucide-react";

export const Route = createFileRoute("/jobs")({
  component: JobsPage,
  head: () => ({
    meta: [
      { title: "انضم لنا — Faii House" },
      { name: "description", content: "فرص العمل في فَيّ هاوس — انضم لفريق إنتاج سينمائي شغوف." },
      { property: "og:title", content: "انضم لنا — Faii House" },
      { property: "og:description", content: "فرص العمل في فَيّ هاوس — انضم لفريق إنتاج سينمائي شغوف." },
      { property: "og:url", content: "https://faiihouse.lovable.app/jobs" },
    ],
    links: [
      { rel: "canonical", href: "https://faiihouse.lovable.app/jobs" },
    ],
  }),
});

type FormState = {
  name: string;
  email: string;
  phone: string;
  location: string;
  start_when: string;
  portfolio_url: string;
  why: string;
  skills: string;
  edge: string;
};

const blank: FormState = {
  name: "", email: "", phone: "", location: "", start_when: "",
  portfolio_url: "", why: "", skills: "", edge: "",
};

function JobsPage() {
  const submit = useServerFn(submitJobApplication);
  const [form, setForm] = useState<FormState>(blank);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof FormState, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      await submit({ data: form });
      setSent(true);
      setForm(blank);
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذّر الإرسال، حاول مجددًا");
    } finally {
      setSending(false);
    }
  };

  const inputs: { k: keyof FormState; label: string; type?: string; dir?: "ltr"; required?: boolean }[] = [
    { k: "name", label: "الاسم", required: true },
    { k: "email", label: "البريد الإلكتروني", type: "email", dir: "ltr", required: true },
    { k: "phone", label: "رقم الهاتف", type: "tel", dir: "ltr" },
    { k: "location", label: "وين ساكن حاليًا؟" },
    { k: "start_when", label: "متى تقدر تبلش؟" },
    { k: "portfolio_url", label: "رابط أعمالك أو الإنستاجرام", type: "url", dir: "ltr" },
  ];

  const textareas: { k: keyof FormState; label: string }[] = [
    { k: "why", label: "ليش حابب تشتغل مع فَيّ؟" },
    { k: "skills", label: "احكيلنا المهارات الي بتمتلكها وبتأهلك لهاد العمل؟" },
    { k: "edge", label: "ما هي إضافتك الخاصة الي رح تميزك؟" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="pt-40 pb-12 px-6 lg:px-10">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="text-xs tracking-[0.35em] text-primary mb-4">— CAREERS</div>
            <h1 className="font-display text-5xl md:text-7xl text-foreground leading-tight text-balance">
              فَيّ تبحث عن <span className="text-primary">كاتب إعلانات</span>.
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-10 p-8 rounded-3xl border border-border bg-surface">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground">
                  <Briefcase size={18} />
                </div>
                <div className="text-sm text-primary tracking-[0.2em]">REMOTE · FREELANCE</div>
              </div>
              <ul className="text-muted-foreground space-y-2 list-disc list-inside leading-relaxed">
                <li>كتابة محتوى إعلاني بالتعاون مع فريق الإخراج</li>
                <li>المشاركة في جلسات العصف الذهني</li>
                <li>عمل أونلاين، نظام فريلانس</li>
                <li>يوجد تاسك بسيط لازم تنجزه قبل ميتنغ العمل</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-24 px-6 lg:px-10">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
              عبّئ النموذج لنتواصل معك
            </h2>
            <form onSubmit={onSubmit} className="p-8 md:p-10 rounded-3xl border border-border bg-surface shadow-elevated">
              {inputs.map((f) => (
                <div key={f.k} className="mb-5">
                  <label className="block text-sm text-muted-foreground mb-2">{f.label}</label>
                  <input
                    type={f.type ?? "text"}
                    dir={f.dir}
                    required={f.required}
                    value={form[f.k]}
                    onChange={(e) => set(f.k, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary outline-none transition-colors"
                  />
                </div>
              ))}
              {textareas.map((f) => (
                <div key={f.k} className="mb-5">
                  <label className="block text-sm text-muted-foreground mb-2">{f.label}</label>
                  <textarea
                    rows={4}
                    value={form[f.k]}
                    onChange={(e) => set(f.k, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary outline-none transition-colors resize-none"
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-3.5 text-primary-foreground font-medium hover:shadow-glow transition-all disabled:opacity-60"
              >
                {sending ? "جارٍ الإرسال..." : "إرسال الطلب"} <Send size={16} />
              </button>
              {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
              {sent && <p className="mt-4 text-sm text-primary">شكرًا! استلمنا طلبك وسنتواصل معك قريبًا.</p>}
            </form>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
