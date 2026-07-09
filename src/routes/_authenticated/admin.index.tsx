import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CalendarCheck, MessageSquare, Star, Image as ImageIcon, FileText } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    title: "Admin Dashboard | Gayatri Embroidery Studio",
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const stats = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [b, i, f, g, p] = await Promise.all([
        supabase.from("bookings").select("*", { count: "exact", head: true }),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }),
        supabase.from("feedback").select("*", { count: "exact", head: true }),
        supabase.from("gallery_items").select("*", { count: "exact", head: true }),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }),
      ]);
      return {
        bookings: b.count ?? 0,
        inquiries: i.count ?? 0,
        feedback: f.count ?? 0,
        gallery: g.count ?? 0,
        posts: p.count ?? 0,
      };
    },
  });

  const recent = useQuery({
    queryKey: ["recent-bookings"],
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings")
        .select("id,customer_name,service_name,status,created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  const cards = [
    {
      label: "Bookings",
      value: stats.data?.bookings ?? 0,
      to: "/admin/bookings",
      icon: CalendarCheck,
    },
    {
      label: "Inquiries",
      value: stats.data?.inquiries ?? 0,
      to: "/admin/inquiries",
      icon: MessageSquare,
    },
    { label: "Reviews", value: stats.data?.feedback ?? 0, to: "/admin/reviews", icon: Star },
    { label: "Gallery", value: stats.data?.gallery ?? 0, to: "/admin/gallery", icon: ImageIcon },
    { label: "Blog Posts", value: stats.data?.posts ?? 0, to: "/admin/blog", icon: FileText },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-maroon-deep">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of activity across your boutique.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="group rounded-xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-luxe"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                {c.label}
              </span>
              <c.icon className="h-4 w-4 text-gold" />
            </div>
            <p className="mt-3 font-display text-3xl text-maroon-deep">{c.value}</p>
          </Link>
        ))}
      </div>

      <section className="rounded-xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-maroon-deep">Recent Bookings</h2>
          <Link to="/admin/bookings" className="text-xs text-gold hover:text-maroon">
            View all →
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-2">Name</th>
                <th>Service</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {(recent.data ?? []).map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="py-3">{r.name}</td>
                  <td>{r.service_type}</td>
                  <td>
                    <span className="rounded-full bg-gold/15 px-2 py-0.5 text-xs text-maroon-deep">
                      {r.status}
                    </span>
                  </td>
                  <td className="text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {!recent.isLoading && (recent.data?.length ?? 0) === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-muted-foreground">
                    No bookings yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
