import { AnalyticsResponse, EmployeeDashboardResponse } from "../../types/analytics.types";
import { apiSlice } from "./apiSlice";



export const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get Analytics
    getAnalytics: builder.query<
      AnalyticsResponse,
      Partial<{
        startDate: string;
        endDate: string;
        compareStart: string;
        compareEnd: string;
        groupBy: "day" | "week" | "month" | "quarter";
        employee: string;
        hq: string;
        doctorChemist: string;
        product: string;
        category: string;
      }>
    >({
      query: (params) => ({
        url: "/analytics/dashboard-analytics",
        method: "GET",
        params,
      }),
      providesTags: ["Analytics"],
    }),
    getEmployeeDashboard: builder.query<EmployeeDashboardResponse, void>({
      query: () => ({
        url: "/analytics/employee-dashboard",
        method: "GET",
      }),
      providesTags: ["Dashboard", "POB", "Visits", "Employee", "Leave", "Plan", "Analytics" ],
    }),
  }),
});

export const {
  useGetAnalyticsQuery, useGetEmployeeDashboardQuery
} = analyticsApi;
