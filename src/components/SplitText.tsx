import { useEffect, useRef, useState, type ElementType } from "react";

/**
 * Word-level reveal that preserves Arabic letter shaping (ligatures).
 * Splitting on characters breaks Arabic — so each word is wrapped as a unit.
 */
export default function SplitText({
  text,
  className = "",
  delay = 0,
  staggerMs = 80,
  as: Tag = "span" as ElementType,
}: {
  text: string;
  className?: string;
  delay?: number;
  staggerMs?: number;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setTimeout(() => setShow(true), delay);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  const words = text.split(/(\s+)/);
  const Component = Tag;

  return (
    <Component ref={ref} className={`reveal-word ${show ? "in" : ""} ${className}`}>
      {words.map((w, i) =>
        /^\s+$/.test(w) ? (
          <span key={i}>{w}</span>
        ) : (
          <span key={i} className="rw-word" style={{ transitionDelay: `${i * staggerMs}ms` }}>
            {w}
          </span>
        ),
      )}
    </Component>
  );
}
