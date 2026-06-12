import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Film-cut page transition: a brief white flash + sprocket sweep
 * triggered on every pathname change.
 */
export default function PageTransition() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [active, setActive] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setActive(true);
    const t = setTimeout(() => setActive(false), 520);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[100] ${active ? "film-cut-active" : ""}`}
    >
      <div className="film-cut-flash" />
      <div className="film-cut-sweep">
        <div className="sprocket-row top">
          {Array.from({ length: 24 }).map((_, i) => <span key={i} />)}
        </div>
        <div className="sprocket-row bottom">
          {Array.from({ length: 24 }).map((_, i) => <span key={i} />)}
        </div>
      </div>
    </div>
  );
}
