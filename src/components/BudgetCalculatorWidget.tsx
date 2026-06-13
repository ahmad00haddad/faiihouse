import { useState } from "react";
import { Sparkles, ArrowLeft } from "lucide-react";

/**
 * Lightweight project-type picker.
 * No prices shown — pricing lives in the full quote builder.
 * Deep-links into /quote-builder/ with project type + days pre-filled.
 */

type TypeOpt = {
  id: string; // matches PROJECT_TYPES id in /quote-builder/index.html
  icon: string;
  ar: string;
};

const TYPES: TypeOpt[] = [
  { id: "reels",       icon: "📱", ar: "ريلز انستغرام" },
  { id: "interview",   icon: "🎙", ar: "مقابلة / بودكاست" },
  { id: "event",       icon: "🎤", ar: "تغطية فعالية" },
  { id: "photovideo",  icon: "📷", ar: "صور + فيديو" },
  { id: "corporate",   icon: "🏢", ar: "فيديو مؤسسي" },
  { id: "documentary", icon: "🎥", ar: "فيلم وثائقي" },
  { id: "commercial",  icon: "📺", ar: "إعلان تجاري" },
  { id: "shortfilm",   icon: "🎞", ar: "فيلم قصير" },
];

const LS_KEY = "faii_house_state";

export default function BudgetCalculatorWidget() {
  const [typeId, setTypeId] = useState<string>("corporate");
  const [days, setDays] = useState(1);

  const openBuilder = () => {
    try {
      let saved: { state?: Record<string, unknown>; lang?: string } = {};
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) saved = JSON.parse(raw) || {};
      } catch {}

      const nextState = {
        ...(saved.state ?? {}),
        step: 1,
        projectType: typeId,
        days,
      };
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({ state: nextState, lang: saved.lang ?? "ar" }),
      );
    } catch {}
    if (typeof window !== "undefined") {
      window.open("/quote-builder/index.html", "_blank", "noopener");
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-8 md:p-12">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative">
        <div className="mb-3 flex items-center gap-2 text-xs tracking-[0.35em] text-primary">
          <Sparkles size={14} />
          <span>— PROJECT ESTIMATOR</span>
        </div>
        <h3 className="font-display text-3xl md:text-4xl text-foreground leading-tight">
          ابدأ تسعيرة مشروعك
        </h3>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground leading-relaxed">
          اختر نوع المشروع وعدد أيام التصوير، ثم انتقل إلى الحاسبة التفصيلية لرؤية السعر الحقيقي مع كل التفاصيل — معدات، طاقم، ما بعد الإنتاج وأكثر.
        </p>

        {/* Type grid */}
        <div className="mt-8">
          <div className="mb-3 text-xs tracking-[0.25em] text-muted-foreground">
            نوع المشروع
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {TYPES.map((t) => {
              const active = typeId === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTypeId(t.id)}
                  className={`group relative rounded-2xl border px-3 py-4 text-center transition-all ${
                    active
                      ? "border-primary bg-primary/10"
                      : "border-border bg-background/60 hover:border-primary/40"
                  }`}
                >
                  <div className="text-2xl leading-none">{t.icon}</div>
                  <div
                    className={`mt-2 text-sm ${
                      active ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {t.ar}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Days */}
        <div className="mt-6 grid gap-6 md:grid-cols-2 md:items-end">
          <div>
            <div className="mb-3 flex items-baseline justify-between">
              <span className="text-xs tracking-[0.25em] text-muted-foreground">
                أيام التصوير
              </span>
              <span className="font-display text-xl text-foreground tabular-nums">
                {days} {days === 1 ? "يوم" : "أيام"}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDays(d)}
                  className={`rounded-xl border px-3 py-2 text-sm transition-all ${
                    days === d
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={openBuilder}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-7 py-3.5 text-primary-foreground font-medium hover:shadow-glow transition-all"
          >
            افتح الحاسبة التفصيلية <ArrowLeft size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
