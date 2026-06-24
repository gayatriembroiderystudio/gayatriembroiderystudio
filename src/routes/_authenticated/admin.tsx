import { createFileRoute, Outlet, Link, useNavigate, useRouterState, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, CalendarCheck, MessageSquare, Star, Image as ImageIcon,
  FileText, LogOut, Menu, X,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async ({ context }: any) => {
    const userId = context?.user?.id;
    if (!userId) throw redirect({ to: "/auth" });
    const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
    if (!data) {
      // Try claim if no admin exists
      const { data: claimed } = await supabase.rpc("claim_first_admin");
      if (!claimed) throw redirect({ to: "/" });
    }
  },
  component: AdminLayout,
});

const NAV: Array<{ to: string; label: string; icon: any; exact?: boolean }> = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { to: "/admin/blog", label: "Blog", icon: FileText },
];

function AdminLayout() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth" });
  }

  return (
    <div className="min-h-screen bg-cream/30">
      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border bg-gradient-to-b from-maroon-deep to-maroon text-cream transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link to="/" className="font-display text-xl text-gold-foil">Royal Boutique</Link>
          <button onClick={() => setOpen(false)} className="lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="px-5 text-[10px] uppercase tracking-[0.3em] text-gold-foil/70">Admin Panel</p>
        <nav className="mt-6 flex flex-col gap-1 px-3">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={[
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-cream/15 text-gold-foil" : "text-cream/80 hover:bg-cream/10",
                ].join(" ")}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute inset-x-0 bottom-0 border-t border-cream/10 p-4">
          <p className="truncate text-xs text-cream/70">{email}</p>
          <button
            onClick={signOut}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-cream/30 py-2 text-xs hover:bg-cream/10"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur px-5 py-3">
          <button onClick={() => setOpen(true)} className="lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <h2 className="font-display text-lg text-maroon-deep">Admin Dashboard</h2>
          <Link to="/" className="text-xs text-muted-foreground hover:text-maroon">View site →</Link>
        </header>
        <main className="p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
