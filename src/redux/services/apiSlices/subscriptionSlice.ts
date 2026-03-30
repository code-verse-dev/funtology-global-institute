import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "@/redux/reauth/baseQueryWithReauth";

export const subscriptionSlice = createApi({
  reducerPath: "subscriptionSlice",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Subscription"],
  endpoints: (builder) => ({
    getLearnerSeatFee: builder.query<any, void>({
      query: () => ({
        url: "/subscription/learner-seat-fee",
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),
   
  }),
});

export const { useGetLearnerSeatFeeQuery } = subscriptionSlice;
