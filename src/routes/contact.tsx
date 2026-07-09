import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2, Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/hooks/useSettings";
import { PageHeader } from "./about";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Gayatri Embroidery Studio — Jeypore, Odisha" },
      {
        name: "description",
        content:
          "Visit, call, WhatsApp or email Gayatri Embroidery Studio in Jeypore, Odisha. Open Mon–Sat, 10am–8pm.",
      },
      { property: "og:title", content: "Contact — Gayatri Embroidery Studio" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const [loading, setLoading] = useState(false);
  const { data: settings, isLoading } = useSettings();

  if (isLoading) {
    return null;
  }
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const schema = z.object({
      name: z.string().trim().min(2).max(100),
      email: z.string().trim().email().max(255).optional().or(z.literal("")),
      mobile: z.string().trim().max(20).optional().or(z.literal("")),
      subject: z.string().trim().max(200).optional().or(z.literal("")),
      message: z.string().trim().min(5).max(2000),
    });
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email || null,
      mobile: parsed.data.mobile || null,
      subject: parsed.data.subject || null,
      message: parsed.data.message,
    });
    setLoading(false);
    if (error) {
      toast.error("Couldn't send. Please try again.");
      return;
    }
    toast.success("Message sent! We'll be in touch shortly.");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <div>
      <PageHeader
        eyebrow="Get in touch"
        title="Visit our atelier"
        subtitle="Step into our Jeypore studio or reach out — we'd love to hear from you."
      />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            {[
              {
                icon: MapPin,
                title: "Atelier",
                text: settings?.address,
                href: settings?.google_maps_embed,
              },
              {
                icon: Phone,
                title: "Phone",
                text: settings?.phone,
                href: `tel:${settings?.phone.replace(/\s/g, "")}`,
              },
              {
                icon: MessageCircle,
                title: "WhatsApp",
                text: "Chat with us",
                href: settings?.whatsapp,
              },
              {
                icon: Mail,
                title: "Email",
                text: settings?.email,
                href: `mailto:${settings?.email}`,
              },
              { icon: Clock, title: "Hours", text: settings?.business_hours },
            ].map((it) => (
              <div
                key={it.title}
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-5"
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold/30 to-gold/10 text-gold">
                  <it.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-lg text-maroon-deep">{it.title}</p>
                  {it.href ? (
                    <a
                      href={it.href}
                      target={it.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="break-words text-sm text-muted-foreground hover:text-maroon"
                    >
                      {it.text}
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground">{it.text}</p>
                  )}
                </div>
              </div>
            ))}
            <div className="lg:col-span-2 mt-8 overflow-hidden rounded-2xl border border-border shadow-soft">
              <iframe
                title="Gayatri Embroidery Studio location"
                src={settings?.google_maps_embed || ""}
                className="w-full h-[500px] rounded-2xl"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="h-fit rounded-2xl border border-border bg-card p-7 shadow-soft"
          >
            <h2 className="font-display text-2xl text-maroon-deep">Send a message</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <FormField label="Name" name="name" required />
              <FormField label="Email" name="email" type="email" />
              <FormField label="Mobile" name="mobile" type="tel" />
              <FormField label="Subject" name="subject" />
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-maroon-deep/80">
                  Message *
                </span>
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40"
                />
              </label>
            </div>
            <button
              disabled={loading}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-maroon px-7 py-3 text-sm font-semibold text-cream disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />} Send message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function FormField(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-maroon-deep/80">
        {label}
        {props.required && <span className="text-gold"> *</span>}
      </span>
      <input
        {...rest}
        className="w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40"
      />
    </label>
  );
}
