import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import {
  useGetAdminNotificationsQuery,
  useGetAllNotificationsQuery,
} from "@/redux/services/apiSlices/notificationSlice";

export type NotificationsQueryArg = {
  page?: number;
  limit?: number;
  isRead?: boolean;
};

/**
 * Admin: GET /notification/getAllAdminNotifications — others: GET /notification/getUserNotifications
 */
export function useRoleBasedNotificationsQuery(
  arg: NotificationsQueryArg,
  options?: { skip?: boolean }
) {
  const role = useSelector((s: RootState) => s.user.userData?.role as string | undefined);
  const isAdmin = role === "admin";
  const skip = Boolean(options?.skip);

  const adminQ = useGetAdminNotificationsQuery(arg, { skip: skip || !isAdmin });
  const userQ = useGetAllNotificationsQuery(arg, { skip: skip || isAdmin });

  return isAdmin ? adminQ : userQ;
}

export function notificationsListPathForRole(role: string | undefined): string {
  if (role === "admin") return "/admin/notifications";
  if (role === "organization") return "/organization/notifications";
  return "/dashboard/notifications";
}
