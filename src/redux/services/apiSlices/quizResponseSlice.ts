import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "@/redux/reauth/baseQueryWithReauth";

export const quizResponseSlice = createApi({
  reducerPath: "quizResponseSlice",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["QuizResponse"],
  endpoints: (builder) => ({
    getStudentCourseOutcomes: builder.query<any, string>({
      query: (studentId) => ({
        url: `/lesson-quiz-response/${studentId}/course-outcomes`,
        method: "GET",
      }),
      providesTags: ["QuizResponse"],
    }),
    getAllResponses: builder.query<any, { page?: number; limit?: number; keyword?: string }>({
      query: ({ page = 1, limit = 10, keyword } = {}) => ({
        url: "/lesson-quiz-response/all",
        method: "GET",
        params: { page, limit, keyword },
      }),
      providesTags: ["QuizResponse"],
    }),
    exportResponsesXlsx: builder.mutation({
      query: (params: any) => ({
        url: "/lesson-quiz-response/export",
        method: "GET",
        params,
        responseHandler: async (response: any) => await response.blob(), // handles XLSX too
      }),
    }),
  }),
});

export const { useGetStudentCourseOutcomesQuery, useGetAllResponsesQuery, useExportResponsesXlsxMutation } = quizResponseSlice;
