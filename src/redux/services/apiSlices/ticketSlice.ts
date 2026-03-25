import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "@/redux/reauth/baseQueryWithReauth";

export type TicketStatus = "open" | "in-progress" | "resolved";

export type ApiTicket = {
  _id: string;
  user: string;
  subject: string;
  description?: string;
  status: TicketStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type TicketsPaginated = {
  docs: ApiTicket[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
};

export type TicketsListResponse = {
  status: boolean;
  message: string;
  data: TicketsPaginated;
};

export type TicketsStatsData = {
  totalTickets: number;
  openTickets: number;
  inProgress: number;
  resolved: number;
};

export type TicketsStatsResponse = {
  status: boolean;
  message: string;
  data: TicketsStatsData;
};

export type TicketDetailResponse = {
  status: boolean;
  message: string;
  data: ApiTicket;
};

export type GetTicketsArgs = {
  page?: number;
  limit?: number;
  keyword?: string;
};

export const ticketSlice = createApi({
  reducerPath: "ticketSlice",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Tickets"],
  endpoints: (builder) => ({
    getTickets: builder.query<TicketsListResponse, GetTicketsArgs>({
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
      providesTags: ["Tickets"],
    }),

    updateTicketStatus: builder.mutation<
      TicketDetailResponse,
      { id: string; status: TicketStatus }
    >({
      query: ({ id, status }) => ({
        url: `/ticket/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Tickets"],
    }),

    getTicketsStats: builder.query<TicketsStatsResponse, void>({
      query: () => ({
        url: "/ticket/stats",
        method: "GET",
      }),
      providesTags: ["Tickets"],
    }),
  }),
});

export const { useGetTicketsQuery, useUpdateTicketStatusMutation, useGetTicketsStatsQuery } = ticketSlice;
