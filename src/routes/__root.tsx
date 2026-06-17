import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import SmoothScroll from "@/components/SmoothScroll";
import PageTransition from "@/components/PageTransition";
import MagneticCursor from "@/components/MagneticCursor";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 overflow-hidden grain vignette">
      {/* film strips */}
      <div className="absolute top-0 inset-x-0 h-3 film-strip opacity-60" />
      <div className="absolute bottom-0 inset-x-0 h-3 film-strip opacity-60" />
      {/* glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-primary/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative max-w-xl text-center">
        <div className="inline-flex items-center gap-3 text-xs tracking-[0.4em] text-primary mb-6">
          <span className="w-8 h-px bg-primary" /> SCENE MISSING <span className="w-8 h-px bg-primary" />
        </div>
        <h1 className="font-display text-[7rem] md:text-[10rem] leading-none text-primary drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]">
          404
        </h1>
        <h2 className="mt-2 font-display text-2xl md:text-3xl text-foreground">
          هذا المشهد لم يُصوَّر بعد.
        </h2>
        <p className="mt-4 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          يبدو أن اللقطة التي تبحث عنها خرجت من الكادر. لنعد إلى البداية ونلتقط مشهداً جديداً.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm text-primary-foreground hover:shadow-glow transition-all">
            العودة للرئيسية
          </Link>
          <Link to="/portfolio" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm text-foreground hover:border-primary hover:text-primary transition-all">
            تصفّح أعمالنا
          </Link>
        </div>
        <div className="mt-12 text-[10px] tracking-[0.5em] text-muted-foreground/60">
          FAII HOUSE · TAKE 404
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl text-foreground">حدث خطأ ما</h1>
        <p className="mt-2 text-sm text-muted-foreground">حاول إعادة التحميل أو ارجع للرئيسية.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-full bg-gradient-primary px-5 py-2.5 text-sm text-primary-foreground">
            إعادة المحاولة
          </button>
          <a href="/" className="rounded-full border border-border px-5 py-2.5 text-sm text-foreground">الرئيسية</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Faii House — شركة إنتاج سينمائي" },
      { name: "description", content: "فَيّ هاوس — شركة إنتاج سينمائي من إربد، الأردن. أفلام، إعلانات سينمائية، وثائقيات وتلوين سينمائي." },
      { name: "author", content: "Faii House" },
      { property: "og:title", content: "Faii House — شركة إنتاج سينمائي" },
      { property: "og:description", content: "فَيّ هاوس — شركة إنتاج سينمائي من إربد، الأردن. أفلام، إعلانات سينمائية، وثائقيات وتلوين سينمائي." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Faii House — شركة إنتاج سينمائي" },
      { name: "twitter:description", content: "فَيّ هاوس — شركة إنتاج سينمائي من إربد، الأردن. أفلام، إعلانات سينمائية، وثائقيات وتلوين سينمائي." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/38db9503-92cf-45ef-aaa9-1eb7830e75cc" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/38db9503-92cf-45ef-aaa9-1eb7830e75cc" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "canonical", href: "https://faiihouse.lovable.app/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": "https://faiihouse.lovable.app/#business",
          name: "Faii House",
          alternateName: "فَيّ هاوس",
          description:
            "شركة إنتاج سينمائي من إربد، الأردن — أفلام، إعلانات سينمائية، وثائقيات وتلوين سينمائي.",
          url: "https://faiihouse.lovable.app",
          image: "https://faiihouse.lovable.app/favicon.ico",
          telephone: "+962-7-0000-0000",
          priceRange: "$$",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Irbid",
            addressCountry: "JO",
          },
          areaServed: "JO",
          sameAs: ["https://www.behance.net/faiihouse"],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <SmoothScroll />
      <MagneticCursor />
      <PageTransition />
      <Outlet />
    </QueryClientProvider>
  );
}
