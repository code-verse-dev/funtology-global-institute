import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "@/redux/reauth/baseQueryWithReauth";

export const subscriptionSlice = createApi({
  reducerPath: "subscriptionSlice",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Subscription"],
  endpoints: (builder) => ({
    getMySubscription: builder.query<any, void>({
      query: () => ({
        url: "/subscription/my",
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),

    getAdminOrganizationActiveSubscription: builder.query<any, string>({
      query: (organizationId) => ({
        url: `/subscription/admin/${organizationId}/active`,
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),
  }),
});

export const { useGetMySubscriptionQuery, useGetAdminOrganizationActiveSubscriptionQuery } = subscriptionSlice;
