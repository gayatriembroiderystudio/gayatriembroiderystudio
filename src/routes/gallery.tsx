import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "lucide-react";
import hero from "@/assets/hero-embroidery.jpg";
import s1 from "@/assets/showcase-1.jpg";
import s2 from "@/assets/showcase-2.jpg";
import s3 from "@/assets/showcase-3.jpg";
import about from "@/assets/about-craft.jpg";
import { PageHeader } from "./about";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Royal Boutique Couture & Embroidery" },
      { name: "description", content: "Explore bridal blouses, maggam, lehenga and saree embroidery from the Royal Boutique atelier." },
      { property: "og:title", content: "Gallery — Royal Boutique" },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: Gallery,
});

const CATEGORIES = ["All", "Bridal", "Maggam", "Zardosi", "Machine"] as const;

const ITEMS = [
  { src: hero, cat: "Bridal" },
  { src: s1, cat: "Maggam" },
  { src: s2, cat: "Bridal" },
  { src: s3, cat: "Machine" },
  { src: about, cat: "Zardosi" },
  { src: hero, cat: "Bridal" },
  { src: s2, cat: "Zardosi" },
  { src: s1, cat: "Maggam" },
  { src: s3, cat: "Machine" },
] as const;

function Gallery() {
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("All");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const items = filter === "All" ? ITEMS : ITEMS.filter((i) => i.cat === filter);
  return (
    <div>
      <PageHeader eyebrow="Portfolio" title="Recent works" subtitle="A curated selection from the loom." />
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={[
                "rounded-full border px-5 py-2 text-sm transition-all",
                filter === c
                  ? "border-maroon bg-maroon text-cream"
                  : "border-border text-foreground/70 hover:border-gold hover:text-maroon",
              ].join(" ")}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {items.map((it, i) => (
            <button
              key={i}
              onClick={() => setLightbox(it.src)}
              className="mb-4 block w-full overflow-hidden rounded-xl shadow-soft transition-transform hover:scale-[1.02]"
            >
              <img src={it.src} alt={`${it.cat} work`} loading="lazy" className="w-full" />
            </button>
          ))}
        </div>
      </section>

      {lightbox && (
        <div onClick={() => setLightbox(null)} className="fixed inset-0 z-[60] grid place-items-center bg-black/90 p-4 backdrop-blur-sm">
          <button className="absolute right-5 top-5 text-cream" aria-label="Close"><X className="h-7 w-7" /></button>
          <img src={lightbox} alt="" className="max-h-[90vh] max-w-full rounded-lg" />
        </div>
      )}
    </div>
  );
}
