import { Sparkles, ArrowLeft } from "lucide-react";

/**
 * Lightweight CTA to the full quote builder.
 * No type/days/price exposed here — everything lives in the detailed calculator.
 */

export default function BudgetCalculatorWidget() {
  const openBuilder = () => {
    if (typeof window !== "undefined") {
      window.open("/quote-builder/index.html", "_blank", "noopener");
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-8 md:p-12">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <div className="mb-3 flex items-center gap-2 text-xs tracking-[0.35em] text-primary">
            <Sparkles size={14} />
            <span>— PROJECT ESTIMATOR</span>
          </div>
          <h3 className="font-display text-3xl md:text-4xl text-foreground leading-tight">
            احسب تكلفة مشروعك بنفسك
          </h3>
          <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
            جرّب الحاسبة التفصيلية بنفسك — اختر نوع المشروع، المعدات، الطاقم وما بعد الإنتاج، وشاهد السعر الحقيقي يتكوّن خطوة بخطوة.
          </p>
        </div>

        <button
          type="button"
          onClick={openBuilder}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-primary px-7 py-3.5 text-primary-foreground font-medium hover:shadow-glow transition-all"
        >
          افتح الحاسبة التفصيلية <ArrowLeft size={18} />
        </button>
      </div>
    </div>
  );
}
