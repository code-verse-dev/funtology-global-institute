import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "@/redux/reauth/baseQueryWithReauth";

export type OrgCertificateCourse = {
  _id: string;
  title?: string;
  image?: string;
};

export type OrgCertificateStudent = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
};

export type OrganizationLearnerCertificate = {
  _id: string;
  certificateUrl?: string;
  course?: OrgCertificateCourse | string;
  createdAt?: string;
  updatedAt?: string;
  student?: OrgCertificateStudent | string;
  lesson?: { _id?: string; type?: string; order?: number };
  quizResponse?: string;
};

export type OrganizationCertificatesResponse = {
  status: boolean;
  message: string;
  data: OrganizationLearnerCertificate[] | { docs?: OrganizationLearnerCertificate[] };
};

export const certificateSlice = createApi({
  reducerPath: "certificateSlice",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Certificates"],
  endpoints: (builder) => ({
    getOrganizationCertificates: builder.query<OrganizationCertificatesResponse, void>({
      query: () => ({
        url: "/certificate/organization/learners-certificates",
        method: "GET",
      }),
      providesTags: ["Certificates"],
    }),
    getMyCertificates: builder.query<any, void>({
      query: () => ({
        url: "/certificate/my-certificates",
        method: "GET",
      }),
      providesTags: ["Certificates"],
    }),
  }),
});

export const { useGetOrganizationCertificatesQuery, useGetMyCertificatesQuery } = certificateSlice;
