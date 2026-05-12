import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { lessonFileUrl } from "@/pages/admin/lessonFileUrl";
import { useChangePasswordMutation } from "@/redux/services/apiSlices/userSlice";
import type { RootState } from "@/redux/store";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import swal from "sweetalert";

function displayName(user: Record<string, unknown> | undefined) {
  if (!user) return "User";
  const first = typeof user.firstName === "string" ? user.firstName.trim() : "";
  const last = typeof user.lastName === "string" ? user.lastName.trim() : "";
  const combined = `${first} ${last}`.trim();
  if (combined) return combined;
  if (typeof user.email === "string" && user.email) return user.email.split("@")[0] ?? "User";
  return "User";
}

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  if (parts.length === 1 && parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase();
  return name.slice(0, 2).toUpperCase() || "U";
}

function formatDate(value: unknown) {
  if (typeof value !== "string" || !value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function profileImageSrc(raw: unknown): string | undefined {
  if (typeof raw !== "string" || !raw.trim()) return undefined;
  const s = raw.trim();
  if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("data:")) return s;
  return lessonFileUrl(s) ?? undefined;
}

const Profile = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.userData) as Record<string, unknown> | undefined;
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changePassword, { isLoading: changingPassword }] = useChangePasswordMutation();
  const name = displayName(user);
  const email = typeof user?.email === "string" ? user.email : "";
  const role = typeof user?.role === "string" ? user.role : "";
  const phone = typeof user?.phoneNumber === "string" ? user.phoneNumber : "";
  const org = typeof user?.organizationName === "string" ? user.organizationName : "";
  const street = typeof user?.streetAddress === "string" ? user.streetAddress : "";
  const status = typeof user?.status === "string" ? user.status : "";
  const createdAt = formatDate(user?.createdAt);
  const imageSrc = profileImageSrc(user?.image);

  const rows: { label: string; value: string }[] = [
    { label: "Email", value: email },
    { label: "Phone", value: phone },
    { label: "Role", value: role },
    { label: "Organization", value: org },
    { label: "Address", value: street },
    { label: "Status", value: status },
    { label: "Member since", value: createdAt ?? "" },
  ].filter((r) => r.value);

  const closeChangePasswordModal = () => {
    setOpenChangePassword(false);
    setOldPassword("");
    setPassword("");
    setConfirmPassword("");
    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const onChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Missing user email.");
      return;
    }
    if (!oldPassword.trim() || !password.trim()) {
      toast.error("Old password and new password are required.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }
    try {
      const res = await changePassword({
        email,
        oldPassword: oldPassword.trim(),
        password: password.trim(),
        type: "learner",
      }).unwrap();
      if (res?.status) {
        swal("Success", res?.message || "Password changed successfully.", "success");
        closeChangePasswordModal();
      } else {
        toast.error(res?.message || "Could not change password.");
      }
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err && err.data && typeof err.data === "object" && "message" in err.data
          ? String((err.data as { message: string }).message)
          : "Could not change password.";
      toast.error(msg);
    }
  };

  return (
    <div className="container-wide py-8 max-w-2xl mx-auto space-y-6">
      <Button type="button" variant="ghost" className="gap-2 -ml-2" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <Card>
        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
          <Avatar className="h-20 w-20 border border-border shrink-0">
            {imageSrc ? <AvatarImage src={imageSrc} alt={name} /> : null}
            <AvatarFallback className="text-lg">{initials(name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-1">
            <CardTitle className="font-heading text-2xl truncate">{name}</CardTitle>
            <CardDescription className="truncate">{email || "Profile details"}</CardDescription>
            {role ? (
              <Badge variant="secondary" className="capitalize mt-1">
                {role.replace(/_/g, " ")}
              </Badge>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No profile fields available.</p>
          ) : (
            <dl className="divide-y divide-border rounded-md border border-border">
              {rows.map((row) => (
                <div key={row.label} className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="text-xs font-medium text-muted-foreground sm:col-span-1">{row.label}</dt>
                  <dd className="text-sm text-foreground sm:col-span-2 break-words">{row.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {role === "learner" ? (
            <div className="pt-2 flex justify-end">
              <Button type="button" variant="outline" onClick={() => setOpenChangePassword(true)}>
                Change Password
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Dialog open={openChangePassword} onOpenChange={(open) => (!open ? closeChangePasswordModal() : setOpenChangePassword(true))}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
            <DialogDescription>Update your learner account password.</DialogDescription>
          </DialogHeader>
          <form onSubmit={onChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cp-email">Email</Label>
              <Input id="cp-email" value={email} disabled readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cp-old">Old password</Label>
              <div className="relative">
                <Input
                  id="cp-old"
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  disabled={changingPassword}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowOldPassword((v) => !v)}
                  aria-label={showOldPassword ? "Hide old password" : "Show old password"}
                >
                  {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cp-new">New password</Label>
              <div className="relative">
                <Input
                  id="cp-new"
                  type={showNewPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={changingPassword}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowNewPassword((v) => !v)}
                  aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cp-confirm">Confirm new password</Label>
              <div className="relative">
                <Input
                  id="cp-confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={changingPassword}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeChangePasswordModal} disabled={changingPassword}>
                Cancel
              </Button>
              <Button type="submit" disabled={changingPassword}>
                {changingPassword ? "Updating..." : "Update Password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
