import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "lucide-react";
import { PageHeader } from "./about";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Item = {
  id: string;
  title: string;
  image_url: string;
  category: string;
  description: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
};

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Gayatri Embroidery Studio Couture & Embroidery" },
      {
        name: "description",
        content:
          "Explore bridal blouses, maggam, lehenga and saree embroidery from the Royal Boutique atelier.",
      },
      { property: "og:title", content: "Gallery — Gayatri Embroidery Studio" },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: Gallery,
});

const CATEGORIES = [
  "All",
  "Bridal",
  "Maggam",
  "Zardosi",
  "Machine",
  "Lehenga",
  "Stone Work",
  "Aari Work",
] as const;

function Gallery() {
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("All");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const { data: items = [], isLoading } = useQuery<Item[]>({
    queryKey: ["gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data;
    },
  });
  const filtered =
    filter === "All"
      ? items
      : items.filter((i) => (i.category ?? "").trim().toLowerCase() === filter.toLowerCase());
  if (isLoading) {
    return <div className="py-20 text-center text-muted-foreground">Loading gallery...</div>;
  }
  return (
    <div>
      <PageHeader
        eyebrow="Portfolio"
        title="Recent works"
        subtitle="A curated selection from the loom."
      />
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
          {filtered.map((it) => (
            <button
              key={it.id}
              onClick={() => setLightbox(it.image_url)}
              className="mb-4 block w-full overflow-hidden rounded-xl shadow-soft transition-transform hover:scale-[1.02]"
            >
              <img src={it.image_url} alt={it.title} loading="lazy" className="w-full" />
            </button>
          ))}
        </div>
      </section>

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[60] grid place-items-center bg-black/90 p-4 backdrop-blur-sm"
        >
          <button className="absolute right-5 top-5 text-cream" aria-label="Close">
            <X className="h-7 w-7" />
          </button>
          <img src={lightbox} alt="" className="max-h-[90vh] max-w-full rounded-lg" />
        </div>
      )}
    </div>
  );
}
