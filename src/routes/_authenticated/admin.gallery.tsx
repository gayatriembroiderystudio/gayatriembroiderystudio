import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { Trash2, Plus, Pencil } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/gallery")({
  component: GalleryAdmin,
});

type Item = {
  id?: string;
  title: string;
  category: string;
  image_url: string;
  description: string | null;
  sort_order: number;
  published: boolean;
};

const EMPTY: Item = { title: "", category: "general", image_url: "", description: "", sort_order: 0, published: true };

function GalleryAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Item | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery_items").select("*").order("sort_order").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function save(item: Item) {
    if (!item.title.trim() || !item.image_url.trim()) {
      toast.error("Title and image URL are required");
      return;
    }
    const payload = { ...item, description: item.description || null };
    const { error } = item.id
      ? await supabase.from("gallery_items").update(payload).eq("id", item.id)
      : await supabase.from("gallery_items").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin-gallery"] });
  }

  async function remove(id: string) {
    if (!confirm("Delete this image?")) return;
    const { error } = await supabase.from("gallery_items").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin-gallery"] });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-maroon-deep">Gallery</h1>
          <p className="mt-1 text-sm text-muted-foreground">Add images by URL (paste from your CDN, Drive, or hosting).</p>
        </div>
        <button onClick={() => setEditing({ ...EMPTY })} className="flex items-center gap-2 rounded-full bg-maroon px-4 py-2 text-sm text-cream">
          <Plus className="h-4 w-4" /> Add Image
        </button>
      </div>

      {editing && <ItemForm item={editing} onSave={save} onCancel={() => setEditing(null)} />}

      {isLoading && <p className="text-muted-foreground">Loading…</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map((g) => (
          <div key={g.id} className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <img src={g.image_url} alt={g.title} loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display text-base text-maroon-deep">{g.title}</h3>
                  <p className="text-xs uppercase tracking-wider text-gold">{g.category}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] ${g.published ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                  {g.published ? "Live" : "Draft"}
                </span>
              </div>
              <div className="mt-3 flex justify-end gap-1">
                <button onClick={() => setEditing(g as Item)} className="rounded p-2 text-muted-foreground hover:bg-muted">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => remove(g.id)} className="rounded p-2 text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {!isLoading && (data?.length ?? 0) === 0 && (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">No gallery images yet.</p>
      )}
    </div>
  );
}

function ItemForm({ item, onSave, onCancel }: { item: Item; onSave: (i: Item) => void; onCancel: () => void }) {
  const [v, setV] = useState<Item>(item);
  return (
    <div className="rounded-xl border border-gold/40 bg-card p-5 shadow-luxe">
      <h2 className="font-display text-lg text-maroon-deep">{item.id ? "Edit" : "New"} Gallery Item</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Field label="Title"><input value={v.title} onChange={(e) => setV({ ...v, title: e.target.value })} className={inputCls} /></Field>
        <Field label="Category"><input value={v.category} onChange={(e) => setV({ ...v, category: e.target.value })} className={inputCls} /></Field>
        <Field label="Image URL" full><input value={v.image_url} onChange={(e) => setV({ ...v, image_url: e.target.value })} className={inputCls} placeholder="https://…" /></Field>
        <Field label="Description" full><textarea value={v.description ?? ""} onChange={(e) => setV({ ...v, description: e.target.value })} className={inputCls} rows={2} /></Field>
        <Field label="Sort Order"><input type="number" value={v.sort_order} onChange={(e) => setV({ ...v, sort_order: Number(e.target.value) })} className={inputCls} /></Field>
        <Field label="Status">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={v.published} onChange={(e) => setV({ ...v, published: e.target.checked })} />
            Published
          </label>
        </Field>
      </div>
      {v.image_url && <img src={v.image_url} alt="" className="mt-4 max-h-48 rounded-lg object-cover" />}
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onCancel} className="rounded-full border border-border px-4 py-2 text-sm">Cancel</button>
        <button onClick={() => onSave(v)} className="rounded-full bg-maroon px-4 py-2 text-sm text-cream">Save</button>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold";
function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="text-xs font-medium uppercase tracking-wider text-foreground/70">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
