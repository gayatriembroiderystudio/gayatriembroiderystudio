import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SERVICES } from "@/lib/site";
import { PageHeader } from "./about";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Book a Consultation — Gayatri Embroidery Studio" },
      {
        name: "description",
        content: "Book your bespoke embroidery or maggam consultation at Royal Boutique, Jeypore.",
      },
      { property: "og:title", content: "Book a Consultation" },
      { property: "og:url", content: "/booking" },
    ],
    links: [{ rel: "canonical", href: "/booking" }],
  }),
  component: Booking,
});

const schema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  mobile: z.string().trim().min(7, "Valid mobile required").max(20),
  email: z.string().trim().email("Valid email").max(255).optional().or(z.literal("")),
  service_type: z.string().min(1, "Pick a service"),
  preferred_date: z.string().optional().or(z.literal("")),
  preferred_time: z.string().optional().or(z.literal("")),
  address: z.string().max(500).optional().or(z.literal("")),
  design_requirements: z.string().max(1500).optional().or(z.literal("")),
  additional_notes: z.string().max(1000).optional().or(z.literal("")),
});

function Booking() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd) as Record<string, string>;
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("bookings").insert({
      name: parsed.data.name,
      mobile: parsed.data.mobile,
      email: parsed.data.email || null,
      service_type: parsed.data.service_type,
      preferred_date: parsed.data.preferred_date || null,
      preferred_time: parsed.data.preferred_time || null,
      address: parsed.data.address || null,
      design_requirements: parsed.data.design_requirements || null,
      additional_notes: parsed.data.additional_notes || null,
    });
    setLoading(false);
    if (error) {
      console.error("Booking Error:", error);
      toast.error(error.message);
      return;
    }
    setDone(true);
    toast.success("Booking received! We'll call you shortly.");
    (e.target as HTMLFormElement).reset();
  }

  if (done) {
    return (
      <div>
        <PageHeader eyebrow="Booking" title="Thank you" />
        <section className="mx-auto max-w-xl px-6 py-20 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-gold" />
          <h2 className="mt-6 font-display text-3xl text-maroon-deep">Your request is in.</h2>
          <p className="mt-4 text-muted-foreground">
            Our team will reach out within a few hours to confirm your consultation. For anything
            urgent, please WhatsApp us.
          </p>
          <button
            onClick={() => setDone(false)}
            className="mt-8 rounded-full border border-maroon px-6 py-2.5 text-sm text-maroon hover:bg-maroon hover:text-cream"
          >
            Submit another
          </button>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Book Online"
        title="Reserve your consultation"
        subtitle="Fill in a few details — we'll call you to confirm."
      />
      <section className="mx-auto max-w-3xl px-6 py-16">
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-10"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" name="name" required />
            <Field label="Mobile number" name="mobile" required type="tel" placeholder="+91" />
            <Field label="Email" name="email" type="email" />
            <SelectField label="Service" name="service_type" required>
              <option value="">Select a service</option>
              {SERVICES.map((s) => (
                <option key={s.slug} value={s.name}>
                  {s.name}
                </option>
              ))}
            </SelectField>
            <Field label="Preferred date" name="preferred_date" type="date" />
            <Field label="Preferred time" name="preferred_time" placeholder="e.g. 11:00 AM" />
            <Field label="Address" name="address" className="sm:col-span-2" />
            <Textarea
              label="Design requirements"
              name="design_requirements"
              className="sm:col-span-2"
              placeholder="Colours, motifs, fabric, occasion…"
            />
            <Textarea label="Additional notes" name="additional_notes" className="sm:col-span-2" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-maroon to-maroon-deep px-7 py-3.5 text-sm font-semibold text-cream shadow-luxe transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Send booking request
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            We respect your privacy. Your details are used only to contact you about your booking.
          </p>
        </form>
      </section>
    </div>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, className, ...rest } = props;
  return (
    <label className={["block", className].join(" ")}>
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-maroon-deep/80">
        {label}
        {props.required && <span className="text-gold"> *</span>}
      </span>
      <input
        {...rest}
        className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm outline-none ring-gold/40 transition-all focus:border-gold focus:ring-2"
      />
    </label>
  );
}
function SelectField(props: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  const { label, className, children, ...rest } = props;
  return (
    <label className={["block", className].join(" ")}>
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-maroon-deep/80">
        {label}
        {props.required && <span className="text-gold"> *</span>}
      </span>
      <select
        {...rest}
        className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm outline-none ring-gold/40 transition-all focus:border-gold focus:ring-2"
      >
        {children}
      </select>
    </label>
  );
}
function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  const { label, className, ...rest } = props;
  return (
    <label className={["block", className].join(" ")}>
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-maroon-deep/80">
        {label}
      </span>
      <textarea
        {...rest}
        rows={4}
        className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm outline-none ring-gold/40 transition-all focus:border-gold focus:ring-2"
      />
    </label>
  );
}
