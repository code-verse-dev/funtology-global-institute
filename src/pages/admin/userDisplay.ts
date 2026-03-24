import type { UserStatus } from "@/redux/services/apiSlices/userSlice";

export function formatRole(role: string): string {
  if (role === "learner") return "Learner";
  if (role === "organization") return "Organization";
  if (role === "admin") return "Administrator";
  return role;
}

/** UI label: INACTIVE shown as "suspended". */
export function formatUserStatusLabel(status: UserStatus): string {
  if (status === "INACTIVE") return "suspended";
  if (status === "PENDING") return "pending";
  return "active";
}

export function userStatusBadgeVariant(
  status: UserStatus
): "secondary" | "outline" | "destructive" {
  if (status === "ACTIVE") return "secondary";
  if (status === "PENDING") return "outline";
  return "destructive";
}
