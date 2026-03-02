import { apiSlice } from "./apiSlice";

// ================= TYPES =================

import { IVisit, VisitsResponse, CreateVisitPayload } from "../../types/visit.types";

// ================= API =================

export const visitApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 Create Visit
    createVisit: builder.mutation<
      { success: boolean; data: IVisit },
      CreateVisitPayload
    >({
      query: (body) => ({
        url: "/visits",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Visits", "Plan"],
    }),

    // 🔹 Get My Visits
    getMyVisits: builder.query<VisitsResponse, void>({
      query: () => ({
        url: "/visits/my",
        method: "GET",
      }),
      providesTags: ["Visits"],
    }),

    // 🔹 Get Team Visits (Admin / Manager)
    getTeamVisits: builder.query<VisitsResponse, void>({
      query: () => ({
        url: "/visits/team",
        method: "GET",
      }),
      providesTags: ["Visits"],
    }),

    // 🔹 Delete Visit
    deleteVisit: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/visits/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Visits"],
    }),
  }),
});

export const {
  useCreateVisitMutation,
  useGetMyVisitsQuery,
  useGetTeamVisitsQuery,
  useDeleteVisitMutation,
} = visitApi;
