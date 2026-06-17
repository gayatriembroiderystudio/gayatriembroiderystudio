import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { SITE } from "@/lib/site";

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/85 backdrop-blur-md shadow-soft"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-3 md:py-4">
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/60 bg-gradient-to-br from-maroon to-maroon-deep font-display text-base font-bold text-gold-foil">
            R
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate font-display text-lg font-semibold text-maroon-deep">
              Royal Boutique
            </span>
            <span className="hidden truncate text-[10px] uppercase tracking-[0.25em] text-gold sm:block">
              Embroidery · Maggam
            </span>
          </span>
        </Link>

        <nav className="hidden items-center justify-center gap-1 lg:flex">
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

        <div className="flex items-center gap-2">
          <a
            href={`tel:${SITE.phone.replace(/\s/g, "")}`}
            className="hidden items-center gap-2 rounded-full border border-gold/50 px-4 py-2 text-sm font-medium text-maroon-deep transition-all hover:bg-gold/10 md:inline-flex"
          >
            <Phone className="h-3.5 w-3.5" />
            {SITE.phone}
          </a>
          <Link
            to="/booking"
            className="hidden rounded-full bg-gradient-to-r from-maroon to-maroon-deep px-5 py-2.5 text-sm font-medium text-cream shadow-soft transition-transform hover:-translate-y-0.5 md:inline-block"
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
