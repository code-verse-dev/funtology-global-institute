import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useNonprofitAdminMode } from "@/contexts/NonprofitAdminContext";
import {
  useGetAdminNotificationsQuery,
  useGetAllNotificationsQuery,
} from "@/redux/services/apiSlices/notificationSlice";
import { useGetNonprofitAdminNotificationsQuery } from "@/redux/services/apiSlices/nonprofitAdminApiSlice";

type NotificationsQueryHookOptions = NonNullable<
  Parameters<typeof useGetAllNotificationsQuery>[1]
>;

export type NotificationsQueryArg = {
  page?: number;
  limit?: number;
  isRead?: boolean;
};

/**
 * Admin: main API vs non-profit admin layout uses non-profit API.
 * Others: GET /notification/getUserNotifications
 */
export function useRoleBasedNotificationsQuery(
  arg: NotificationsQueryArg,
  options?: NotificationsQueryHookOptions
) {
  const role = useSelector((s: RootState) => s.user.userData?.role as string | undefined);
  const isAdmin = role === "admin";
  const nonprofitAdmin = useNonprofitAdminMode();
  const { skip: skipOpt, ...subscriptionOptions } = options ?? {};
  const skip = Boolean(skipOpt);

  const adminQ = useGetAdminNotificationsQuery(arg, {
    skip: skip || !isAdmin || nonprofitAdmin,
    ...subscriptionOptions,
  });
  const nonprofitAdminQ = useGetNonprofitAdminNotificationsQuery(arg, {
    skip: skip || !isAdmin || !nonprofitAdmin,
    ...subscriptionOptions,
  });
  const userQ = useGetAllNotificationsQuery(arg, {
    skip: skip || isAdmin,
    ...subscriptionOptions,
  });

  if (!isAdmin) return userQ;
  return nonprofitAdmin ? nonprofitAdminQ : adminQ;
}

export function notificationsListPathForRole(role: string | undefined, nonprofitAdmin = false): string {
  if (role === "admin" && nonprofitAdmin) return "/admin/nonprofit/notifications";
  if (role === "admin") return "/admin/notifications";
  if (role === "organization") return "/organization/notifications";
  return "/dashboard/notifications";
}
