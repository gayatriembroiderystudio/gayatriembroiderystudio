import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/service-edit/$id")({
  component: EditService,
});

function EditService() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState(true);

  const [image, setImage] = useState<File | null>(null);

  function slugify(text: string) {
    return text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  }

  useEffect(() => {
    loadService();
  }, []);

  async function loadService() {
    const { data, error } = await supabase.from("services").select("*").eq("id", id).single();

    if (error) {
      toast.error(error.message);
      return;
    }

    setName(data.name);
    setPrice(data.price);
    setDescription(data.description);
    setImageUrl(data.image_url);
    setFeatured(data.featured);
    setStatus(data.status);
  }

  async function uploadImage() {
    if (!image) return imageUrl;

    setImageUploading(true);

    const fileName = `${Date.now()}-${image.name}`;

    const { error } = await supabase.storage.from("service-images").upload(fileName, image);

    setImageUploading(false);

    if (error) throw error;

    const { data } = supabase.storage.from("service-images").getPublicUrl(fileName);

    return data.publicUrl;
  }

  async function updateService() {
    try {
      setLoading(true);

      const img = await uploadImage();

      const { error } = await supabase
        .from("services")
        .update({
          name,
          slug: slugify(name),
          description,
          price,
          image_url: img,
          featured,
          status,
        })
        .eq("id", id);

      if (error) throw error;

      toast.success("Service updated successfully");

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
        <h1 className="font-display text-3xl text-maroon-deep">Edit Service</h1>

        <p className="text-muted-foreground">Update service details.</p>
      </div>

      <div className="rounded-xl border bg-card p-6 space-y-5">
        {imageUrl && <img src={imageUrl} className="h-48 w-full rounded-xl object-cover" alt="" />}

        <div>
          <label>Name</label>

          <input
            className="mt-2 w-full rounded-lg border p-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label>Price</label>

          <input
            className="mt-2 w-full rounded-lg border p-3"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div>
          <label>Description</label>

          <textarea
            rows={5}
            className="mt-2 w-full rounded-lg border p-3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label>Replace Image</label>

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

        <button
          onClick={updateService}
          disabled={loading || imageUploading}
          className="rounded-lg bg-maroon px-6 py-3 text-white"
        >
          {loading && <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />}
          Update Service
        </button>
      </div>
    </div>
  );
}
