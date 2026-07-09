import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/service-add")({
  component: AddService,
});

function AddService() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState(true);

  const [image, setImage] = useState<File | null>(null);

  function slugify(text: string) {
    return text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  }

  async function uploadImage() {
    if (!image) return "";

    const fileName = `${Date.now()}-${image.name}`;

    const { error } = await supabase.storage.from("services").upload(fileName, image);

    if (error) throw error;

    const { data } = supabase.storage.from("services").getPublicUrl(fileName);

    return data.publicUrl;
  }

  async function saveService() {
    try {
      setLoading(true);

      const image_url = await uploadImage();

      const { error } = await supabase.from("services").insert({
        name,
        slug: slugify(name),
        description,
        price,
        image_url,
        featured,
        status,
      });

      if (error) throw error;

      toast.success("Service added successfully");

      navigate({
        to: "/admin/services",
      });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl text-maroon-deep">Add Service</h1>

        <p className="text-muted-foreground">Create a new embroidery service.</p>
      </div>

      <div className="rounded-xl border bg-card p-6 space-y-5">
        <div>
          <label>Name</label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label>Price</label>

          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-2 w-full rounded-lg border p-3"
            placeholder="Starts from ₹500"
          />
        </div>

        <div>
          <label>Description</label>

          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label>Service Image</label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            className="mt-2"
          />
        </div>

        <div className="flex gap-10">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            Featured
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={status} onChange={(e) => setStatus(e.target.checked)} />
            Active
          </label>
        </div>
        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            className="mt-4 h-56 w-full rounded-lg border object-cover"
          />
        )}

        <button
          onClick={saveService}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-maroon px-6 py-3 text-white"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          <Upload className="h-4 w-4" />
          Save Service
        </button>
      </div>
    </div>
  );
}
