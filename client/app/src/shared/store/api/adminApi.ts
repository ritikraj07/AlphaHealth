import {apiSlice } from './apiSlice';

export const adminApi = apiSlice.injectEndpoints({
    
  endpoints: (builder) => ({
    getAdminDashboard: builder.query({
      query: () => "/admin/dashboard",
      providesTags: ["AdminDashboard"],
    }),
  }),
});



export const {useGetAdminDashboardQuery} = adminApi;