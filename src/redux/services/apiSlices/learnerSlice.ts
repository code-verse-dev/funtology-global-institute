import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "@/redux/reauth/baseQueryWithReauth";
import type { ApiCourse } from "./courseSlice";


export type InviteLearnerBody = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

export type ApiLearner = {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  status?: string;
  progress?: number;
  coursesCount?: number;
  completedCourses?: number;
  enrolledCourses?: number;
  assignments?: any[];
};

export type LearnersPaginated = {
  docs: ApiLearner[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
};

export type LearnersListResponse = {
  status: boolean;
  message: string;
  data: LearnersPaginated;
};

/** GET /learners/:id/courses — enrollment rows; shape may vary by backend */
export type AssignedCourseRow = {
  _id?: string;
  course?: ApiCourse | string;
  courseId?: string;
  progress?: number;
  completionPercentage?: number;
  status?: string;
};

export type AssignedCoursesResponse = {
  status: boolean;
  message: string;
  data: AssignedCourseRow[] | { courses?: AssignedCourseRow[]; docs?: AssignedCourseRow[] };
};

export type MutationResponse = {
  status: boolean;
  message: string;
  data?: unknown;
};

export type UpdateLearnerNameBody = {
  firstName: string;
  lastName: string;
};

export type UpdateLearnerNameArgs = {
  learnerId: string;
} & UpdateLearnerNameBody;

export const learnerSlice = createApi({
  reducerPath: "learnerSlice",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Learners"],
  endpoints: (builder) => ({
    inviteLearner: builder.mutation<MutationResponse, InviteLearnerBody>({
      query: (body) => ({
        url: "/learners/invite",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Learners", id: "LIST" }],
    }),

    getLearners: builder.query<
      LearnersListResponse,
      { page?: number; limit?: number; keyword?: string; status?: string }
    >({
      query: ({ page, limit, keyword, status } = {}) => ({
        url: "/learners",
        method: "GET",
        params: { page, limit, keyword, status },
      }),
      providesTags: [{ type: "Learners", id: "LIST" }],
    }),

    assignCourseToLearner: builder.mutation<MutationResponse, { learnerId: string; courseIds: string[] }>({
      query: ({ learnerId, courseIds }) => ({
        url: `/learners/${learnerId}/assign`,
        method: "POST",
        body: { courseIds },
      }),
      invalidatesTags: (_r, _e, { learnerId }) => [
        { type: "Learners", id: "LIST" },
        { type: "Learners", id: `courses-${learnerId}` },
      ],
    }),

    getAssignedCourses: builder.query<AssignedCoursesResponse, { learnerId: string }>({
      query: ({ learnerId }) => ({
        url: `/learners/${learnerId}/courses`,
        method: "GET",
      }),
      providesTags: (_r, _e, { learnerId }) => [{ type: "Learners", id: `courses-${learnerId}` }],
    }),

    removeCourseFromLearner: builder.mutation<MutationResponse, { learnerId: string; courseId: string }>({
      query: ({ learnerId, courseId }) => ({
        url: `/learners/${learnerId}/courses/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, { learnerId }) => [
        { type: "Learners", id: "LIST" },
        { type: "Learners", id: `courses-${learnerId}` },
      ],
    }),

    updateLearnerName: builder.mutation<MutationResponse, UpdateLearnerNameArgs>({
      query: ({ learnerId, firstName, lastName }) => ({
        url: `/learners/${learnerId}/name`,
        method: "PATCH",
        body: { firstName, lastName },
      }),
      invalidatesTags: (_r, _e, { learnerId }) => [
        { type: "Learners", id: "LIST" },
        { type: "Learners", id: `courses-${learnerId}` },
      ],
    }),
    getOrganizationStats: builder.query<any, void>({
      query: () => ({
        url: "/learners/stats",
        method: "GET",
      }),
    }),
    getLearnerStats: builder.query<any, void>({
      query: () => ({
        url: "/learners/my/stats",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useInviteLearnerMutation,
  useGetLearnersQuery,
  useAssignCourseToLearnerMutation,
  useGetAssignedCoursesQuery,
  useRemoveCourseFromLearnerMutation,
  useUpdateLearnerNameMutation,
  useGetOrganizationStatsQuery,
  useGetLearnerStatsQuery,
} = learnerSlice;
