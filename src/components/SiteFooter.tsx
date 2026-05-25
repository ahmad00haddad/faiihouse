import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import logo from "@/assets/faii/logo-white.png";

export default function SiteFooter() {
  return (
    <footer className="relative mt-32 border-t border-border bg-surface/40">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-l from-transparent via-primary/50 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <img src={logo} alt="Faii House" className="h-12 w-auto mb-4" />
          <p className="text-muted-foreground max-w-md leading-relaxed">
            فَيّ هاوس — شركة إنتاج سينمائي من إربد. فريق وأصدقاء من الشباب،
            نُترجم الأفكار إلى صور تتنفّس من الأردن إلى العالم.
          </p>
          <div className="flex gap-3 mt-6">
            {[
              { Icon: Instagram, href: "https://www.instagram.com/faii.house/" },
              { Icon: Facebook, href: "https://www.facebook.com/faii.house.jo" },
              { Icon: Linkedin, href: "https://www.linkedin.com/company/faiihouse/" },
            ].map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground/70 hover:text-primary hover:border-primary transition-all"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm tracking-[0.25em] text-primary mb-4">روابط</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary transition-colors">عن فَيّ</Link></li>
            <li><Link to="/services" className="hover:text-primary transition-colors">خدماتنا</Link></li>
            <li><Link to="/portfolio" className="hover:text-primary transition-colors">أعمالنا</Link></li>
            <li><Link to="/jobs" className="hover:text-primary transition-colors">انضم لنا</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm tracking-[0.25em] text-primary mb-4">تواصل</h4>
          <ul className="space-y-3 text-muted-foreground text-sm">
            <li className="flex items-center gap-2"><MapPin size={14} className="text-primary" /> الأردن — إربد</li>
            <li className="flex items-center gap-2" dir="ltr"><Phone size={14} className="text-primary" /> +962 79 925 6345</li>
            <li className="flex items-center gap-2"><Mail size={14} className="text-primary" /> faii.house.jo@gmail.com</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Faii House — جميع الحقوق محفوظة</p>
          <p className="tracking-[0.2em]">CINEMA · STORY · CRAFT</p>
        </div>
      </div>
    </footer>
  );
}
