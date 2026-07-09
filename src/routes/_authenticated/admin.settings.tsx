import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: WebsiteSettings,
});

function WebsiteSettings() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["website-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").single();

      if (error) throw error;

      return data;
    },
  });

  const [form, setForm] = useState({
    business_name: "",
    tagline: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    business_hours: "",
    google_maps_embed: "",
    facebook: "",
    instagram: "",
    youtube: "",
    hero_title: "",
    hero_subtitle: "",
    hero_description: "",
    seo_title: "",
    seo_description: "",
    footer_text: "",
  });
  const [saving, setSaving] = useState(false);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);

  const [logoPreview, setLogoPreview] = useState("");
  const [faviconPreview, setFaviconPreview] = useState("");
  const [heroPreview, setHeroPreview] = useState("");

  useEffect(() => {
    if (data) {
      setForm({
        business_name: data.business_name ?? "",
        tagline: data.tagline ?? "",
        phone: data.phone ?? "",
        whatsapp: data.whatsapp ?? "",
        email: data.email ?? "",
        address: data.address ?? "",
        business_hours: data.business_hours ?? "",
        google_maps_embed: data.google_maps_embed ?? "",
        facebook: data.facebook ?? "",
        instagram: data.instagram ?? "",
        youtube: data.youtube ?? "",
        hero_title: data.hero_title ?? "",
        hero_subtitle: data.hero_subtitle ?? "",
        hero_description: data.hero_description ?? "",
        seo_title: data.seo_title ?? "",
        seo_description: data.seo_description ?? "",
        footer_text: data.footer_text ?? "",
      });

      setLogoPreview(data.logo_url ?? "");
      setFaviconPreview(data.favicon_url ?? "");
      setHeroPreview(data.hero_image ?? "");
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex h-80 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-maroon" />
      </div>
    );
  }
  async function uploadImage(file: File | null, bucket: string) {
    if (!file) return null;

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage.from(bucket).upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);

    return data.publicUrl;
  }

  async function saveSettings() {
    try {
      setSaving(true);

      const logo = (await uploadImage(logoFile, "logos")) ?? logoPreview;

      const favicon = (await uploadImage(faviconFile, "logos")) ?? faviconPreview;

      const hero = (await uploadImage(heroFile, "hero-images")) ?? heroPreview;

      const { error } = await supabase
        .from("site_settings")
        .update({
          ...form,

          logo_url: logo,

          favicon_url: favicon,

          hero_image: hero,
        })
        .eq("id", data.id);

      if (error) throw error;
      await queryClient.invalidateQueries({
        queryKey: ["settings"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["website-settings"],
      });

      toast.success("Website updated successfully");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="font-display text-3xl text-maroon-deep">Website Settings</h1>

        <p className="mt-2 text-muted-foreground">Manage all website information from one place.</p>
      </div>

      <div className="rounded-2xl border bg-card p-8 shadow-soft">
        {/* Logo, Favicon & Hero Upload */}
        <div className="mb-8 grid gap-8 md:grid-cols-3">
          {/* Logo */}
          <div>
            <label className="mb-2 block text-sm font-medium">Logo</label>

            {logoPreview && (
              <img
                src={logoPreview}
                alt="Logo"
                className="mb-4 h-24 w-24 rounded-lg border object-contain"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                setLogoFile(file);
                setLogoPreview(URL.createObjectURL(file));
              }}
            />
          </div>

          {/* Favicon */}
          <div>
            <label className="mb-2 block text-sm font-medium">Favicon</label>

            {faviconPreview && (
              <img
                src={faviconPreview}
                alt="Favicon"
                className="mb-4 h-16 w-16 rounded border object-contain"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                setFaviconFile(file);
                setFaviconPreview(URL.createObjectURL(file));
              }}
            />
          </div>

          {/* Hero Image */}
          <div>
            <label className="mb-2 block text-sm font-medium">Hero Image</label>

            {heroPreview && (
              <img
                src={heroPreview}
                alt="Hero"
                className="mb-4 h-24 w-full rounded-lg border object-cover"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                setHeroFile(file);
                setHeroPreview(URL.createObjectURL(file));
              }}
            />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <InputField
            label="Business Name"
            value={form.business_name}
            onChange={(v) => setForm({ ...form, business_name: v })}
          />

          <InputField
            label="Tagline"
            value={form.tagline}
            onChange={(v) => setForm({ ...form, tagline: v })}
          />

          <InputField
            label="Phone"
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
          />

          <InputField
            label="WhatsApp"
            value={form.whatsapp}
            onChange={(v) => setForm({ ...form, whatsapp: v })}
          />

          <InputField
            label="Email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />

          <InputField
            label="Business Hours"
            value={form.business_hours}
            onChange={(v) => setForm({ ...form, business_hours: v })}
          />
        </div>

        <div className="mt-6">
          <TextAreaField
            label="Address"
            value={form.address}
            onChange={(v) => setForm({ ...form, address: v })}
          />
        </div>

        <div className="mt-6">
          <TextAreaField
            label="Google Maps Embed URL"
            value={form.google_maps_embed}
            onChange={(v) =>
              setForm({
                ...form,
                google_maps_embed: v,
              })
            }
          />
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-8 shadow-soft">
        <h2 className="mb-6 text-2xl font-display text-maroon-deep">Social Media</h2>

        <div className="grid gap-6 md:grid-cols-3">
          <InputField
            label="Facebook"
            value={form.facebook}
            onChange={(v) => setForm({ ...form, facebook: v })}
          />

          <InputField
            label="Instagram"
            value={form.instagram}
            onChange={(v) => setForm({ ...form, instagram: v })}
          />

          <InputField
            label="YouTube"
            value={form.youtube}
            onChange={(v) => setForm({ ...form, youtube: v })}
          />
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-8 shadow-soft">
        <h2 className="mb-6 text-2xl font-display text-maroon-deep">Homepage</h2>

        <InputField
          label="Hero Title"
          value={form.hero_title}
          onChange={(v) => setForm({ ...form, hero_title: v })}
        />

        <div className="mt-6">
          <TextAreaField
            label="Hero Subtitle"
            value={form.hero_subtitle}
            onChange={(v) =>
              setForm({
                ...form,
                hero_subtitle: v,
              })
            }
          />
        </div>

        <div className="mt-6">
          <TextAreaField
            label="Hero Description"
            value={form.hero_description}
            onChange={(v) =>
              setForm({
                ...form,
                hero_description: v,
              })
            }
          />
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-8 shadow-soft">
        <h2 className="mb-6 text-2xl font-display text-maroon-deep">SEO</h2>

        <InputField
          label="SEO Title"
          value={form.seo_title}
          onChange={(v) =>
            setForm({
              ...form,
              seo_title: v,
            })
          }
        />

        <div className="mt-6">
          <TextAreaField
            label="SEO Description"
            value={form.seo_description}
            onChange={(v) =>
              setForm({
                ...form,
                seo_description: v,
              })
            }
          />
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-8 shadow-soft">
        <InputField
          label="Footer Copyright"
          value={form.footer_text}
          onChange={(v) =>
            setForm({
              ...form,
              footer_text: v,
            })
          }
        />
      </div>

      <button
        onClick={saveSettings}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-xl bg-maroon px-8 py-3 font-medium text-white disabled:opacity-60"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save Changes
      </button>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border p-3"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>

      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border p-3"
      />
    </label>
  );
}
