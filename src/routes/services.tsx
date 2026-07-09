import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "./about";

type Service = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  price: string;
  featured: boolean;
  status: boolean;
};

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Embroidery, Maggam, Aari, Zardosi & Bridal Couture" },
      {
        name: "description",
        content:
          "Full menu of services at Gayatri Embroidery Studio: computerized embroidery, maggam, aari, zardosi, bridal blouse design, lehenga & saree embroidery and more.",
      },
      { property: "og:title", content: "Services — Gayatri Embroidery Studio" },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: Services,
});

function Services() {
  const { data: featured = [], isLoading } = useQuery({
    queryKey: ["home-featured-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("status", true)
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) throw error;

      return data;
    },
  });
  if (isLoading) {
    return <div className="py-20 text-center text-muted-foreground">Loading services...</div>;
  }
  return (
    <div>
      <PageHeader
        eyebrow="What we craft"
        title="Our services"
        subtitle="Fourteen signature services, each finished by hands that care."
      />
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((service) => (
            <article
              key={service.id}
              className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-gold hover:shadow-luxe"
            >
              <img
                src={service.image_url}
                alt={service.name}
                className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              <div className="p-6">
                <h3 className="font-display text-2xl text-maroon-deep">{service.name}</h3>

                <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>

                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <span className="font-medium text-maroon">{service.price}</span>

                  <Link to="/booking" className="text-sm font-medium text-gold hover:text-maroon">
                    Inquire →
                  </Link>
                </div>
              </div>
            </article>
          ))}

          {!isLoading && featured.length === 0 && (
            <p className="col-span-3 text-center text-muted-foreground">
              No featured services available.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
