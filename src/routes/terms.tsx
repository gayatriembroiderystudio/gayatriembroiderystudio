import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "./about";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Royal Boutique" },
      { name: "description", content: "Terms of use for the Royal Boutique website and services." },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: () => (
    <div>
      <PageHeader eyebrow="Legal" title="Terms & Conditions" />
      <article className="prose mx-auto max-w-3xl px-6 py-12 text-foreground/85">
        <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>
        <h2 className="mt-8 font-display text-2xl text-maroon-deep">Bookings & Payments</h2>
        <p className="mt-2">A 50% advance is required to confirm bespoke orders. Balance is payable on delivery or fitting. Customised pieces are non-refundable once work has begun.</p>
        <h2 className="mt-6 font-display text-2xl text-maroon-deep">Delivery</h2>
        <p className="mt-2">Estimated timelines are shared at the time of booking and may vary based on design complexity. We will keep you updated throughout.</p>
        <h2 className="mt-6 font-display text-2xl text-maroon-deep">Customer-supplied materials</h2>
        <p className="mt-2">We handle your fabrics with utmost care, but we do not accept liability for pre-existing fabric defects or shrinkage during embroidery.</p>
        <h2 className="mt-6 font-display text-2xl text-maroon-deep">Intellectual property</h2>
        <p className="mt-2">All design drawings, photographs and content on this website are property of Royal Boutique. Please do not reproduce without permission.</p>
        <h2 className="mt-6 font-display text-2xl text-maroon-deep">Contact</h2>
        <p className="mt-2">For questions, email <a href="mailto:charvi.maggamhub@gmail.com" className="text-maroon underline">charvi.maggamhub@gmail.com</a>.</p>
      </article>
    </div>
  ),
});
