import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../../reauth/baseQueryWithReauth";

export const paymentSlice = createApi({
    reducerPath: "paymentSlice",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Payments", "Subscription", "Cards"],
    endpoints: (builder) => ({
        getPayments: builder.query<any, { page?: number; limit?: number; keyword?: string }>({
            query: ({ page, limit, keyword } = {}) => ({
                url: "/payment",
                method: "GET",
                params: { page, limit, keyword },
            }),
            providesTags: ["Payments"],
        }),
        paymentConfig: builder.query<any, any>({
            query: () => ({
                url: "/payment/config",
                method: "GET",
            }),
            transformResponse: (res: any) => res?.data,
        }),
        paymentIntent: builder.mutation<any, { amount: number; currency: string; learnerId?: string; lessonId?: string }>({
            query: ({ amount, currency, learnerId, lessonId }) => ({
                url: "/payment/create-payment-intent",
                method: "POST",
                body: {
                    amount,
                    currency,
                    learnerId,
                    lessonId,
                },
            }),
            transformResponse: (res: any) => res?.data,
        }),
        SubscriptionPayment: builder.mutation<any, { data: any }>({
            query: ({ data }) => ({
                url: "/payment/subscription-payment",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Subscription"],
        }),
        getSavedPaymentMethods: builder.query<any, void>({
            query: () => ({
                url: "/payment/payment-methods",
                method: "GET",
            }),
            providesTags: ["Cards"],
        }),
        getMySubscription: builder.query<any, void>({
            query: () => ({
                url: "/subscription/my",
                method: "GET",
            }),
            providesTags: ["Subscription"],
        }),
        getMyPayments: builder.query<any, void>({
            query: () => ({
                url: "/payment/my-payments",
                method: "GET",
            }),
            providesTags: ["Payments"],
        }),

    }),
});

export const { useGetPaymentsQuery, usePaymentConfigQuery, usePaymentIntentMutation, useSubscriptionPaymentMutation, useGetSavedPaymentMethodsQuery, useGetMySubscriptionQuery, useGetMyPaymentsQuery } = paymentSlice;
