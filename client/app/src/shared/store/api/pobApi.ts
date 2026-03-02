import { apiSlice } from "./apiSlice";

export const pobApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create POB
    createPOB: builder.mutation({
      query: (data) => ({
        url: "/plans",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["POB"],
    }),

    // Get My POB
    getMyPOB: builder.query({
      query: () => ({
        url: "/plans/my",
        method: "GET",
      }),
      providesTags: ["POB"],
    }),

    // Get Team POB
    getTeamPOB: builder.query({
      query: () => ({
        url: "/plans/team",
        method: "GET",
      }),
      providesTags: ["POB"],
    }),

    // Delete POB
    deletePOB: builder.mutation({
      query: (id) => ({
        url: `/plans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["POB"],
    }),
  }),
});

export const {
  useCreatePOBMutation,
  useGetMyPOBQuery,
  useGetTeamPOBQuery,
  useDeletePOBMutation,
} = pobApi;
