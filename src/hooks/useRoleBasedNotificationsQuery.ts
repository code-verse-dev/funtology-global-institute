import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import {
  useGetAdminNotificationsQuery,
  useGetAllNotificationsQuery,
} from "@/redux/services/apiSlices/notificationSlice";

type NotificationsQueryHookOptions = NonNullable<
  Parameters<typeof useGetAllNotificationsQuery>[1]
>;

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
  options?: NotificationsQueryHookOptions
) {
  const role = useSelector((s: RootState) => s.user.userData?.role as string | undefined);
  const isAdmin = role === "admin";
  const { skip: skipOpt, ...subscriptionOptions } = options ?? {};
  const skip = Boolean(skipOpt);

  const adminQ = useGetAdminNotificationsQuery(arg, {
    skip: skip || !isAdmin,
    ...subscriptionOptions,
  });
  const userQ = useGetAllNotificationsQuery(arg, {
    skip: skip || isAdmin,
    ...subscriptionOptions,
  });

  return isAdmin ? adminQ : userQ;
}

export function notificationsListPathForRole(role: string | undefined): string {
  if (role === "admin") return "/admin/notifications";
  if (role === "organization") return "/organization/notifications";
  return "/dashboard/notifications";
}
