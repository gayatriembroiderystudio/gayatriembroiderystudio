import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="brocade-bg flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="ornament"><span className="ornament-line" />404<span className="ornament-line" /></p>
        <h1 className="mt-4 font-display text-5xl text-maroon-deep">Page not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you're looking for has drifted off the loom.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-maroon px-6 py-2.5 text-sm font-medium text-cream"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="brocade-bg flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl text-maroon-deep">Something didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Please try again in a moment.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-full bg-maroon px-6 py-2.5 text-sm font-medium text-cream"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Royal Boutique — Premium Computerized Embroidery & Maggam Works in Jeypore" },
      { name: "description", content: "Royal Boutique offers premium computerized embroidery, maggam, aari, zardosi & bridal designing in Jeypore, Odisha. Book your bespoke consultation." },
      { name: "author", content: "Royal Boutique" },
      { name: "theme-color", content: "#3a0e15" },
      { property: "og:site_name", content: "Royal Boutique" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Royal Boutique — Couture Embroidery & Maggam Works" },
      { property: "og:description", content: "Bridal embroidery, maggam, aari, zardosi, stone & hand work in Jeypore, Odisha." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Royal Boutique",
          description: "Premium computerized embroidery and maggam works.",
          image: "/og-cover.jpg",
          telephone: "+91 9556306160",
          email: "charvi.maggamhub@gmail.com",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Dasarathi Street, Bell Road",
            addressLocality: "Jeypore",
            addressRegion: "Odisha",
            addressCountry: "IN",
          },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
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
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
        <WhatsAppFab />
        <Toaster richColors position="top-center" />
      </div>
    </QueryClientProvider>
  );
}
