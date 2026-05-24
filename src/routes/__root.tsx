import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl text-primary">404</h1>
        <h2 className="mt-4 text-xl text-foreground">المشهد غير موجود</h2>
        <p className="mt-2 text-sm text-muted-foreground">الصفحة التي تبحث عنها انسحبت من الكادر.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center rounded-full bg-gradient-primary px-5 py-2.5 text-sm text-primary-foreground">
            العودة للرئيسية
          </Link>
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
      { title: "Faii House" },
      { name: "description", content: "فَيّ هاوس — استوديو إنتاج سينمائي متخصص في الأفلام القصيرة، الإعلانات السينمائية، الوثائقيات، والتلوين السينمائي." },
      { name: "author", content: "Faii House" },
      { property: "og:title", content: "Faii House" },
      { property: "og:description", content: "فَيّ هاوس — استوديو إنتاج سينمائي متخصص في الأفلام القصيرة، الإعلانات السينمائية، الوثائقيات، والتلوين السينمائي." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Faii House" },
      { name: "twitter:description", content: "فَيّ هاوس — استوديو إنتاج سينمائي متخصص في الأفلام القصيرة، الإعلانات السينمائية، الوثائقيات، والتلوين السينمائي." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/kETDbK25itOtIyWj7jMHqZOBMH02/social-images/social-1779657405150-Asset_153_4x_copy_te2.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/kETDbK25itOtIyWj7jMHqZOBMH02/social-images/social-1779657405150-Asset_153_4x_copy_te2.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
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
      <Outlet />
    </QueryClientProvider>
  );
}
