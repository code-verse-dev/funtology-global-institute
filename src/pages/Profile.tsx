import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { lessonFileUrl } from "@/pages/admin/lessonFileUrl";
import type { RootState } from "@/redux/store";
import { ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
