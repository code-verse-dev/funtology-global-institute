import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "@/redux/reauth/baseQueryWithReauth";

export type SubmitFeedbackBody = {
  fullName: string;
  subject: string;
  email: string;
  message: string;
};

export type SubmitFeedbackResponse = {
  status: boolean;
  message: string;
  data?: unknown;
};

export const feedbackSlice = createApi({
  reducerPath: "feedbackSlice",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    submitFeedback: builder.mutation<SubmitFeedbackResponse, SubmitFeedbackBody>({
      query: (body) => ({
        url: "/feedback/submit",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSubmitFeedbackMutation } = feedbackSlice;
