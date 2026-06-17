import { createFileRoute, Link } from "@tanstack/react-router";
import { Scissors } from "lucide-react";
import { SERVICES } from "@/lib/site";
import { PageHeader } from "./about";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Embroidery, Maggam, Aari, Zardosi & Bridal Couture" },
      { name: "description", content: "Full menu of services at Royal Boutique: computerized embroidery, maggam, aari, zardosi, bridal blouse design, lehenga & saree embroidery and more." },
      { property: "og:title", content: "Services — Royal Boutique" },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: Services,
});

function Services() {
  return (
    <div>
      <PageHeader eyebrow="What we craft" title="Our services" subtitle="Fourteen signature services, each finished by hands that care." />
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <article key={s.slug} className="group flex flex-col rounded-xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-gold hover:shadow-luxe">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-gold/30 to-gold/10 text-gold">
                <Scissors className="h-5 w-5" />
              </div>
              <h2 className="mt-5 font-display text-2xl text-maroon-deep">{s.name}</h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.desc}</p>
              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm font-medium text-maroon">{s.price}</span>
                <Link to="/booking" className="text-sm font-medium text-gold hover:text-maroon">Inquire →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
