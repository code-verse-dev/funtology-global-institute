import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../../constants/api";

export const authSlice = createApi({
  reducerPath: "authSlice",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, credentials: "include" }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: "/user/login",
        method: "POST",
        body,
      }),
    }),

    register: builder.mutation<
      { status: boolean; message: string; data?: unknown },
      FormData
    >({
      query: (body) => ({
        url: "/user/signup",
        method: "POST",
        body,
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/user/logout",
        method: "POST",
      }),
    }),

    forgetPassword: builder.mutation<any, { data: any }>({
      query: ({ data }) => ({
        url: "/reset/sendVerificationCode",
        method: "POST",
        body: data,
      }),
    }),

    verifyOtp: builder.mutation<any, { email: string; code: string }>({
      query: ({ email, code }) => ({
        url: "/reset/verifyRecoverCode",
        method: "POST",
        body: { email, code },
      }),
    }),
    resetPassword: builder.mutation<
      any,
      { email: string; code: string; password: string; type: string }
    >({
      query: ({ email, code, password, type }) => ({
        url: "/reset/resetPassword",
        method: "POST",
        body: { email, code, password, type },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgetPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useLogoutMutation,
} = authSlice;
