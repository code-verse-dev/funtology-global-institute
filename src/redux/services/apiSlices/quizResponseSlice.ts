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
  }),
});

export const { useGetStudentCourseOutcomesQuery } = quizResponseSlice;
