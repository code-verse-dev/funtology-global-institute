import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/constants/api";
import baseQueryWithReauth from "@/redux/reauth/baseQueryWithReauth";

export type UserStatus = "ACTIVE" | "INACTIVE" | "PENDING";

export type ApiUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  image?: string;
  status: UserStatus;
  role: string;
  organizationName?: string;
  streetAddress?: string;
  department?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type PaginatedUsers = {
  docs: ApiUser[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  pagingCounter?: number;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
  prevPage?: number | null;
  nextPage?: number | null;
};

export type GetUsersApiResponse = {
  status: boolean;
  message: string;
  data: PaginatedUsers;
};

export type UserByIdApiResponse = {
  status: boolean;
  message: string;
  data: ApiUser;
};

export type ToggleStatusBody = {
  id: string;
  status: UserStatus;
};

export type GetUsersQueryArgs = {
  page?: number;
  limit?: number;
  keyword?: string;
  role?: string;
  status?: UserStatus | "";
  from?: string;
  to?: string;
};

export const userApiSlice = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUsers: builder.query<
    any,
    { page?: number; limit?: number; keyword?: string; role?: string, status?: string, from?: string, to?: string }
  >({
    query: ({ page, limit, keyword, role, status, from, to } = {}) => ({
      url: "/user/admin/getUsers",
      method: "GET",
      params: { page, limit, keyword, role, status, from, to },
    }),
    providesTags: ["User"],
  }),

    getUserById: builder.query<UserByIdApiResponse, string>({
      query: (id) => `/user/getUser/${id}`,
      providesTags: (_result, _err, id) => [{ type: "User", id }],
    }),

    updateUserStatus: builder.mutation<UserByIdApiResponse, ToggleStatusBody>({
      query: ({ id, status }) => ({
        url: `/user/toggle/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "User", id: "LIST" },
        { type: "User", id },
      ],
    }),
    getAdminStats: builder.query<any, void>({
      query: () => ({
        url: "/user/admin/stats",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserStatusMutation,
  useGetAdminStatsQuery,
} = userApiSlice;
