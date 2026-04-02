import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../../reauth/baseQueryWithReauth";

export const paymentSlice = createApi({
    reducerPath: "paymentSlice",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Payments", "Subscription", "Cards"],
    endpoints: (builder) => ({
        getPayments: builder.query<
            any,
            { page?: number; limit?: number; keyword?: string }
        >({
            query: ({ page = 1, limit = 10, keyword } = {}) => ({
                url: "/payment",
                method: "GET",
                params: {
                    page: String(page),
                    limit: String(limit),
                    ...(keyword?.trim() ? { keyword: keyword.trim() } : {}),
                },
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
        paymentIntent: builder.mutation<any, { amount: number; currency: string; learnerId?: string; lessonId?: string; type?: string; kind?: string }>({
            query: ({ amount, currency, learnerId, lessonId, type, kind }) => ({
                url: "/payment/create-payment-intent",
                method: "POST",
                body: {
                    amount,
                    currency,
                    learnerId,
                    lessonId,
                    type,
                    kind,
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
        quizRetakePayment: builder.mutation<any, { data: { paymentIntentId: string } }>({
            query: ({ data }) => ({
                url: "/payment/quiz-retake-payment",
                method: "POST",
                body: data,
            }),
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

export const {
    useGetPaymentsQuery,
    usePaymentConfigQuery,
    usePaymentIntentMutation,
    useSubscriptionPaymentMutation,
    useQuizRetakePaymentMutation,
    useGetSavedPaymentMethodsQuery,
    useGetMySubscriptionQuery,
    useGetMyPaymentsQuery,
} = paymentSlice;
