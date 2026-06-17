import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "./about";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Royal Boutique" },
      { name: "description", content: "Frequently asked questions about embroidery services, pricing, delivery and bridal consultations at Royal Boutique." },
      { property: "og:title", content: "FAQ — Royal Boutique" },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  component: FAQ,
});

const FAQS = [
  { q: "How long does a bridal blouse take?", a: "Typically 3–6 weeks depending on the intricacy of design. For rush orders, please contact us — we'll try our best to accommodate." },
  { q: "Do you ship outside Jeypore?", a: "Yes. We ship across India through trusted couriers. International shipping is available on request." },
  { q: "Can I bring my own fabric?", a: "Absolutely. We frequently customise heirloom and personal fabrics. Bring it in for a consultation." },
  { q: "How is pricing decided?", a: "Pricing depends on the design, fabric, materials (stones, zari, beads) and the number of artisan hours required. We provide a detailed estimate after consultation." },
  { q: "Do you take small orders like logos?", a: "Yes — our computerized embroidery handles single-piece logo orders as well as bulk uniform runs." },
  { q: "How do I book a consultation?", a: "Visit our Book Online page, fill in the form, and our team will call you to confirm the date and time." },
  { q: "What payment methods do you accept?", a: "Cash, UPI, card and bank transfer. A 50% advance is typically taken to begin work." },
  { q: "Do you offer alterations?", a: "Yes — fittings and small alterations are included for bridal commissions." },
];

function FAQ() {
  const [q, setQ] = useState("");
  const items = useMemo(() => FAQS.filter((f) => (f.q + f.a).toLowerCase().includes(q.toLowerCase())), [q]);
  return (
    <div>
      <PageHeader eyebrow="Help" title="Frequently asked" subtitle="Quick answers to common questions." />
      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="relative mb-8">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search questions…"
            className="w-full rounded-full border border-input bg-background py-3 pl-11 pr-4 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </div>
        <div className="space-y-3">
          {items.map((f) => (
            <details key={f.q} className="group rounded-xl border border-border bg-card p-5 open:border-gold open:shadow-soft">
              <summary className="cursor-pointer list-none font-display text-lg text-maroon-deep marker:hidden">
                <span className="flex items-center justify-between gap-4">
                  {f.q}
                  <span className="text-gold transition-transform group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
          {items.length === 0 && <p className="text-center text-muted-foreground">No results.</p>}
        </div>
      </section>
    </div>
  );
}
