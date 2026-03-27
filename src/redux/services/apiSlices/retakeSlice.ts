import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "../../reauth/baseQueryWithReauth";

export const retakeSlice = createApi({
    reducerPath: "retakeSlice",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Retake"],
    endpoints: (builder) => ({
        getEligibility: builder.query<any, { lessonId: string }>({
            query: ({ lessonId }) => ({
                url: `/quiz-retake/${lessonId}/eligibility`,
                method: "GET",
            }),
            providesTags: ["Retake"],
        }),
        requestRetake: builder.mutation<any, { lessonId: string }>({
            query: ({ lessonId }) => ({
                url: `/quiz-retake/${lessonId}/request`,
                method: "POST",
            }),
            invalidatesTags: ["Retake"],
        }),
        getApprovedRetakeRequest: builder.query<any, { lessonId: string }>({
            query: ({ lessonId }) => ({
                url: `/quiz-retake/${lessonId}/request/approved`,
                method: "GET",
            }),
            providesTags: ["Retake"],
        }),
        getRetakeRequests: builder.query<any, { page?: number; limit?: number; status?: string }>({
            query: ({ page = 1, limit = 10, status } = {}) => ({
                url: `/quiz-retake/requests`,
                method: "GET",
                params: { page, limit, status },
            }),
            providesTags: ["Retake"],
        }),
        approveRetakeRequest: builder.mutation<any, { requestId: string }>({
            query: ({ requestId }) => ({
                url: `/quiz-retake/${requestId}/approve`,
                method: "POST",
            }),
            invalidatesTags: ["Retake"],
        }),
        rejectRetakeRequest: builder.mutation<any, { requestId: string }>({
            query: ({ requestId }) => ({
                url: `/quiz-retake/${requestId}/reject`,
                method: "POST",
            }),
            invalidatesTags: ["Retake"],
        }),

    }),
});

export const {
    useGetEligibilityQuery,
    useRequestRetakeMutation,
    useGetApprovedRetakeRequestQuery,
    useGetRetakeRequestsQuery,
    useApproveRetakeRequestMutation,
    useRejectRetakeRequestMutation,
} = retakeSlice;
