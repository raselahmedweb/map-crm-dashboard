import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { IProjects } from "@/types/types";

// Define a service using a base URL and expected endpoints
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://map-crm-server.vercel.app/api/v1",
    credentials: "include",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (params) => ({
        url: `/user/all-users`,
        method: "GET",
        params,
      }),

      providesTags: ["User"],
    }),
    getMe: builder.query({
      query: () => ({
        url: `/auth/me`,
        method: "GET",
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
    updateUserByAdmin: builder.mutation({
      query: (UserData) => ({
        url: `/user/by-admin/${UserData._id}`,
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
    createCustomer: builder.mutation({
      query: (data) => ({
        url: `/customer/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getAllCustomer: builder.query({
      query: () => ({
        url: `/customer/all-customers`,
        method: "GET",
      }),

      providesTags: ["User"],
    }),
    inviteUser: builder.mutation({
      query: (data) => ({
        url: `/invite-user`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    createMap: builder.mutation({
      query: (data) => ({
        url: `/map/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getAllMap: builder.query({
      query: () => ({
        url: `/map/all-maps`,
        method: "GET",
      }),

      providesTags: ["User"],
    }),
    getSingleMap: builder.query({
      query: (id: string) => ({
        url: `/map/single/${id}`,
        method: "GET",
      }),

      providesTags: ["User"],
    }),
    getProjectMap: builder.query({
      query: (id: string) => ({
        url: `/map/project/${id}`,
        method: "GET",
      }),

      providesTags: ["User"],
    }),
    deleteMap: builder.mutation({
      query: (id) => ({
        url: `/map/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    createProjects: builder.mutation({
      query: (data) => ({
        url: `/projects/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getProjects: builder.query({
      query: () => ({
        url: `/projects/all-projects`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    getSingleProject: builder.query({
      query: (id: string) => ({
        url: `/projects/${id}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    updateProjects: builder.mutation<
      IProjects,
      { data: IProjects; id: string }
    >({
      query: ({ data, id }) => ({
        url: `/projects/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    createDevice: builder.mutation({
      query: (data) => ({
        url: `/item/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getDevices: builder.query({
      query: () => ({
        url: `/item/all-items`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    getDevicesWithDetails: builder.query({
      query: () => ({
        url: `/item/all-device-with-details`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    deleteDevice: builder.mutation({
      query: (id) => ({
        url: `/item/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    createItemOnMap: builder.mutation({
      query: (data) => ({
        url: `/item-on-map/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    changePositionOfItems: builder.mutation({
      query: (data) => ({
        url: `/item-on-map/change-position/${data.id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    getItemOnMap: builder.query({
      query: (id: string) => ({
        url: `/item-on-map/all-items-on-map/${id}`,
        method: "GET",
      }),

      providesTags: ["User"],
    }),
    deleteItemFromMap: builder.mutation({
      query: (id) => ({
        url: `/item-on-map/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetMeQuery,
  useCreateUserMutation,
  useLoginUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useUpdateUserByAdminMutation,
  useCreateCustomerMutation,
  useGetAllCustomerQuery,
  useInviteUserMutation,
  useCreateMapMutation,
  useGetAllMapQuery,
  useGetSingleMapQuery,
  useGetProjectMapQuery,
  useDeleteMapMutation,
  useCreateProjectsMutation,
  useGetProjectsQuery,
  useGetSingleProjectQuery,
  useUpdateProjectsMutation,
  useDeleteProjectMutation,
  useCreateDeviceMutation,
  useGetDevicesQuery,
  useGetDevicesWithDetailsQuery,
  useDeleteDeviceMutation,
  useCreateItemOnMapMutation,
  useChangePositionOfItemsMutation,
  useGetItemOnMapQuery,
  useDeleteItemFromMapMutation,
} = baseApi;
