import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, UserCircle2, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/profile")({
  component: AdminProfile,
});

function AdminProfile() {
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    id: "",
    full_name: "",
    phone: "",
    email: "",
    avatar_url: "",
  });
  const [saving, setSaving] = useState(false);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [newEmail, setNewEmail] = useState(profile.email);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [changingEmail, setChangingEmail] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("User not found");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      setProfile({
        id: user.id,
        full_name: data?.full_name ?? "",
        phone: data?.phone ?? "",
        email: user.email ?? "",
        avatar_url: data?.avatar_url ?? "",
      });

      setAvatarPreview(data?.avatar_url ?? "");
      setNewEmail(user.email ?? "");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function uploadAvatar() {
    if (!avatarFile) return avatarPreview;

    const fileName = `${profile.id}-${Date.now()}`;

    const { error } = await supabase.storage.from("avatars").upload(fileName, avatarFile);

    if (error) throw error;

    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);

    return data.publicUrl;
  }

  async function saveProfile() {
    try {
      setSaving(true);

      const avatar = await uploadAvatar();

      const { error } = await supabase.from("profiles").upsert({
        id: profile.id,
        full_name: profile.full_name,
        phone: profile.phone,
        avatar_url: avatar,
      });

      if (error) throw error;

      toast.success("Profile updated successfully");

      setProfile((prev) => ({
        ...prev,
        avatar_url: avatar,
      }));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function updateEmail() {
    try {
      setChangingEmail(true);

      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (error) throw error;

      toast.success("Verification email sent. Please verify your new email.");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setChangingEmail(false);
    }
  }

  async function changePassword() {
    try {
      if (!newPassword) {
        toast.error("Enter a new password");
        return;
      }

      if (newPassword.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      setChangingPassword(true);

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success("Password updated successfully");

      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setChangingPassword(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-80 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-maroon" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 md:p-0">
      <div>
        <h1 className="font-display text-3xl font-bold text-maroon-deep">My Profile</h1>
        <p className="mt-2 text-muted-foreground">Manage your account information.</p>
      </div>

      {/* Main Profile Details Card */}
      <div className="rounded-2xl border bg-card p-6 md:p-8 shadow-soft">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          <div className="flex flex-col items-center gap-4 min-w-[150px]">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Profile"
                className="h-32 w-32 rounded-full border object-cover"
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-full border bg-muted">
                <UserCircle2 className="h-20 w-20 text-muted-foreground" />
              </div>
            )}
            <label className="cursor-pointer text-sm font-medium text-maroon hover:underline">
              <span>Upload Photo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setAvatarFile(file);
                  setAvatarPreview(URL.createObjectURL(file));
                }}
              />
            </label>
          </div>

          <div className="grid flex-1 gap-5 w-full md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Full Name</span>
              <input
                value={profile.full_name}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    full_name: e.target.value,
                  })
                }
                className="w-full rounded-lg border p-3"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">Email</span>
              <input
                value={profile.email}
                disabled
                className="w-full rounded-lg border bg-muted p-3 text-muted-foreground cursor-not-allowed"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium">Phone Number</span>
              <input
                value={profile.phone}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    phone: e.target.value,
                  })
                }
                className="w-full rounded-lg border p-3"
              />
            </label>
          </div>
        </div>

        <div className="mt-8 flex justify-end border-t pt-6">
          <button
            onClick={saveProfile}
            disabled={saving}
            className="w-full md:w-auto rounded-lg bg-maroon px-8 py-3 font-medium text-white disabled:opacity-60 flex items-center justify-center min-w-[140px]"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Account Security Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Change Email Card */}
        <div className="rounded-2xl border bg-card p-6 md:p-8 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Mail className="h-5 w-5 text-maroon" />
              <h2 className="font-display text-2xl font-semibold">Change Email</h2>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">New Email Address</span>
              <input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full rounded-lg border p-3"
                placeholder="Enter new email"
              />
            </label>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={updateEmail}
              disabled={changingEmail}
              className="w-full md:w-auto rounded-lg bg-maroon px-6 py-3 font-medium text-white disabled:opacity-60 flex items-center justify-center min-w-[140px]"
            >
              {changingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Email"}
            </button>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="rounded-2xl border bg-card p-6 md:p-8 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Lock className="h-5 w-5 text-maroon" />
              <h2 className="font-display text-2xl font-semibold">Change Password</h2>
            </div>

            <div className="space-y-5">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border p-3 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border p-3"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={changePassword}
              disabled={changingPassword}
              className="w-full md:w-auto rounded-lg bg-maroon px-6 py-3 font-medium text-white disabled:opacity-60 flex items-center justify-center min-w-[160px]"
            >
              {changingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : "Change Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
