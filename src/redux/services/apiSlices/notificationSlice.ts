import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../../reauth/baseQueryWithReauth";

export const notificationSlice = createApi({
    reducerPath: "notificationSlice",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Notifications"],
    endpoints: (builder) => ({
        getAdminNotifications: builder.query<any, { page?: number; limit?: number; isRead?: boolean }>({
            query: ({ page, limit, isRead } = {}) => ({
                url: "/notification/getAllAdminNotifications",
                method: "GET",
                params: { page, limit, isRead },
            }),
            providesTags: ["Notifications"],
        }),
        getAllNotifications: builder.query<any, { page?: number; limit?: number; isRead?: boolean }>({
            query: ({ page, limit, isRead } = {}) => ({
                url: "/notification/getUserNotifications",
                method: "GET",
                params: { page, limit, isRead },
            }),
            providesTags: ["Notifications"],
        }),
        toggleNotification: builder.mutation<any, { id: string }>({
            query: ({ id }) => ({
                url: `/notification/toggleNotification/${id}`,
                method: "PUT",
            }),
            invalidatesTags: ["Notifications"],
        }),
        markAllRead: builder.mutation<any, void>({
            query: () => ({
                url: "/notification/admin/mark-all-read",
                method: "PUT",
            }),
            invalidatesTags: ["Notifications"],
        }),
    }),
});

export const { useGetAdminNotificationsQuery, useGetAllNotificationsQuery, useToggleNotificationMutation, useMarkAllReadMutation } = notificationSlice;
