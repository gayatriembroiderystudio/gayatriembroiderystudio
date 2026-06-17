import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "./about";
import s1 from "@/assets/showcase-1.jpg";
import s2 from "@/assets/showcase-2.jpg";
import s3 from "@/assets/showcase-3.jpg";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Embroidery Tips & Bridal Trends · Royal Boutique" },
      { name: "description", content: "Embroidery tips, bridal fashion trends, and design inspiration from the Royal Boutique atelier." },
      { property: "og:title", content: "Blog — Royal Boutique" },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: Blog,
});

const POSTS = [
  { title: "Choosing the right embroidery for your bridal blouse", excerpt: "Maggam, aari, zardosi — a guide to picking the technique that matches your style and silhouette.", img: s1, tag: "Bridal" },
  { title: "Caring for your embroidered sarees", excerpt: "Simple habits that keep zari and stones looking new for years.", img: s2, tag: "Care" },
  { title: "Why computerized embroidery is changing the game", excerpt: "Precision, repeatability and intricate motifs at scale — meet our digital looms.", img: s3, tag: "Tech" },
];

function Blog() {
  return (
    <div>
      <PageHeader eyebrow="Journal" title="From the atelier" subtitle="Stories, tips and trends from the loom." />
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((p) => (
            <article key={p.title} className="group overflow-hidden rounded-xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-luxe">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={p.img} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <span className="text-[10px] uppercase tracking-[0.25em] text-gold">{p.tag}</span>
                <h2 className="mt-2 font-display text-xl text-maroon-deep">{p.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
                <Link to="/contact" className="mt-4 inline-block text-sm font-medium text-gold hover:text-maroon">Read more →</Link>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-12 text-center text-sm text-muted-foreground">More articles coming soon.</p>
      </section>
    </div>
  );
}
