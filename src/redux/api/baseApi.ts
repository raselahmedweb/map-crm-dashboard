import Cookies from "js-cookie";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => ({
        url: `/user/all-users`,
        method: "GET",
        headers: {
          Authorization: `${Cookies.get("accessToken")}`,
        },
      }),

      providesTags: ["User"],
    }),

    createUser: builder.mutation({
      query: (UserData) => ({
        url: `/user/register`,
        method: "POST",
        body: UserData,
      }),
      invalidatesTags: ["User"],
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: `/auth/login`,
        method: "POST",
        credentials: "include",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: (UserData) => ({
        url: `/user/${UserData._id}`,
        method: "PATCH",
        body: UserData,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    getAllMap: builder.query({
      query: () => ({
        url: `/map/all-maps`,
        method: "GET",
        headers: {
          Authorization: `${Cookies.get("accessToken")}`,
        },
      }),

      providesTags: ["User"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useCreateUserMutation,
  useLoginUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetAllMapQuery,
} = baseApi;
