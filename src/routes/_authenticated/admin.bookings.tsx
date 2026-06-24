import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/bookings")({
  component: BookingsAdmin,
});

const STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;

function BookingsAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    qc.invalidateQueries({ queryKey: ["admin-bookings"] });
  }

  async function remove(id: string) {
    if (!confirm("Delete this booking?")) return;
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin-bookings"] });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-maroon-deep">Bookings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage consultation requests.</p>
      </div>
      <div className="rounded-xl border border-border bg-card shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th>Contact</th>
                <th>Service</th>
                <th>Preferred</th>
                <th>Status</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">Loading…</td></tr>}
              {data?.map((b) => (
                <tr key={b.id} className="border-t border-border align-top">
                  <td className="px-4 py-3">
                    <div className="font-medium text-maroon-deep">{b.name}</div>
                    {b.address && <div className="text-xs text-muted-foreground">{b.address}</div>}
                  </td>
                  <td>
                    <div>{b.mobile}</div>
                    {b.email && <div className="text-xs text-muted-foreground">{b.email}</div>}
                  </td>
                  <td>{b.service_type}</td>
                  <td>
                    {b.preferred_date && <div>{b.preferred_date}</div>}
                    {b.preferred_time && <div className="text-xs text-muted-foreground">{b.preferred_time}</div>}
                  </td>
                  <td>
                    <select
                      value={b.status}
                      onChange={(e) => setStatus(b.id, e.target.value)}
                      className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="text-xs text-muted-foreground">{new Date(b.created_at).toLocaleString()}</td>
                  <td>
                    <button onClick={() => remove(b.id)} className="rounded p-2 text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {!isLoading && (data?.length ?? 0) === 0 && (
                <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No bookings yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
