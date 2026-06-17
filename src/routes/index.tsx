import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, Sparkles, Scissors, Crown, ShieldCheck, Heart, ArrowRight, Quote } from "lucide-react";
import hero from "@/assets/hero-embroidery.jpg";
import showcase1 from "@/assets/showcase-1.jpg";
import showcase2 from "@/assets/showcase-2.jpg";
import showcase3 from "@/assets/showcase-3.jpg";
import { SERVICES, SITE } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Royal Boutique — Premium Embroidery & Maggam Works · Jeypore" },
      { name: "description", content: "Heritage maggam, aari, zardosi & computerized embroidery for brides and bespoke couture in Jeypore, Odisha." },
      { property: "og:title", content: "Royal Boutique — Couture Embroidery" },
      { property: "og:url", content: "/" },
      { property: "og:image", content: hero },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const featured = SERVICES.slice(0, 6);
  const showcase = [showcase1, showcase2, showcase3, hero, showcase1, showcase2];
  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative isolate min-h-[92vh] w-full">
        <img
          src={hero}
          alt="Maroon and gold bridal embroidery — Royal Boutique"
          width={1920}
          height={1080}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/30 to-maroon-deep/80" />
        <div className="mx-auto flex min-h-[92vh] max-w-6xl flex-col items-center justify-center px-6 py-24 text-center text-cream">
          <p className="ornament fade-up text-gold"><span className="ornament-line bg-gold" />Est. Jeypore · Odisha<span className="ornament-line bg-gold" /></p>
          <h1 className="fade-up mt-6 font-display text-5xl leading-[1.05] sm:text-6xl md:text-7xl lg:text-[88px]">
            Where every stitch <br className="hidden sm:inline" />
            <span className="text-gold-foil italic">tells a story.</span>
          </h1>
          <p className="fade-up mx-auto mt-6 max-w-xl text-base text-cream/85 sm:text-lg" style={{ animationDelay: "120ms" }}>
            {SITE.tagline}. Bridal couture, maggam &amp; zardosi, hand-finished for the moments that matter.
          </p>
          <div className="fade-up mt-9 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: "240ms" }}>
            <Link
              to="/booking"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-[#caa14a] px-7 py-3.5 text-sm font-semibold text-maroon-deep shadow-luxe transition-transform hover:-translate-y-0.5"
            >
              Book a Consultation <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 rounded-full border border-cream/40 px-7 py-3.5 text-sm font-medium text-cream backdrop-blur-sm transition-colors hover:bg-cream/10"
            >
              Explore Gallery
            </Link>
          </div>
          <div className="fade-up mt-14 grid grid-cols-3 gap-6 text-center sm:gap-12" style={{ animationDelay: "360ms" }}>
            {[
              ["10+", "Years of craft"],
              ["500+", "Bridal pieces"],
              ["4.9★", "Client love"],
            ].map(([num, label]) => (
              <div key={label}>
                <p className="font-display text-3xl text-gold-foil sm:text-4xl">{num}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-cream/70">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED SHOWCASE */}
      <section className="brocade-bg py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <Header eyebrow="Featured Atelier" title="A glimpse of couture" subtitle="Hand-finished bridal pieces and signature embroideries crafted in our Jeypore studio." />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {showcase.slice(0, 3).map((src, i) => (
              <figure key={i} className="group relative overflow-hidden rounded-xl shadow-soft">
                <img src={src} alt="" loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep/85 via-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-4 p-5 text-cream opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Royal Boutique</p>
                  <p className="font-display text-xl">Signature Craft</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-maroon-deep py-20 text-cream sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <Header light eyebrow="Why Royal Boutique" title="Heritage. Precision. Devotion." subtitle="A decade of bridal craftsmanship, paired with computerized precision that never misses a stitch." />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Crown, title: "Bridal specialists", text: "Trusted by hundreds of brides for once-in-a-lifetime couture." },
              { icon: Sparkles, title: "Master artisans", text: "In-house aari, zardosi and maggam karigars with 10+ years' practice." },
              { icon: ShieldCheck, title: "Quality promise", text: "Every piece passes a 12-point finishing &amp; inspection ritual." },
              { icon: Heart, title: "Made with love", text: "Bespoke design, transparent pricing, on-time delivery — always." },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-cream/15 bg-cream/5 p-7 backdrop-blur-sm transition-all hover:border-gold/40 hover:-translate-y-1">
                <f.icon className="h-7 w-7 text-gold" />
                <h3 className="mt-4 font-display text-xl">{f.title}</h3>
                <p className="mt-2 text-sm text-cream/75" dangerouslySetInnerHTML={{ __html: f.text }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <Header eyebrow="Services" title="The full house of craft" subtitle="From a single monogram to a complete bridal trousseau — we do it all, under one roof." />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((s) => (
              <div key={s.slug} className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-gold hover:shadow-soft">
                <Scissors className="h-5 w-5 text-gold" />
                <h3 className="mt-4 font-display text-xl text-maroon-deep">{s.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-4 text-sm">
                  <span className="font-medium text-maroon">{s.price}</span>
                  <Link to="/booking" className="font-medium text-gold transition-colors hover:text-maroon">
                    Inquire →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/services" className="inline-flex items-center gap-2 font-display text-lg text-maroon-deep hover:text-gold">
              View all services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="brocade-bg py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <Header eyebrow="Kind Words" title="Loved by our brides" subtitle="Every review is a stitch in our story." />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { name: "Priya S.", text: "My bridal blouse was beyond perfect — every stone placed with such care. The maggam work felt regal." },
              { name: "Anjali R.", text: "Royal Boutique transformed my mother's old saree into a heirloom piece. Speechless." },
              { name: "Meera K.", text: "Computerized embroidery on my fiancé's sherwani was crisp and exact. Will return for sure!" },
            ].map((t) => (
              <figure key={t.name} className="rounded-xl border border-gold/30 bg-card p-7 shadow-soft">
                <Quote className="h-7 w-7 text-gold" />
                <blockquote className="mt-3 font-serif text-lg italic leading-relaxed text-foreground/85">"{t.text}"</blockquote>
                <figcaption className="mt-5 flex items-center justify-between">
                  <span className="font-display text-maroon-deep">{t.name}</span>
                  <span className="flex gap-0.5 text-gold">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/feedback" className="inline-flex items-center gap-2 font-display text-lg text-maroon-deep hover:text-gold">
              Share your story <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-maroon to-maroon-deep py-24 text-cream">
        <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 30%, oklch(0.72 0.13 80 / 0.5), transparent 50%)" }} />
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="ornament text-gold"><span className="ornament-line bg-gold" />Begin your story<span className="ornament-line bg-gold" /></p>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl">
            Let's bring your vision <span className="text-gold-foil italic">to life.</span>
          </h2>
          <p className="mt-5 text-cream/80">
            Book a consultation at our atelier in Jeypore. We'll sketch, source the finest threads and stones, and craft a piece worthy of your moment.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link to="/booking" className="rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-maroon-deep shadow-luxe">Book Now</Link>
            <Link to="/contact" className="rounded-full border border-cream/40 px-7 py-3.5 text-sm font-medium text-cream hover:bg-cream/10">Contact Studio</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Header({ eyebrow, title, subtitle, light }: { eyebrow: string; title: string; subtitle?: string; light?: boolean }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className={["ornament", light ? "text-gold" : "text-gold"].join(" ")}>
        <span className={["ornament-line", light ? "bg-gold" : ""].join(" ")} />{eyebrow}<span className={["ornament-line", light ? "bg-gold" : ""].join(" ")} />
      </p>
      <h2 className={["mt-5 font-display text-4xl sm:text-5xl", light ? "text-cream" : "text-maroon-deep"].join(" ")}>{title}</h2>
      {subtitle && <p className={["mt-4", light ? "text-cream/75" : "text-muted-foreground"].join(" ")}>{subtitle}</p>}
    </div>
  );
}
