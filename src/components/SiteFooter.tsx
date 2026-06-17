import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-gradient-to-b from-maroon-deep to-[oklch(0.18_0.08_18)] text-cream/90">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-gold/60 font-display text-lg text-gold-foil">R</span>
            <div>
              <p className="font-display text-xl text-cream">Royal Boutique</p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Couture Embroidery</p>
            </div>
          </div>
          <p className="text-sm text-cream/70">
            Heritage embroidery, modern precision. Crafting bridal couture and bespoke garments in Jeypore since the heart of artistry began.
          </p>
          <div className="flex gap-2 pt-2">
            {[
              { href: SITE.socials.instagram, icon: Instagram, label: "Instagram" },
              { href: SITE.socials.facebook, icon: Facebook, label: "Facebook" },
              { href: SITE.socials.youtube, icon: Youtube, label: "YouTube" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="grid h-9 w-9 place-items-center rounded-full border border-gold/40 transition-colors hover:bg-gold hover:text-maroon-deep"
              >
                <s.icon className="h-4 w-4" />
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
              <span className="text-cream/80">{SITE.address}</span>
            </li>
            <li>
              <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 text-cream/80 hover:text-gold">
                <Phone className="h-4 w-4 text-gold" /> {SITE.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 break-all text-cream/80 hover:text-gold">
                <Mail className="h-4 w-4 text-gold" /> {SITE.email}
              </a>
            </li>
            <li className="text-xs text-cream/60">{SITE.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-cream/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Royal Boutique. Crafted with devotion in Jeypore.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-gold">Privacy</Link>
            <Link to="/terms" className="hover:text-gold">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
