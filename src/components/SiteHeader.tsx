import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/faii/logo-white.png";

const nav = [
  { to: "/", label: "الرئيسية" },
  { to: "/about", label: "عن فَيّ" },
  { to: "/services", label: "خدماتنا" },
  { to: "/portfolio", label: "أعمالنا" },
  { to: "/contact", label: "للتواصل" },
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { location } = useRouterState();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "backdrop-blur-xl bg-background/75 border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logo} alt="Faii House" className="h-10 w-auto" />
          <span className="hidden sm:inline text-xs tracking-[0.3em] text-muted-foreground group-hover:text-primary transition-colors">
            FAII&nbsp;HOUSE
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => {
            const active = location.pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`relative px-4 py-2 text-sm transition-colors ${
                  active ? "text-primary" : "text-foreground/80 hover:text-primary"
                }`}
              >
                {n.label}
                {active && (
                  <span className="absolute bottom-0 inset-x-4 h-px bg-primary" />
                )}
              </Link>
            );
          })}
          <Link
            to="/contact"
            className="ms-4 px-5 py-2.5 rounded-full bg-gradient-primary text-primary-foreground text-sm font-medium hover:shadow-glow transition-all"
          >
            ابدأ مشروعك
          </Link>
        </nav>

        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setOpen((v) => !v)}
          aria-label="menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <nav className="px-6 py-4 flex flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="py-3 px-2 text-foreground/90 hover:text-primary border-b border-border/50 last:border-0"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
