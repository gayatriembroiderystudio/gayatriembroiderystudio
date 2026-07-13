import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/admin/homepage-showcase")({
  component: HomepageShowcaseAdmin,
});

export default function HomepageShowcaseAdmin() {
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [buttonText, setButtonText] = useState("View Gallery");
  const [buttonLink, setButtonLink] = useState("/gallery");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(true);

  const { data: showcaseItems = [], isLoading } = useQuery({
    queryKey: ["homepage-showcase"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("homepage_showcase")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;

      return data;
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      toast.error("Please choose an image.");
      return;
    }

    try {
      setLoading(true);

      const fileName = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage.from("homepage").upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("homepage").getPublicUrl(fileName);

      const { error } = await supabase.from("homepage_showcase").insert({
        title,
        subtitle,
        image_url: data.publicUrl,
        button_text: buttonText,
        button_link: buttonLink,
        display_order: displayOrder,
        is_active: isActive,
      });

      if (error) throw error;

      toast.success("Showcase added.");

      await queryClient.invalidateQueries({
        queryKey: ["homepage-showcase"],
      });

      setTitle("");
      setSubtitle("");
      setButtonText("View Gallery");
      setButtonLink("/gallery");
      setDisplayOrder(0);
      setFile(null);
      setIsActive(true);

      setShowForm(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteShowcase(id: string) {
    if (!confirm("Delete this showcase?")) return;

    const { error } = await supabase.from("homepage_showcase").delete().eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Deleted");

    queryClient.invalidateQueries({
      queryKey: ["homepage-showcase"],
    });
  }

  async function togglePublish(item: any) {
    const { error } = await supabase
      .from("homepage_showcase")
      .update({
        is_active: !item.is_active,
      })
      .eq("id", item.id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(item.is_active ? "Unpublished" : "Published");

    queryClient.invalidateQueries({
      queryKey: ["homepage-showcase"],
    });
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-5xl font-normal text-maroon-deep">
            Homepage Featured Showcase
          </h1>

          <p className="mt-2 text-lg text-muted-foreground">
            Add and manage homepage showcase images.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-full bg-maroon px-6 py-3 text-white hover:bg-maroon/90"
        >
          {showForm ? "Close" : "+ Add Showcase"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-3xl border border-gold/20 bg-card p-8 shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Featured Image */}
            <div>
              <label className="mb-2 block text-sm font-medium uppercase tracking-wider text-maroon-deep">
                Featured Image
              </label>

              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full rounded-lg border border-input bg-background p-3"
              />
            </div>

            {/* Title + Display Order */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium uppercase tracking-wider text-maroon-deep">
                  Title
                </label>

                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background p-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium uppercase tracking-wider text-maroon-deep">
                  Display Order
                </label>

                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-full rounded-lg border border-input bg-background p-3"
                />
              </div>
            </div>

            {/* Subtitle */}
            <div>
              <label className="mb-2 block text-sm font-medium uppercase tracking-wider text-maroon-deep">
                Subtitle
              </label>

              <textarea
                rows={5}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full rounded-lg border border-input bg-background p-3"
              />
            </div>

            {/* Button */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium uppercase tracking-wider text-maroon-deep">
                  Button Text
                </label>

                <input
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background p-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium uppercase tracking-wider text-maroon-deep">
                  Button Link
                </label>

                <input
                  value={buttonLink}
                  onChange={(e) => setButtonLink(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background p-3"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t pt-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <span>Published</span>
              </label>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setTitle("");
                    setSubtitle("");
                    setButtonText("View Gallery");
                    setButtonLink("/gallery");
                    setDisplayOrder(0);
                    setFile(null);
                    setIsActive(true);
                  }}
                  className="rounded-full border border-gold/30 px-6 py-2.5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full bg-maroon px-8 py-2.5 font-medium text-white"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl text-maroon-deep">Existing Showcase</h2>

          <span className="rounded-full bg-maroon/10 px-4 py-2 text-sm">
            {showcaseItems.length} Items
          </span>
        </div>

        {showcaseItems.length === 0 && (
          <div className="rounded-3xl border border-dashed p-16 text-center text-muted-foreground">
            No showcase images found.
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {showcaseItems.map((item: any) => (
            <div key={item.id} className="overflow-hidden rounded-3xl border bg-card shadow-soft">
              <img src={item.image_url} alt={item.title} className="h-64 w-full object-cover" />

              <div className="space-y-4 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>

                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {item.subtitle}
                    </p>
                  </div>

                  {item.is_active ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      Published
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                      Draft
                    </span>
                  )}
                </div>

                <div className="text-sm text-muted-foreground">Order : {item.display_order}</div>

                <div className="flex gap-2">
                  <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border py-2 hover:bg-muted">
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() => togglePublish(item)}
                    className="rounded-xl border p-2 hover:bg-muted"
                  >
                    {item.is_active ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>

                  <button
                    onClick={() => deleteShowcase(item.id)}
                    className="rounded-xl border border-red-300 p-2 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
