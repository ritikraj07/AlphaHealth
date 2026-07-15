import { apiSlice } from "./apiSlice";

export const pobApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create POB
    createPOB: builder.mutation({
      query: (data) => ({
        url: "/pobs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["POB", "Dashboard", "Analytics"],
    }),

    // Get My POB
    getMyPOB: builder.query({
      query: (query) => ({
        url: "/pobs/my",
        method: "GET",
        query: query,
      }),
      providesTags: ["POB"],
    }),

    // Get Team POB
    getTeamPOB: builder.query({
      query: () => ({
        url: "/pobs/team",
        method: "GET",
      }),
      providesTags: ["POB"],
    }),

    // Delete POB
    deletePOB: builder.mutation({
      query: (id) => ({
        url: `/pobs/${id}`,
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
