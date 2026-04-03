import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UPLOADS_URL } from "@/constants/api";
import { useGetUserByIdQuery, useUpdateUserStatusMutation, type UserStatus } from "@/redux/services/apiSlices/userSlice";
import type { ReactNode } from "react";
import { ArrowLeft, CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { formatRole, formatUserStatusLabel, userStatusBadgeVariant } from "./userDisplay";

const Row = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-3 border-b border-border last:border-0">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium text-foreground break-all">{value ?? "—"}</span>
  </div>
);

const AdminUserDetail = () => {
  const { userId } = useParams<{ userId: string }>();
  const { data, isLoading, isError, error } = useGetUserByIdQuery(userId!, { skip: !userId });
  const [updateStatus, { isLoading: isUpdating }] = useUpdateUserStatusMutation();

  const user = data?.data;

  const onSetStatus = async (status: UserStatus) => {
    if (!userId) return;
    try {
      const res = await updateStatus({ id: userId, status }).unwrap();
      if (res.status) toast.success(res.message || "Status updated");
      else toast.error(res.message || "Could not update status");
    } catch {
      toast.error("Could not update status");
    }
  };

  if (!userId) {
    return (
      <div className="text-center text-muted-foreground py-12">
        Invalid user link.{" "}
        <Link to="/admin/users" className="text-primary underline">
          Back to users
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground gap-2">
        <Loader2 className="w-6 h-6 animate-spin" />
        Loading user…
      </div>
    );
  }

  if (isError || !user || !data?.status) {
    const msg =
      error && "data" in error && typeof (error as { data?: { message?: string } }).data?.message === "string"
        ? (error as { data: { message: string } }).data.message
        : "User could not be loaded.";
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-destructive">{msg}</p>
        <Button variant="outline" asChild>
          <Link to="/admin/users">Back to users</Link>
        </Button>
      </div>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "?";
  const imageSrc = user.image
    ? UPLOADS_URL + user.image
    : undefined;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="ghost" size="sm" className="gap-2 -ml-2" asChild>
          <Link to="/admin/users">
            <ArrowLeft className="w-4 h-4" />
            Users
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
          <Avatar className="h-16 w-16">
            {imageSrc ? <AvatarImage src={imageSrc} alt="" /> : null}
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="font-heading text-2xl">{fullName}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant={user.role === "organization" ? "default" : "outline"}>{formatRole(user.role)}</Badge>
              <Badge variant={userStatusBadgeVariant(user.status)} className="gap-1 capitalize">
                {user.status === "ACTIVE" ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : user.status === "PENDING" ? (
                  <Clock className="w-3 h-3" />
                ) : (
                  <XCircle className="w-3 h-3" />
                )}
                {formatUserStatusLabel(user.status)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="space-y-0">
            <Row label="Phone" value={user.phoneNumber} />
            <Row label="Organization" value={user.organizationName} />
            <Row label="Street address" value={user.streetAddress} />
            <Row
              label="Joined"
              value={
                user.createdAt
                  ? new Date(user.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "—"
              }
            />
            <Row
              label="Last updated"
              value={
                user.updatedAt
                  ? new Date(user.updatedAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "—"
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Account status</CardTitle>
          <p className="text-sm text-muted-foreground">Set status to active, pending, or suspended (inactive).</p>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            variant={user.status === "ACTIVE" ? "secondary" : "outline"}
            size="sm"
            disabled={isUpdating || user.status === "ACTIVE"}
            onClick={() => onSetStatus("ACTIVE")}
          >
            Active
          </Button>
          <Button
            variant={user.status === "PENDING" ? "secondary" : "outline"}
            size="sm"
            disabled={isUpdating || user.status === "PENDING"}
            onClick={() => onSetStatus("PENDING")}
          >
            Pending
          </Button>
          <Button
            variant={user.status === "INACTIVE" ? "secondary" : "outline"}
            size="sm"
            disabled={isUpdating || user.status === "INACTIVE"}
            onClick={() => onSetStatus("INACTIVE")}
          >
            Suspended (inactive)
          </Button>
          {isUpdating ? <Loader2 className="w-4 h-4 animate-spin self-center ml-2" /> : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserDetail;
