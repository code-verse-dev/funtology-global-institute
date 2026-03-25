import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "@/redux/reauth/baseQueryWithReauth";

export type LessonType = "PDF" | "QUIZ";

export type ApiLesson = {
  _id: string;
  course: string;
  type: LessonType;
  order: number;
  fileUrl?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type QuizQuestionType = "multiple_choice" | "true_false" | "short_answer";

export type ApiQuizQuestion = {
  _id: string;
  lesson: string;
  question: string;
  type: QuizQuestionType;
  options: string[];
  correctAnswer: string | number | boolean;
  points: number;
  order: number;
};

export type QuizQuestionCreateItem = {
  question: string;
  type: QuizQuestionType;
  options?: string[];
  correctAnswer: string | number | boolean;
  points?: number;
  order: number;
};

export type ApiEnvelope<T> = {
  status: boolean;
  message: string;
  data: T;
};

export type QuizResponseUser = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
};

export type QuizResponseRow = {
  _id: string;
  lesson?: unknown;
  user?: QuizResponseUser;
  score: number;
  totalPoints: number;
  percentage: number;
  result?: "PASSED" | "FAILED";
  createdAt?: string;
  answers?: unknown[];
};

export type QuizResponsesListPayload = {
  data: QuizResponseRow[];
  page: number;
  limit: number;
  totalPages: number;
  total: number;
  passThresholdPercent?: number;
};

export const lessonSlice = createApi({
  reducerPath: "lessonApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Lessons", "QuizQuestions", "QuizResponses"],
  endpoints: (builder) => ({
    getLessonById: builder.query<ApiEnvelope<ApiLesson>, { id: string }>({
      query: ({ id }) => ({
        url: `/lesson/${id}`,
        method: "GET",
      }),
      providesTags: (_r, _e, { id }) => [{ type: "Lessons", id }],
    }),

    getLessonsByCourse: builder.query<ApiEnvelope<ApiLesson[]>, { course: string }>({
      query: ({ course }) => ({
        url: `/lesson`,
        method: "GET",
        params: { course },
      }),
      providesTags: (_r, _e, { course }) => [{ type: "Lessons", id: `course-${course}` }],
    }),

    getQuizQuestions: builder.query<ApiEnvelope<ApiQuizQuestion[]>, { lessonId: string }>({
      query: ({ lessonId }) => ({
        url: `/lesson-quiz-question/${lessonId}`,
        method: "GET",
      }),
      providesTags: (_r, _e, { lessonId }) => [{ type: "QuizQuestions", id: lessonId }],
    }),

    getResponseById: builder.query<ApiEnvelope<unknown>, { responseId: string }>({
      query: ({ responseId }) => ({
        url: `/lesson-quiz-response/by-id/${responseId}`,
        method: "GET",
      }),
      providesTags: (_r, _e, { responseId }) => [{ type: "QuizResponses", id: `detail-${responseId}` }],
    }),

    getQuizResponses: builder.query<
      ApiEnvelope<QuizResponsesListPayload>,
      { lessonId: string; page?: string; limit?: string; result?: string }
    >({
      query: ({ lessonId, page = "1", limit = "10", result }) => ({
        url: `/lesson-quiz-response/${lessonId}`,
        method: "GET",
        params: {
          page,
          limit,
          ...(result ? { result } : {}),
        },
      }),
      providesTags: (_r, _e, { lessonId }) => [{ type: "QuizResponses", id: `list-${lessonId}` }],
    }),

    createLessonQuizQuestions: builder.mutation<
      ApiEnvelope<unknown>,
      { lesson: string; questions: QuizQuestionCreateItem[] }
    >({
      query: (body) => ({
        url: "/lesson-quiz-question",
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "QuizQuestions", id: arg.lesson },
        { type: "QuizResponses", id: `list-${arg.lesson}` },
      ],
    }),

    updateQuizQuestion: builder.mutation<
      ApiEnvelope<ApiQuizQuestion>,
      {
        id: string;
        question: string;
        type: QuizQuestionType;
        options?: string[];
        correctAnswer: string | number | boolean;
        points?: string;
        order: number;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/lesson-quiz-question/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result) => {
        const q = result?.data as ApiQuizQuestion | undefined;
        const lid = q?.lesson != null ? String(q.lesson) : null;
        return lid
          ? [
              { type: "QuizQuestions", id: lid },
              { type: "QuizResponses", id: `list-${lid}` },
            ]
          : [{ type: "QuizQuestions" }];
      },
    }),

    /** Multipart PUT — send `file` only when replacing PDF. */
    updateLesson: builder.mutation<
      ApiEnvelope<ApiLesson>,
      { id: string; course: string; type: LessonType; order: number; file?: File | null }
    >({
      query: ({ id, course, type, order, file }) => {
        const formData = new FormData();
        formData.append("course", course);
        formData.append("type", type);
        formData.append("order", String(order));
        if (file) formData.append("file", file);
        return {
          url: `/lesson/${id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: (_r, _e, arg) => [
        { type: "Lessons", id: `course-${arg.course}` },
        { type: "Lessons", id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetLessonByIdQuery,
  useGetLessonsByCourseQuery,
  useGetQuizQuestionsQuery,
  useGetResponseByIdQuery,
  useGetQuizResponsesQuery,
  useCreateLessonQuizQuestionsMutation,
  useUpdateQuizQuestionMutation,
  useUpdateLessonMutation,
} = lessonSlice;
