import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "@/redux/reauth/baseQueryWithReauth";

/** Body for POST `/evaluation/:lessonId` (SubmitEvaluationDto). */
export type SubmitEvaluationBody = {
  confirmMaterialComplete: boolean;
  confirmEvaluationRequired: boolean;
  confirmFeedbackUse: boolean;
  scaleGainedNewKnowledge: number;
  scaleApplyRealWorld: number;
  scaleImprovedUnderstanding: number;
  scaleInstructionClear: number;
  scaleWouldRecommend: number;
};

export type EvaluationApiResponse<T = unknown> = {
  status?: boolean;
  message?: string;
  data?: T;
};

export type AdminEvaluationsQueryArgs = {
  page?: number | string;
  limit?: number | string;
  keyword?: string;
  from?: string;
  to?: string;
  lessonId?: string;
};

export const evaluationSlice = createApi({
  reducerPath: "evaluationSlice",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Evaluation"],
  endpoints: (builder) => ({
    /** Learner: submit evaluation for a quiz lesson. */
    submitEvaluation: builder.mutation<
      EvaluationApiResponse,
      { lessonId: string; body: SubmitEvaluationBody }
    >({
      query: ({ lessonId, body }) => ({
        url: `/evaluation/${encodeURIComponent(lessonId)}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Evaluation", id: `me-${arg.lessonId}` },
        "Evaluation",
      ],
    }),

    /** Learner: whether evaluation was already submitted for this lesson. */
    getMyEvaluationStatus: builder.query<EvaluationApiResponse, string>({
      query: (lessonId) => ({
        url: `/evaluation/me/${encodeURIComponent(lessonId)}`,
        method: "GET",
      }),
      providesTags: (_result, _error, lessonId) => [{ type: "Evaluation", id: `me-${lessonId}` }],
    }),

    /** Admin: paginated list (optional lessonId). */
    getAdminEvaluations: builder.query<EvaluationApiResponse, AdminEvaluationsQueryArgs | undefined>({
      query: (params) => {
        const p: AdminEvaluationsQueryArgs = params ?? {};
        const { page = 1, limit = 10, keyword, from, to, lessonId } = p;
        return {
          url: "/evaluation/admin",
          method: "GET",
          params: {
            page: String(page),
            limit: String(limit),
            ...(keyword?.trim() ? { keyword: keyword.trim() } : {}),
            ...(from ? { from } : {}),
            ...(to ? { to } : {}),
            ...(lessonId?.trim() ? { lessonId: lessonId.trim() } : {}),
          },
        };
      },
      providesTags: ["Evaluation"],
    }),

    /** Admin: single evaluation with user, lesson, course. */
    getAdminEvaluationById: builder.query<EvaluationApiResponse, string>({
      query: (id) => ({
        url: `/evaluation/admin/${encodeURIComponent(id)}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Evaluation", id: `admin-${id}` }],
    }),
  }),
});

export const {
  useSubmitEvaluationMutation,
  useGetMyEvaluationStatusQuery,
  useLazyGetMyEvaluationStatusQuery,
  useGetAdminEvaluationsQuery,
  useLazyGetAdminEvaluationsQuery,
  useGetAdminEvaluationByIdQuery,
  useLazyGetAdminEvaluationByIdQuery,
} = evaluationSlice;
