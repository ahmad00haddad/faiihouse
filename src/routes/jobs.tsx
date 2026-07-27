import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import { submitJobApplication } from "@/lib/leads.functions";
import { Send, ArrowLeft, ArrowRight, Check } from "lucide-react";

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
    links: [{ rel: "canonical", href: "https://faiihouse.lovable.app/jobs" }],
  }),
});

type FormState = {
  name: string; email: string; phone: string; location: string; start_when: string;
  portfolio_url: string; why: string; skills: string; edge: string;
};
const blank: FormState = { name: "", email: "", phone: "", location: "", start_when: "", portfolio_url: "", why: "", skills: "", edge: "" };

const ROLES = ["كاتب إعلانات", "مصوّر", "محرّر فيديو", "مصمم صوت"];

function useTypewriter(words: string[], hold = 1600, speed = 80) {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const [dir, setDir] = useState<"in" | "out" | "hold">("in");
  useEffect(() => {
    if (i === words.length - 1 && dir === "in" && text === words[i]) return; // stop on last
    const current = words[i];
    let t: ReturnType<typeof setTimeout>;
    if (dir === "in") {
      if (text.length < current.length) t = setTimeout(() => setText(current.slice(0, text.length + 1)), speed);
      else t = setTimeout(() => setDir("hold"), hold);
    } else if (dir === "hold") {
      t = setTimeout(() => setDir("out"), 400);
    } else {
      if (text.length > 0) t = setTimeout(() => setText(text.slice(0, -1)), speed / 2);
      else { setDir("in"); setI((x) => (x + 1) % words.length); return; }
    }
    return () => clearTimeout(t);
  }, [text, i, dir, words, hold, speed]);
  return text;
}

function JobsPage() {
  const submit = useServerFn(submitJobApplication);
  const [form, setForm] = useState<FormState>(blank);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const typed = useTypewriter(ROLES);

  const set = (k: keyof FormState, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const steps = [
    { label: "المعلومات", fields: ["name", "email", "phone", "location", "start_when"] as (keyof FormState)[] },
    { label: "المهارات", fields: ["portfolio_url", "skills"] as (keyof FormState)[] },
    { label: "لمستك الخاصة", fields: ["why", "edge"] as (keyof FormState)[] },
  ];

  const labels: Record<keyof FormState, string> = {
    name: "الاسم",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    location: "وين ساكن حاليًا؟",
    start_when: "متى تقدر تبلش؟",
    portfolio_url: "رابط أعمالك أو الإنستاجرام",
    skills: "المهارات التي تملكها",
    why: "ليش حابب تشتغل مع فَيّ؟",
    edge: "ما إضافتك الخاصة؟",
  };

  const canNext = steps[step].fields.every((f) => {
    if (f === "name" || f === "email") return form[f].trim().length > 0;
    return true;
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < steps.length - 1) { setStep(step + 1); return; }
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

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SiteHeader />

      {/* Hero */}
      <section className="pt-40 pb-16 px-6 lg:px-10 relative grain">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-xs tracking-[0.4em] text-primary mb-6">— CASTING · NOW OPEN</div>
            <h1 className="font-display leading-[0.95] text-balance" style={{ fontSize: "clamp(3rem, 9vw, 8rem)" }}>
              فَيّ تبحث عن{" "}
              <span className="text-primary inline-block min-w-[6ch]">
                {typed}
                <span className="inline-block w-[0.08em] h-[0.9em] align-middle bg-primary ml-1 animate-pulse" />
              </span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-12 casting-poster max-w-3xl">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <div className="text-[10px] tracking-[0.35em] text-primary mb-2">ROLE</div>
                  <div className="font-display text-2xl text-foreground">كاتب إعلانات</div>
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.35em] text-primary mb-2">TYPE</div>
                  <div className="font-display text-2xl text-foreground">Remote · Freelance</div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-border">
                <div className="text-[10px] tracking-[0.35em] text-primary mb-3">REQUIREMENTS</div>
                <ul className="text-muted-foreground space-y-2 list-disc list-inside leading-relaxed text-sm">
                  <li>كتابة محتوى إعلاني بالتعاون مع فريق الإخراج</li>
                  <li>المشاركة في جلسات العصف الذهني</li>
                  <li>عمل أونلاين، نظام فريلانس</li>
                  <li>تاسك بسيط لازم تنجزه قبل ميتنغ العمل</li>
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Form */}
      <section className="pb-28 px-6 lg:px-10">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            {sent ? (
              <div className="clapperboard shadow-elevated">
                <div className="flex items-center gap-4 mb-4 mt-4">
                  <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Check size={28} strokeWidth={3} />
                  </div>
                  <div>
                    <div className="font-display text-primary text-xs tracking-[0.35em]">AUDITION SUBMITTED</div>
                    <div className="font-display text-3xl text-foreground">استلمنا طلبك</div>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  شكرًا لتقديمك — راح نراجع طلبك ونتواصل معك قريبًا إذا كان بروفايلك يناسبنا.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="p-8 md:p-10 rounded-3xl bg-surface border border-border shadow-elevated">
                <div className="flex items-center justify-between mb-8">
                  <div className="text-xs tracking-[0.35em] text-primary">— APPLICATION</div>
                  <div className="text-xs text-muted-foreground">
                    STEP {String(step + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
                  </div>
                </div>

                <div className="stepper mb-8">
                  {steps.map((s, i) => (
                    <div key={s.label} className="flex items-center gap-2 flex-1 last:flex-none">
                      <div className={`dot ${i === step ? "active" : i < step ? "done" : ""}`} />
                      <span className={`text-xs whitespace-nowrap ${i === step ? "text-primary" : "text-muted-foreground"}`}>{s.label}</span>
                      {i < steps.length - 1 && <div className={`bar ${i < step ? "done" : ""}`} />}
                    </div>
                  ))}
                </div>

                <div className="space-y-5">
                  {steps[step].fields.map((k) => {
                    const isLong = k === "why" || k === "skills" || k === "edge";
                    return (
                      <div key={k} className="field">
                        {isLong ? (
                          <textarea
                            id={`j-${k}`}
                            placeholder=" "
                            rows={4}
                            value={form[k]}
                            onChange={(e) => set(k, e.target.value)}
                          />
                        ) : (
                          <input
                            id={`j-${k}`}
                            type={k === "email" ? "email" : k === "phone" ? "tel" : k === "portfolio_url" ? "url" : "text"}
                            placeholder=" "
                            dir={k === "email" || k === "phone" || k === "portfolio_url" ? "ltr" : undefined}
                            required={k === "name" || k === "email"}
                            value={form[k]}
                            onChange={(e) => set(k, e.target.value)}
                          />
                        )}
                        <label htmlFor={`j-${k}`}>{labels[k]}</label>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(Math.max(0, step - 1))}
                    disabled={step === 0}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 flex items-center gap-2"
                  >
                    <ArrowRight size={14} /> السابق
                  </button>
                  <button
                    type="submit"
                    disabled={sending || !canNext}
                    className="inline-flex items-center gap-3 rounded-full bg-gradient-primary px-7 py-3.5 text-primary-foreground font-medium hover:shadow-glow transition-all disabled:opacity-60"
                  >
                    {step === steps.length - 1 ? (
                      <>
                        {sending ? "جارٍ الإرسال..." : "إرسال الطلب"} <Send size={16} />
                      </>
                    ) : (
                      <>
                        التالي <ArrowLeft size={16} />
                      </>
                    )}
                  </button>
                </div>

                {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
              </form>
            )}
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
