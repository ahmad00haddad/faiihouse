import { useEffect, useRef, useState } from "react";

/**
 * Count-up animation that preserves any non-digit prefix/suffix (e.g. "+", "%").
 * Triggers once when the element enters the viewport.
 */
export default function CountUp({
  value,
  duration = 1600,
  className = "",
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState<string>(() => {
    // Start at 0 but keep prefix/suffix shape
    const match = value.match(/(\D*)(\d+)(\D*)/);
    if (!match) return value;
    return `${match[1]}0${match[3]}`;
  });
  const started = useRef(false);

  useEffect(() => {
    const match = value.match(/(\D*)(\d+)(\D*)/);
    if (!match) {
      setDisplay(value);
      return;
    }
    const [, prefix, numStr, suffix] = match;
    const target = parseInt(numStr, 10);

    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              const current = Math.round(target * eased);
              setDisplay(`${prefix}${current}${suffix}`);
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
