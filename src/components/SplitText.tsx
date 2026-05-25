import { useEffect, useRef, useState, type ReactNode } from "react";

export default function SplitText({
  text,
  className = "",
  delay = 0,
  staggerMs = 35,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  staggerMs?: number;
  as?: keyof JSX.IntrinsicElements;
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

  const chars: ReactNode[] = [];
  let i = 0;
  for (const ch of Array.from(text)) {
    chars.push(
      <span key={i} style={{ transitionDelay: `${i * staggerMs}ms` }}>
        {ch === " " ? "\u00A0" : ch}
      </span>,
    );
    i++;
  }

  const Component = Tag as unknown as React.ElementType;
  return (
    <Component ref={ref} className={`reveal-letter ${show ? "in" : ""} ${className}`}>
      {chars}
    </Component>
  );
}
