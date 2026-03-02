import { apiSlice } from "./apiSlice";
import {
  Plan,
  CreatePlanPayload,
  UpdatePlanStatusPayload,
  PlanResponses,
} from "../../types/plan.types";

export const planApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get My Plans
    getMyPlans: builder.query<PlanResponses, void>({
      query: () => "/plans/my",
      providesTags: ["Plan"],
    }),

    // ✅ Create Plan
    createPlan: builder.mutation<Plan, CreatePlanPayload>({
      query: (planData) => ({
        url: "/plans",
        method: "POST",
        body: planData,
      }),
      invalidatesTags: ["Plan"],
    }),

    // ✅ Update Plan Status
    markPlanStatus: builder.mutation<Plan, UpdatePlanStatusPayload>({
      query: ({ id, status }) => ({
        url: `/plans/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Plan"],
    }),
  }),
});

export const {
  useGetMyPlansQuery,
  useCreatePlanMutation,
  useMarkPlanStatusMutation,
} = planApi;
