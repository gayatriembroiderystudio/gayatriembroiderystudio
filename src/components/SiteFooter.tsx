import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

export function SiteFooter() {
  const { data: settings, isLoading } = useSettings();

  const logo = settings?.logo_url || "/logo.png";

  const businessName = settings?.business_name || "Gayatri Embroidery Studio";

  return (
    <footer className="relative mt-24 overflow-hidden bg-gradient-to-b from-maroon-deep to-[oklch(0.18_0.08_18)] text-cream/90">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center">
              <img
                src={logo}
                alt="Gayatri Embroidery Studio"
                className="h-14 w-14 rounded-md border border-gold/60 bg-white p-1 object-contain"
              />
            </span>
            <div>
              <p className="font-display text-xl text-cream">{settings?.business_name}</p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold">
                {settings?.tagline}
              </p>
            </div>
          </div>
          <p className="text-sm text-cream/70">
            Heritage embroidery, modern precision. Crafting bridal couture and bespoke garments in
            Jeypore since the heart of artistry began.
          </p>
          <div className="flex gap-2 pt-2">
            {[
              {
                href: settings?.instagram,
                icon: Instagram,
                label: "Instagram",
              },
              {
                href: settings?.facebook,
                icon: Facebook,
                label: "Facebook",
              },
              {
                href: settings?.youtube,
                icon: Youtube,
                label: "YouTube",
              },
            ]
              .filter(
                (
                  social,
                ): social is {
                  href: string;
                  icon: typeof Instagram;
                  label: string;
                } => Boolean(social.href),
              )
              .map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-gold/40 transition-all duration-300 hover:bg-gold hover:text-maroon-deep"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-display text-base text-gold">Explore</h4>
          <ul className="space-y-2 text-sm">
            {[
              ["/about", "About Us"],
              ["/services", "Services"],
              ["/gallery", "Gallery"],
              ["/booking", "Book Online"],
              ["/feedback", "Reviews"],
              ["/blog", "Blog"],
              ["/faq", "FAQ"],
              ["/contact", "Contact"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-cream/70 transition-colors hover:text-gold">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-display text-base text-gold">Signature Services</h4>
          <ul className="space-y-2 text-sm text-cream/70">
            <li>Bridal Blouse Designing</li>
            <li>Maggam &amp; Aari Work</li>
            <li>Zardosi &amp; Stone Work</li>
            <li>Saree &amp; Lehenga Embroidery</li>
            <li>Custom Logo Embroidery</li>
            <li>Wedding Collections</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-display text-base text-gold">Visit the Atelier</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span className="text-cream/80">{settings?.address}</span>
            </li>
            <li>
              <a
                href={`tel:${settings?.phone?.replace(/\s/g, "") ?? ""}`}
                className="flex items-center gap-3 text-cream/80 hover:text-gold"
              >
                <Phone className="h-4 w-4 text-gold" /> {settings?.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${settings?.email}`}
                className="flex items-center gap-3 break-all text-cream/80 hover:text-gold"
              >
                <Mail className="h-4 w-4 text-gold" /> {settings?.email}
              </a>
            </li>
            <li className="text-xs text-cream/60">{settings?.business_hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-cream/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {settings?.footer_text}
          </p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-gold">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-gold">
              Terms
            </Link>
            <Link to="/auth" className="hover:text-gold">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
