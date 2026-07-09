import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Login · Gayatri Embroidery Studio" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Min 8 characters").max(72),
});

function AuthPage() {
  const navigate = useNavigate();
  const { data: settings } = useSettings();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed = schema.safeParse({ email, password });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });

      if (error) throw error;

      navigate({ to: "/admin" });
    } catch (err: any) {
      toast.error(err.message ?? "Authentication failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="relative min-h-screen overflow-hidden">
      <img
        src={settings?.hero_image}
        className="absolute inset-0 h-full w-full object-cover animate-bg"
      />

      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/45 to-black/70" />

      <div className="absolute inset-0 light-rays" />

      <div className="particles" />
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div
          className="
relative
w-full
max-w-md
rounded-[32px]
border
border-white/20
bg-white/10
backdrop-blur-xl
p-10
shadow-[0_30px_80px_rgba(0,0,0,.45)]
"
        >
          <div className="mb-6 text-center">
            <img
              src={settings?.logo_url}
              alt={settings?.business_name}
              className="mx-auto h-24 w-24 object-contain"
            />

            <Link to="/" className="mt-3 block text-xs uppercase tracking-[0.3em] text-gold">
              Gayatri Embroidery Studio
            </Link>
          </div>
          <h1 className="mt-2 font-display text-3xl text-maroon-deep">Admin Sign In</h1>
          <p className="mt-2 text-sm text-muted-foreground"></p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-foreground/70">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-gold"
              />
            </div>
            <div className="relative">
              <label className="text-xs font-medium uppercase tracking-wider text-foreground/70">
                Password
              </label>

              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-4 py-2.5 pr-12 text-sm outline-none focus:border-gold"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-10 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <div className="flex justify-end mt-2">
              <Link to="/forgot-password" className="text-sm text-gold hover:text-maroon">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-maroon to-maroon-deep py-3 text-sm font-medium text-cream shadow-soft disabled:opacity-60"
            >
              {loading ? "Please wait…" : "Sign In"}
            </button>
            <p className="mt-2 mb-8 text-center text-sm text-muted-foreground">
              Secure access for authorized administrators only.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
