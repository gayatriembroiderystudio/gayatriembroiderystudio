import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { Trash2, Plus, Pencil } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/blog")({
  component: BlogAdmin,
});

type Post = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  tag: string | null;
  published: boolean;
  published_at?: string | null;
};

const EMPTY: Post = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image_url: "",
  tag: "",
  published: false,
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function BlogAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Post | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-blog"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function save(post: Post) {
    if (!post.title.trim() || !post.slug.trim()) {
      toast.error("Title and slug are required");
      return;
    }
    const payload = {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || null,
      content: post.content,
      cover_image_url: post.cover_image_url || null,
      tag: post.tag || null,
      published: post.published,
      published_at: post.published ? new Date().toISOString() : null,
    };
    const { error } = post.id
      ? await supabase.from("blog_posts").update(payload).eq("id", post.id)
      : await supabase.from("blog_posts").insert(payload);
    if (error) {
      console.log(error);
      toast.error(error.message);
      return;
    }
    toast.success("Saved");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin-blog"] });
  }

  async function remove(id: string) {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin-blog"] });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-maroon-deep">Blog</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Write articles for your website blog.
          </p>
        </div>
        <button
          onClick={() => setEditing({ ...EMPTY })}
          className="flex items-center gap-2 rounded-full bg-maroon px-4 py-2 text-sm text-cream"
        >
          <Plus className="h-4 w-4" /> New Post
        </button>
      </div>

      {editing && <PostForm post={editing} onSave={save} onCancel={() => setEditing(null)} />}

      {isLoading && <p className="text-muted-foreground">Loading…</p>}
      <div className="space-y-3">
        {data?.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-soft"
          >
            {p.cover_image_url ? (
              <img src={p.cover_image_url} alt="" className="h-16 w-16 rounded-lg object-cover" />
            ) : (
              <div className="h-16 w-16 rounded-lg bg-muted" />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="truncate font-display text-base text-maroon-deep">{p.title}</h3>
              <p className="truncate text-xs text-muted-foreground">
                /{p.slug} {p.tag && `· ${p.tag}`}
              </p>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] ${p.published ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}
            >
              {p.published ? "Published" : "Draft"}
            </span>
            <button
              onClick={() => setEditing(p as Post)}
              className="rounded p-2 text-muted-foreground hover:bg-muted"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => remove(p.id)}
              className="rounded p-2 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      {!isLoading && (data?.length ?? 0) === 0 && (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
          No blog posts yet.
        </p>
      )}
    </div>
  );
}

function PostForm({
  post,
  onSave,
  onCancel,
}: {
  post: Post;
  onSave: (p: Post) => void;
  onCancel: () => void;
}) {
  const [v, setV] = useState<Post>(post);
  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage.from("blog-images").upload(fileName, file);

    if (error) {
      toast.error(error.message);
      return;
    }

    const { data } = supabase.storage.from("blog-images").getPublicUrl(fileName);

    setV((prev) => ({
      ...prev,
      cover_image_url: data.publicUrl,
    }));

    toast.success("Image uploaded successfully");
  }
  return (
    <div className="rounded-xl border border-gold/40 bg-card p-5 shadow-luxe">
      <h2 className="font-display text-lg text-maroon-deep">{post.id ? "Edit" : "New"} Post</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Field label="Title">
          <input
            value={v.title}
            onChange={(e) =>
              setV({ ...v, title: e.target.value, slug: v.slug || slugify(e.target.value) })
            }
            className={inputCls}
          />
        </Field>
        <Field label="Slug">
          <input
            value={v.slug}
            onChange={(e) => setV({ ...v, slug: slugify(e.target.value) })}
            className={inputCls}
          />
        </Field>
        <Field label="Tag">
          <input
            value={v.tag ?? ""}
            onChange={(e) => setV({ ...v, tag: e.target.value })}
            className={inputCls}
            placeholder="Bridal · Tech · Care"
          />
        </Field>

        <Field label="Cover Image" full>
          <input type="file" accept="image/*" onChange={handleCoverUpload} className={inputCls} />

          {v.cover_image_url && (
            <img
              src={v.cover_image_url}
              alt="Cover Preview"
              className="mt-4 h-48 w-full rounded-lg border object-cover"
            />
          )}
        </Field>
        <Field label="Excerpt" full>
          <textarea
            value={v.excerpt ?? ""}
            onChange={(e) => setV({ ...v, excerpt: e.target.value })}
            className={inputCls}
            rows={2}
          />
        </Field>
        <Field label="Content (Markdown / plain text)" full>
          <textarea
            value={v.content}
            onChange={(e) => setV({ ...v, content: e.target.value })}
            className={inputCls}
            rows={10}
          />
        </Field>
        <Field label="Status">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={v.published}
              onChange={(e) => setV({ ...v, published: e.target.checked })}
            />
            Published
          </label>
        </Field>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onCancel} className="rounded-full border border-border px-4 py-2 text-sm">
          Cancel
        </button>
        <button
          onClick={() => onSave(v)}
          className="rounded-full bg-maroon px-4 py-2 text-sm text-cream"
        >
          Save
        </button>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold";
function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="text-xs font-medium uppercase tracking-wider text-foreground/70">
        {label}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
