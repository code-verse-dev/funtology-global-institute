import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "@/redux/reauth/baseQueryWithReauth";

export type CourseStatus = "published" | "draft" | "inactive";

export type ApiCourse = {
  _id: string;
  title: string;
  learningObjectives?: string[];
  sortOrder: number;
  image?: string;
  description?: string;
  ceHours: number;
  status: CourseStatus;
  createdAt?: string;
  updatedAt?: string;
  ongoingHours?: number;
};

export type PaginatedCourses = {
  docs: ApiCourse[];
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

export type GetCoursesApiResponse = {
  status: boolean;
  message: string;
  data: PaginatedCourses;
};

export type CourseDetailApiResponse = {
  status: boolean;
  message: string;
  data: ApiCourse;
};

/** PATCH /course/:id — matches UpdateCourseDto (all fields optional) */
export type UpdateCourseBody = {
  title?: string;
  description?: string;
  learningObjectives?: string[];
  ceHours?: number;
  sortOrder?: number;
};

/** Matches backend QueryDto fields used by GET /api/course */
export type GetCoursesQueryArgs = {
  page?: string | number;
  limit?: string | number;
  keyword?: string;
  status?: string;
  from?: string;
  to?: string;
};

export const courseApiSlice = createApi({
  reducerPath: "courseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Course"],
  endpoints: (builder) => ({
    getCourses: builder.query<GetCoursesApiResponse, GetCoursesQueryArgs | undefined>({
      query: (args) => {
        const {
          page = "1",
          limit = "10",
          keyword,
          status,
          from,
          to,
        } = args ?? {};
        const params: Record<string, string> = {
          page: String(page),
          limit: String(limit),
        };
        if (keyword?.trim()) params.keyword = keyword.trim();
        if (status) params.status = status;
        if (from) params.from = from;
        if (to) params.to = to;
        return {
          url: "/course",
          method: "GET",
          params,
        };
      },
      providesTags: [{ type: "Course", id: "LIST" }],
    }),

    getCourseById: builder.query<CourseDetailApiResponse, string>({
      query: (id) => ({
        url: `/course/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _err, id) => [{ type: "Course", id }],
    }),
    
    getPublicCourseById: builder.query<CourseDetailApiResponse, string>({
      query: (id) => ({
        url: `/course/getCourseById/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _err, id) => [{ type: "Course", id }],
    }),

    updateCourse: builder.mutation<
      CourseDetailApiResponse,
      { id: string; body: UpdateCourseBody }
    >({
      query: ({ id, body }) => ({
        url: `/course/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Course", id },
        { type: "Course", id: "LIST" },
      ],
    }),

    updateCourseStatus: builder.mutation<
      CourseDetailApiResponse,
      { id: string; status: CourseStatus }
    >({
      query: ({ id, status }) => ({
        url: `/course/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Course", id },
        { type: "Course", id: "LIST" },
      ],
    }),

    getAllCourses: builder.query<any, void>({
      query: () => ({
        url: "/course/getAllCourses",
        method: "GET",
      }),
      providesTags: ["Course"],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useLazyGetCoursesQuery,
  useGetCourseByIdQuery,
  useUpdateCourseMutation,
  useUpdateCourseStatusMutation,
  useGetAllCoursesQuery,
  useGetPublicCourseByIdQuery,
} = courseApiSlice;
