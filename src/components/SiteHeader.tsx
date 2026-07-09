import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/booking", label: "Book" },
  { to: "/feedback", label: "Reviews" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: settings, isLoading } = useSettings();
  console.log("Logo URL:", settings?.logo_url);

  const logo = settings?.logo_url ?? "";

  const businessName = settings?.business_name || "Gayatri Embroidery Studio";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isLoading) {
    return <header className="sticky top-0 z-50 h-20 border-b bg-white" />;
  }

  return (
    <header
      className={[
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/85 backdrop-blur-md shadow-soft"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-3">
        <Link to="/" className="flex items-center gap-3 -ml-2" onClick={() => setOpen(false)}>
          {logo && (
            <img src={logo} alt={businessName} className="h-16 w-auto object-contain shrink-0" />
          )}
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-maroon-deep after:scale-x-100" }}
              className="relative px-3 py-2 text-sm font-medium text-foreground/75 transition-colors hover:text-maroon-deep after:absolute after:bottom-1 after:left-1/2 after:h-px after:w-6 after:-translate-x-1/2 after:scale-x-0 after:bg-gold after:transition-transform"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-10 flex items-center gap-2">
          <Link
            to="/booking"
            className="hidden rounded-full bg-gradient-to-r from-maroon to-maroon-deep px-7 py-3 text-sm font-semibold text-cream shadow-soft transition-transform hover:-translate-y-0.5 md:inline-flex"
          >
            Book Consultation
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="grid h-10 w-10 place-items-center rounded-full border border-border lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-5 py-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "text-maroon-deep" }}
                className="border-b border-border/50 py-3 font-display text-base text-foreground/80 last:border-0"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/booking"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-full bg-maroon px-5 py-3 text-center text-sm font-medium text-cream"
            >
              Book Consultation
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
