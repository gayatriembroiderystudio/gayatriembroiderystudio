import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Check, X, Star } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/reviews")({
  component: ReviewsAdmin,
});

function ReviewsAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase.from("feedback").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function setApproved(id: string, approved: boolean) {
    const { error } = await supabase.from("feedback").update({ approved }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(approved ? "Approved" : "Unapproved");
    qc.invalidateQueries({ queryKey: ["admin-reviews"] });
  }

  async function remove(id: string) {
    if (!confirm("Delete this review?")) return;
    const { error } = await supabase.from("feedback").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin-reviews"] });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-maroon-deep">Reviews</h1>
        <p className="mt-1 text-sm text-muted-foreground">Approve customer reviews to display publicly.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {isLoading && <p className="text-muted-foreground">Loading…</p>}
        {data?.map((r) => (
          <div key={r.id} className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display text-lg text-maroon-deep">{r.name}</h3>
                <div className="mt-1 flex gap-0.5 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-current" : "opacity-30"}`} />
                  ))}
                </div>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs ${r.approved ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                {r.approved ? "Approved" : "Pending"}
              </span>
            </div>
            <p className="mt-3 text-sm">{r.review}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
              <div className="flex gap-2">
                {r.approved ? (
                  <button onClick={() => setApproved(r.id, false)} className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs hover:bg-muted">
                    <X className="h-3 w-3" /> Unapprove
                  </button>
                ) : (
                  <button onClick={() => setApproved(r.id, true)} className="flex items-center gap-1 rounded-full bg-maroon px-3 py-1 text-xs text-cream">
                    <Check className="h-3 w-3" /> Approve
                  </button>
                )}
                <button onClick={() => remove(r.id)} className="rounded p-1.5 text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {!isLoading && (data?.length ?? 0) === 0 && (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground md:col-span-2">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
