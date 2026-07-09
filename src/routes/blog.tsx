import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "./about";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  tag: string | null;
  published: boolean;
  published_at: string | null;
};

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Embroidery Tips & Bridal Trends · Gayatri Embroidery Studio" },
      {
        name: "description",
        content:
          "Embroidery tips, bridal fashion trends, and design inspiration from the Gayatri Embroidery Studio atelier.",
      },
      { property: "og:title", content: "Blog — Gayatri Embroidery Studio" },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: Blog,
});

function Blog() {
  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["blog"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });

      if (error) throw error;

      return data;
    },
  });

  if (isLoading) {
    return <div className="py-20 text-center text-muted-foreground">Loading articles...</div>;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Journal"
        title="From the atelier"
        subtitle="Stories, tips and trends from the loom."
      />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group overflow-hidden rounded-xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-luxe"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={post.cover_image_url || "/placeholder.jpg"}
                  alt={post.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="p-6">
                {post.tag && (
                  <span className="text-[10px] uppercase tracking-[0.25em] text-gold">
                    {post.tag}
                  </span>
                )}

                <h2 className="mt-2 font-display text-xl text-maroon-deep">{post.title}</h2>

                <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>

                <Link to="/contact">Read more →</Link>
              </div>
            </article>
          ))}
        </div>

        {!posts.length && (
          <p className="mt-12 text-center text-sm text-muted-foreground">
            No blog posts available.
          </p>
        )}
      </section>
    </div>
  );
}
