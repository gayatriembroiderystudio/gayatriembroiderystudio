import { createFileRoute, Link } from "@tanstack/react-router";
import about from "@/assets/about-craft.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Gayatri Embroidery Studio — Couture Embroidery Atelier in Jeypore" },
      {
        name: "description",
        content:
          "The story of Gayatri Embroidery Studio — a Jeypore atelier devoted to bridal couture, maggam, aari and zardosi craftsmanship.",
      },
      { property: "og:title", content: "About Gayatri Embroidery Studio" },
      { property: "og:url", content: "/about" },
      { property: "og:image", content: about },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <div>
      <PageHeader
        eyebrow="Our Story"
        title="Tradition, restitched."
        subtitle="A modern atelier rooted in Odisha's heritage of bridal craftsmanship."
      />

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 md:items-center">
        <img
          src={about}
          alt="Embroidery threads and tools at the Gayatri Embroidery Studio atelier"
          loading="lazy"
          className="rounded-xl shadow-luxe"
        />
        <div>
          <p className="ornament text-gold">
            <span className="ornament-line" />
            The journey
            <span className="ornament-line" />
          </p>
          <h2 className="mt-4 font-display text-4xl text-maroon-deep">
            From a single needle to a couture house.
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Gayatri Embroidery Studio was founded with a passion for preserving the timeless beauty
            of traditional Indian embroidery while embracing the precision of modern computerized
            technology. Every creation reflects our dedication to craftsmanship, quality, and
            artistic excellence.
          </p>

          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Every design we create tells a unique story, and every thread is woven with passion,
            precision, and care. We are proud to continue crafting timeless embroidery that
            transforms ordinary fabrics into extraordinary works of art.
          </p>
        </div>
      </section>

      <section className="bg-secondary py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-3">
          {[
            {
              title: "Our Mission",
              text: "To preserve traditional Indian embroidery while making bespoke couture accessible to every modern bride.",
            },
            {
              title: "Our Vision",
              text: "To be Odisha's most loved bridal atelier — where craft, technology and emotion meet.",
            },
            {
              title: "Our Promise",
              text: "Transparent pricing, on-time delivery and a finish that earns compliments at every glance.",
            },
          ].map((c) => (
            <div key={c.title} className="rounded-xl bg-background p-8 shadow-soft">
              <h3 className="font-display text-2xl text-maroon-deep">{c.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-center font-display text-4xl text-maroon-deep">Our process</h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
          Four considered steps from first sketch to final fitting.
        </p>
        <ol className="mt-12 grid gap-6 md:grid-cols-4">
          {[
            [
              "01",
              "Consultation",
              "We listen, sketch and align on the mood, palette and silhouette.",
            ],
            [
              "02",
              "Design",
              "Our designers digitise patterns and curate the finest threads, stones and zari.",
            ],
            [
              "03",
              "Crafting",
              "Karigars hand-finish or our machines stitch with sub-millimetre precision.",
            ],
            [
              "04",
              "Finishing",
              "12-point quality check, gentle pressing, and luxurious packaging.",
            ],
          ].map(([num, title, text]) => (
            <li key={num} className="rounded-xl border border-border bg-card p-6">
              <p className="font-display text-3xl text-gold-foil">{num}</p>
              <h3 className="mt-2 font-display text-xl text-maroon-deep">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 text-center">
          <Link
            to="/booking"
            className="rounded-full bg-maroon px-7 py-3 text-sm font-medium text-cream"
          >
            Begin your consultation
          </Link>
        </div>
      </section>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="brocade-bg border-b border-border/60 py-20 text-center sm:py-28">
      <p className="ornament text-gold">
        <span className="ornament-line" />
        {eyebrow}
        <span className="ornament-line" />
      </p>
      <h1 className="mt-5 font-display text-5xl text-maroon-deep sm:text-6xl">{title}</h1>
      {subtitle && <p className="mx-auto mt-4 max-w-2xl px-6 text-muted-foreground">{subtitle}</p>}
    </section>
  );
}
