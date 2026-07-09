import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      {
        title: "Forgot Password | Gayatri Embroidery Studio",
      },
    ],
  }),
  component: ForgotPassword,
});

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed = schema.safeParse({ email });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success("Password reset link sent successfully. Please check your email.");

      setEmail("");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="brocade-bg flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-gold/30 bg-card p-8 shadow-luxe">
        <Link
          to="/auth"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gold hover:text-maroon"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>

        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-gold/10 p-4">
            <Mail className="h-8 w-8 text-gold" />
          </div>
        </div>

        <h1 className="text-center font-display text-3xl text-maroon-deep">Forgot Password</h1>

        <p className="mt-3 text-center text-sm text-muted-foreground">
          Enter your registered email address and we'll send you a password reset link.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider">
              Email Address
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:border-gold"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-maroon to-maroon-deep py-3 font-medium text-white disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}
