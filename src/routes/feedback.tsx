import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Star, Loader2, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "./about";

export const Route = createFileRoute("/feedback")({
  head: () => ({
    meta: [
      { title: "Reviews & Feedback — Royal Boutique" },
      { name: "description", content: "Read what our brides say, and leave your own review for Royal Boutique." },
      { property: "og:title", content: "Customer Reviews — Royal Boutique" },
      { property: "og:url", content: "/feedback" },
    ],
    links: [{ rel: "canonical", href: "/feedback" }],
  }),
  component: Feedback,
});

type Review = { id: string; name: string; rating: number; review: string; created_at: string };

function Feedback() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from("feedback").select("id,name,rating,review,created_at").eq("approved", true).order("created_at", { ascending: false }).limit(30).then(({ data }) => {
      if (data) setReviews(data as Review[]);
    });
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const schema = z.object({
      name: z.string().trim().min(2).max(80),
      review: z.string().trim().min(10, "Please write a few words").max(1000),
    });
    const parsed = schema.safeParse({ name: fd.get("name"), review: fd.get("review") });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setLoading(true);
    const { error } = await supabase.from("feedback").insert({ ...parsed.data, rating });
    setLoading(false);
    if (error) { toast.error("Couldn't submit. Please try again."); return; }
    toast.success("Thank you! Your review will appear after our team approves it.");
    (e.target as HTMLFormElement).reset();
    setRating(5);
  }

  return (
    <div>
      <PageHeader eyebrow="Reviews" title="Stories from our clients" subtitle="Five-star moments stitched into memory." />
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1fr_22rem]">
        <div className="grid gap-5 sm:grid-cols-2">
          {reviews.length === 0 && <p className="col-span-full rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">Be the first to share your experience.</p>}
          {reviews.map((r) => (
            <article key={r.id} className="rounded-xl border border-gold/30 bg-card p-6 shadow-soft">
              <Quote className="h-6 w-6 text-gold" />
              <p className="mt-3 font-serif text-lg italic text-foreground/85">"{r.review}"</p>
              <div className="mt-5 flex items-center justify-between">
                <span className="font-display text-maroon-deep">{r.name}</span>
                <span className="flex text-gold">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</span>
              </div>
            </article>
          ))}
        </div>

        <form onSubmit={onSubmit} className="h-fit rounded-2xl border border-border bg-card p-7 shadow-soft">
          <h3 className="font-display text-2xl text-maroon-deep">Leave a review</h3>
          <p className="mt-1 text-xs text-muted-foreground">Your review appears after admin approval.</p>
          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-maroon-deep/80">Your name *</span>
              <input name="name" required className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40" />
            </label>
            <div>
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-maroon-deep/80">Rating</span>
              <div className="flex gap-1">
                {[1,2,3,4,5].map((n) => (
                  <button type="button" key={n} onClick={() => setRating(n)} aria-label={`${n} stars`}>
                    <Star className={["h-7 w-7 transition-colors", n <= rating ? "fill-gold text-gold" : "text-border"].join(" ")} />
                  </button>
                ))}
              </div>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-maroon-deep/80">Your review *</span>
              <textarea name="review" required rows={5} className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40" />
            </label>
          </div>
          <button disabled={loading} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-maroon px-7 py-3 text-sm font-semibold text-cream disabled:opacity-60">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Submit
          </button>
        </form>
      </section>
    </div>
  );
}
