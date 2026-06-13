import { useMemo, useState } from "react";
import { Calculator, ArrowLeft, Sparkles } from "lucide-react";

/**
 * Mini budget calculator widget.
 * Maps a budget + duration to a suggested project type, then deep-links into
 * the full quote builder with state pre-filled via localStorage.
 */

type TypeOpt = {
  id: string; // matches PROJECT_TYPES id in /quote-builder/index.html
  icon: string;
  ar: string;
  min: number;
  max: number;
  defaultDays: number;
};

const TYPES: TypeOpt[] = [
  { id: "reels",       icon: "📱", ar: "ريلز انستغرام",    min: 100,  max: 250,  defaultDays: 1 },
  { id: "interview",   icon: "🎙", ar: "مقابلة / بودكاست", min: 300,  max: 800,  defaultDays: 1 },
  { id: "event",       icon: "🎤", ar: "تغطية فعالية",     min: 300,  max: 1500, defaultDays: 1 },
  { id: "photovideo",  icon: "📷", ar: "صور + فيديو",      min: 500,  max: 2500, defaultDays: 1 },
  { id: "corporate",   icon: "🏢", ar: "فيديو مؤسسي",      min: 600,  max: 2000, defaultDays: 2 },
  { id: "documentary", icon: "🎥", ar: "فيلم وثائقي",      min: 600,  max: 3000, defaultDays: 3 },
  { id: "commercial",  icon: "📺", ar: "إعلان تجاري",      min: 800,  max: 4000, defaultDays: 2 },
  { id: "shortfilm",   icon: "🎞", ar: "فيلم قصير",        min: 800,  max: 3800, defaultDays: 3 },
];

const MIN_BUDGET = 100;
const MAX_BUDGET = 5000;
const LS_KEY = "faii_house_state";

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

function suggestType(budget: number): TypeOpt {
  // Prefer types whose range contains the budget; pick the one whose midpoint is closest.
  const inRange = TYPES.filter((t) => budget >= t.min && budget <= t.max);
  const pool = inRange.length ? inRange : TYPES;
  return pool.reduce((best, t) => {
    const mid = (t.min + t.max) / 2;
    const bestMid = (best.min + best.max) / 2;
    return Math.abs(budget - mid) < Math.abs(budget - bestMid) ? t : best;
  });
}

export default function BudgetCalculatorWidget() {
  const [budget, setBudget] = useState(800);
  const [days, setDays] = useState(1);

  const suggested = useMemo(() => suggestType(budget), [budget]);
  const fits = budget >= suggested.min && budget <= suggested.max;

  const openBuilder = () => {
    try {
      // Read existing saved state (if any) so we don't wipe the user's other progress.
      let saved: { state?: Record<string, unknown>; lang?: string } = {};
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) saved = JSON.parse(raw) || {};
      } catch {}

      const nextState = {
        ...(saved.state ?? {}),
        step: 1,
        projectType: suggested.id,
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

  const pct = ((budget - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET)) * 100;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-8 md:p-12">
      {/* Glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
        {/* Left — controls */}
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs tracking-[0.35em] text-primary">
            <Calculator size={14} />
            <span>— BUDGET ESTIMATOR</span>
          </div>
          <h3 className="font-display text-3xl md:text-4xl text-foreground leading-tight">
            كم سيكلّفك مشروعك؟
          </h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            حرّك الميزانية وعدد أيام التصوير — نقترح عليك نوع المشروع الأنسب، ثم ننقلك للحاسبة الكاملة بكل التفاصيل.
          </p>

          {/* Budget slider */}
          <div className="mt-8">
            <div className="flex items-baseline justify-between">
              <label className="text-xs tracking-[0.25em] text-muted-foreground">
                الميزانية التقريبية
              </label>
              <div className="font-display text-2xl text-primary tabular-nums">
                {fmt(budget)} <span className="text-sm text-muted-foreground">JD</span>
              </div>
            </div>
            <input
              type="range"
              min={MIN_BUDGET}
              max={MAX_BUDGET}
              step={50}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="mt-3 w-full accent-primary"
              aria-label="Budget"
              style={{
                background: `linear-gradient(to left, hsl(var(--primary) / 0.6) ${pct}%, hsl(var(--border)) ${pct}%)`,
                height: 4,
                borderRadius: 9999,
                appearance: "none",
              }}
            />
            <div className="mt-2 flex justify-between text-[10px] tracking-widest text-muted-foreground">
              <span>{fmt(MIN_BUDGET)} JD</span>
              <span>{fmt(MAX_BUDGET)}+ JD</span>
            </div>
          </div>

          {/* Days */}
          <div className="mt-6">
            <div className="flex items-baseline justify-between">
              <label className="text-xs tracking-[0.25em] text-muted-foreground">
                أيام التصوير
              </label>
              <div className="font-display text-xl text-foreground tabular-nums">
                {days} {days === 1 ? "يوم" : "أيام"}
              </div>
            </div>
            <div className="mt-3 grid grid-cols-5 gap-2">
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
        </div>

        {/* Right — suggestion */}
        <div className="rounded-2xl border border-border bg-background/60 backdrop-blur p-6 md:p-8">
          <div className="flex items-center gap-2 text-[11px] tracking-[0.3em] text-primary">
            <Sparkles size={12} />
            <span>اقتراحنا لك</span>
          </div>

          <div className="mt-4 flex items-start gap-4">
            <div className="text-5xl leading-none">{suggested.icon}</div>
            <div className="flex-1">
              <div className="font-display text-2xl text-foreground">{suggested.ar}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                النطاق المعتاد: {fmt(suggested.min)} – {fmt(suggested.max)} JD
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-border bg-surface/60 p-4 text-sm">
            {fits ? (
              <span className="text-foreground">
                ميزانيتك ضمن النطاق المتوقع لهذا النوع — جاهز للانطلاق.
              </span>
            ) : budget < suggested.min ? (
              <span className="text-muted-foreground">
                ميزانيتك أقل قليلاً من النطاق المعتاد. يمكننا تخصيص باقة مناسبة — افتح الحاسبة لتعديل التفاصيل.
              </span>
            ) : (
              <span className="text-muted-foreground">
                ميزانيتك أعلى من النطاق المعتاد — مساحة جيدة لرفع جودة المعدات والطاقم.
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={openBuilder}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-7 py-3.5 text-primary-foreground font-medium hover:shadow-glow transition-all"
          >
            افتح الحاسبة التفصيلية <ArrowLeft size={18} />
          </button>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            * الأرقام تقديرية. السعر النهائي يعتمد على المعدات والطاقم والموقع.
          </p>
        </div>
      </div>
    </div>
  );
}
