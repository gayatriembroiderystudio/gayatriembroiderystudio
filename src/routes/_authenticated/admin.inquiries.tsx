import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/inquiries")({
  component: InquiriesAdmin,
});

const STATUSES = ["new", "in_progress", "resolved", "archived"] as const;

function InquiriesAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-inquiries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("contact_messages").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    qc.invalidateQueries({ queryKey: ["admin-inquiries"] });
  }

  async function remove(id: string) {
    if (!confirm("Delete this inquiry?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin-inquiries"] });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-maroon-deep">Inquiries</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Contact form messages from website visitors.
        </p>
      </div>
      <div className="space-y-4">
        {isLoading && <p className="text-muted-foreground">Loading…</p>}
        {data?.map((m) => (
          <div key={m.id} className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-lg text-maroon-deep">
                  {m.subject || "(no subject)"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  From <strong>{m.name}</strong>
                  {m.email && <> · {m.email}</>}
                  {m.mobile && <> · {m.mobile}</>}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={m.status}
                  onChange={(e) => setStatus(m.id, e.target.value)}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => remove(m.id)}
                  className="rounded p-2 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm">{m.message}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              {new Date(m.created_at).toLocaleString()}
            </p>
          </div>
        ))}
        {!isLoading && (data?.length ?? 0) === 0 && (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
            No inquiries yet.
          </p>
        )}
      </div>
    </div>
  );
}
