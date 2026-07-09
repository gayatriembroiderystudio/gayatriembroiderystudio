import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{ title: "Reset Password · Gayatri Embroidery Studio" }],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      toast.success("Password updated successfully.");

      navigate({ to: "/auth" });
    } catch (err: any) {
      toast.error(err.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="brocade-bg flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-gold/30 bg-card p-8 shadow-luxe">
        <h1 className="text-center font-display text-3xl text-maroon-deep">Reset Password</h1>

        <p className="mt-2 text-center text-sm text-muted-foreground">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="relative">
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider">
              New Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border px-4 py-3 pr-12 outline-none focus:border-gold"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-11"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider">
              Confirm Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-border px-4 py-3 outline-none focus:border-gold"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-maroon to-maroon-deep py-3 font-medium text-white disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
