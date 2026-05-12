import { createApi } from "@reduxjs/toolkit/query/react";
import nonprofitBaseQueryWithReauth from "@/redux/reauth/nonprofitBaseQueryWithReauth";
import type { UserByIdApiResponse, UserStatus } from "@/redux/services/apiSlices/userSlice";
import type { AdminEvaluationsQueryArgs, EvaluationApiResponse } from "@/redux/services/apiSlices/evaluationSlice";
import type {
  GetTicketsArgs,
  TicketDetailResponse,
  TicketsListResponse,
  TicketsStatsResponse,
  TicketStatus,
} from "@/redux/services/apiSlices/ticketSlice";

export type NonprofitOrgRequestsQueryArgs = {
  page?: number;
  limit?: number;
  keyword?: string;
  status?: string;
  from?: string;
  to?: string;
};

/**
 * RTK Query API for admin actions against the non-profit backend only.
 * Paths mirror the main API; base URL is NONPROFIT_BASE_URL.
 */
export const nonprofitAdminApiSlice = createApi({
  reducerPath: "nonprofitAdminApi",
  baseQuery: nonprofitBaseQueryWithReauth,
  tagTypes: ["NpOrgRequest", "NpUser", "NpEvaluation", "NpTickets", "NpNotifications"],
  endpoints: (builder) => ({
    getNonprofitOrganizationRequests: builder.query<any, NonprofitOrgRequestsQueryArgs | void>({
      query: (params:any) => {
        const p = params ?? {};
        const { page = 1, limit = 10, keyword, status, from, to } = p;
        return {
          url: "/subscription/organization-requests",
          method: "GET",
          params: {
            page: String(page),
            limit: String(limit),
            ...(keyword?.trim() ? { keyword: keyword.trim() } : {}),
            ...(status?.trim() ? { status: status.trim() } : {}),
            ...(from ? { from } : {}),
            ...(to ? { to } : {}),
          },
        };
      },
      providesTags: ["NpOrgRequest"],
    }),

    approveNonprofitOrganizationRequest: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/subscription/organization-request/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: ["NpOrgRequest"],
    }),

    rejectNonprofitOrganizationRequest: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/subscription/organization-request/${id}/reject`,
        method: "POST",
      }),
      invalidatesTags: ["NpOrgRequest"],
    }),

    getNonprofitUsers: builder.query<
      any,
      { page?: number; limit?: number; keyword?: string; role?: string; status?: string; from?: string; to?: string }
    >({
      query: ({ page, limit, keyword, role, status, from, to } = {}) => ({
        url: "/user/admin/getUsers",
        method: "GET",
        params: { page, limit, keyword, role, status, from, to },
      }),
      providesTags: ["NpUser"],
    }),

    exportNonprofitUsersXlsx: builder.mutation<Blob, Record<string, unknown>>({
      query: (params) => ({
        url: "/user/admin/exportUsers",
        method: "GET",
        params,
        responseHandler: async (response: Response) => response.blob(),
      }),
    }),

    getNonprofitUserById: builder.query<UserByIdApiResponse, string>({
      query: (id) => `/user/getUser/${id}`,
      providesTags: (_r, _e, id) => [{ type: "NpUser", id }],
    }),

    updateNonprofitUserStatus: builder.mutation<UserByIdApiResponse, { id: string; status: UserStatus }>({
      query: ({ id, status }) => ({
        url: `/user/toggle/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (_r, _e, { id }) => ["NpUser", { type: "NpUser", id }],
    }),

    getNonprofitAdminEvaluations: builder.query<EvaluationApiResponse, AdminEvaluationsQueryArgs | undefined>({
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
      providesTags: ["NpEvaluation"],
    }),

    getNonprofitTickets: builder.query<TicketsListResponse, GetTicketsArgs>({
      query: ({ page = 1, limit = 10, keyword }: GetTicketsArgs) => {
        const params: Record<string, string> = {
          page: String(page),
          limit: String(limit),
        };
        if (keyword?.trim()) params.keyword = keyword.trim();
        return {
          url: "/ticket",
          method: "GET",
          params,
        };
      },
      providesTags: ["NpTickets"],
    }),

    updateNonprofitTicketStatus: builder.mutation<
      TicketDetailResponse,
      { id: string; status: TicketStatus }
    >({
      query: ({ id, status }) => ({
        url: `/ticket/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["NpTickets"],
    }),

    getNonprofitTicketsStats: builder.query<TicketsStatsResponse, void>({
      query: () => ({
        url: "/ticket/stats",
        method: "GET",
      }),
      providesTags: ["NpTickets"],
    }),

    getNonprofitAdminNotifications: builder.query<any, { page?: number; limit?: number; isRead?: boolean }>({
      query: ({ page, limit, isRead } = {}) => ({
        url: "/notification/getAllAdminNotifications",
        method: "GET",
        params: { page, limit, isRead },
      }),
      providesTags: ["NpNotifications"],
    }),

    toggleNonprofitNotification: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/notification/toggleNotification/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["NpNotifications"],
    }),

    markAllNonprofitNotificationsRead: builder.mutation<any, void>({
      query: () => ({
        url: "/notification/admin/mark-all-read",
        method: "PUT",
      }),
      invalidatesTags: ["NpNotifications"],
    }),
  }),
});

export const {
  useGetNonprofitOrganizationRequestsQuery,
  useApproveNonprofitOrganizationRequestMutation,
  useRejectNonprofitOrganizationRequestMutation,
  useGetNonprofitUsersQuery,
  useExportNonprofitUsersXlsxMutation,
  useGetNonprofitUserByIdQuery,
  useUpdateNonprofitUserStatusMutation,
  useGetNonprofitAdminEvaluationsQuery,
  useGetNonprofitTicketsQuery,
  useUpdateNonprofitTicketStatusMutation,
  useGetNonprofitTicketsStatsQuery,
  useGetNonprofitAdminNotificationsQuery,
  useToggleNonprofitNotificationMutation,
  useMarkAllNonprofitNotificationsReadMutation,
} = nonprofitAdminApiSlice;
