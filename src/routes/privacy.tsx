import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "./about";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Gayatri Embroidery Studio" },
      {
        name: "description",
        content:
          "How Gayatri Embroidery Studio collects, uses and protects your personal information.",
      },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: () => (
    <div>
      <PageHeader eyebrow="Legal" title="Privacy Policy" />
      <article className="prose mx-auto max-w-3xl px-6 py-12 text-foreground/85">
        <p className="text-sm text-muted-foreground">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h2 className="mt-8 font-display text-2xl text-maroon-deep">Information we collect</h2>
        <p className="mt-2">
          We collect information you provide directly — name, contact number, email, address and
          design preferences — when you book a consultation, leave feedback or contact us.
        </p>
        <h2 className="mt-6 font-display text-2xl text-maroon-deep">How we use your information</h2>
        <ul className="ml-5 mt-2 list-disc space-y-1">
          <li>To confirm and manage your bookings</li>
          <li>To respond to inquiries and provide customer support</li>
          <li>To display approved reviews on our website</li>
          <li>To improve our services</li>
        </ul>
        <h2 className="mt-6 font-display text-2xl text-maroon-deep">Sharing</h2>
        <p className="mt-2">
          We do not sell your information. We share only with service providers (e.g. couriers) as
          necessary to fulfil your order.
        </p>
        <h2 className="mt-6 font-display text-2xl text-maroon-deep">Your rights</h2>
        <p className="mt-2">
          You may request access, correction or deletion of your information at any time by emailing
          us.
        </p>
        <h2 className="mt-6 font-display text-2xl text-maroon-deep">Contact</h2>
        <p className="mt-2">
          For privacy questions, email{" "}
          <a href="mailto:charvi.maggamhub@gmail.com" className="text-maroon underline">
            charvi.maggamhub@gmail.com
          </a>
          .
        </p>
      </article>
    </div>
  ),
});
