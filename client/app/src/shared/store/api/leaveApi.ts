import { apiSlice } from './apiSlice';

export interface Leave {
  _id: string;
  employee: {
    _id: string;
    name: string;
    email: string;
  };
  startDate: string;
  endDate: string;
  reason: string;
  leaveType:string;
  status: 'pending' | 'approved' | 'rejected';
  duration: number;
  createdAt: string;
  updatedAt: string;
}

// ! Leaves
export interface LeavesResponse {
  success: boolean;
  leaves: Leaves[];
  total: number;
  page: number;
  totalPages: number;
  pagination?: number;
  message: string;
  data: Leaves[];
}

type HQ = {
  _id: string;
  name: string;
  region: string;
};

type Employee = {
  _id: string;
  name: string;
  role: string;
  designation: string | null;
  hq: HQ;
};

export type Leaves = {
  _id: string;
  employee: Employee;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  isHalfDay: boolean;
  halfType: "first" | "second" | null;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

// ! Leave
export type LeaveResponse = {
  success: boolean;
  message: string;
  data: [Leave];
  pagination: {
    limit: number;
    page: number;
    total: number;
    pages: string;
  }
};


export interface ApplyLeaveRequest {
  startDate: string;
  endDate: string;
  reason: string;
  type: string | 'sick' | 'casual' | 'earned' | 'public' | 'maternity' | 'paternity';
  isHalfDay: boolean;
  halfType: string;
}

export interface UpdateLeaveStatusRequest {
  status: 'approved' | 'rejected';
  adminNotes?: string;
}

// Query argument types
export type GetLeavesArgs = {
  page?: number;
  limit?: number;
  status?: string;
  employeeId?: string;
  type?: string;
  hq?: string;
  name?: string;
  role?: string;
};

export type GetMyLeavesArgs = {
  page?: number;
  limit?: number;
  status?: string;
  employeeId?: string;
};

export type UpdateLeaveStatusArgs = {
  leaveId: string;
  status: "approved" | "rejected";
  approvedBy: {
    id: string;
    model: "Admin" | "Employee";
  };
  userId: string; // approver user id
};


export type DeleteLeaveArgs = {
  id: string;
};

export const leaveApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get all leaves (for admins)
    getLeaves: builder.query<LeavesResponse, GetLeavesArgs>({
      query: ({ page = 1, limit = 10, status, type, hq, name, role }) => {
        const params = new URLSearchParams();

        params.append("page", page.toString());
        params.append("limit", limit.toString());

        if (status) params.append("status", status);
        if (type) params.append("type", type);
        if (hq) params.append("hq", hq);
        if (name) params.append("name", name);
        if (role) params.append("role", role);


        return {
          url: `/leaves`,
          params,
        };

        
      },

      
  providesTags: (result) =>
    result?.data
      ? [
          ...result.data.map((leave) => ({
            type: "Leave" as const,
            id: leave._id,
          })),
          { type: "Leave", id: "LIST" },
        ]
      : [{ type: "Leave", id: "LIST" }],


    }),

    // Get current user's leaves
    getMyLeaves: builder.query<LeavesResponse, GetMyLeavesArgs>({
  query: ({ employeeId, page = 1, limit = 10, status }) => {
    const params = new URLSearchParams();

    params.append("page", page.toString());
    params.append("limit", limit.toString());

    if (status) params.append("status", status);

    return {
      url: `/leaves/employee/${employeeId}`,
      params,
    };
  },

  providesTags: (result) =>
    result
      ? [
          ...result.data.map(({ _id }) => ({
            type: "Leave" as const,
            id: _id,
          })),
          { type: "Leave", id: "MY_LIST" },
        ]
      : [{ type: "Leave", id: "MY_LIST" }],
}),

    // Apply for leave
    applyLeave: builder.mutation<LeaveResponse, ApplyLeaveRequest>({
      query: (leaveData) => ({
        url: "/leaves",
        method: "POST",
        body: leaveData,
      }),
      invalidatesTags: [{ type: "Leave", id: "MY_LIST" }],
    }),

    // Update leave status (admin only)
    updateLeaveStatus: builder.mutation<LeaveResponse, UpdateLeaveStatusArgs>({
      query: (body) => ({
        url: "/leaves",
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Leave", id: arg.leaveId },
        { type: "Leave", id: "LIST" },
      ],
    }),

    // Delete leave
    deleteLeave: builder.mutation<
      { success: boolean; message: string },
      DeleteLeaveArgs
    >({
      query: ({ id }) => ({
        url: `/leaves/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Leave", id },
        { type: "Leave", id: "MY_LIST" },
      ],
    }),

    // Get leave by ID
    getLeave: builder.query<LeaveResponse, { id: string }>({
      query: ({ id }) => `/leaves/${id}`,
      providesTags: (result, error, { id }) => [{ type: "Leave", id }],
    }),

    // Get leave statistics
    getLeaveStats: builder.query<
      {
        success: boolean;
        stats: {
          total: number;
          pending: number;
          approved: number;
          rejected: number;
          available: {
            sick: number;
            casual: number;
            earned: number;
            public: number;
          };
        };
      },
      void
    >({
      query: () => "/leaves/stats",
      providesTags: ["Leave"],
    }),
  }),
});

export const {
  useGetLeavesQuery,
  useGetMyLeavesQuery,
  useGetLeaveQuery,
  useGetLeaveStatsQuery,
  useApplyLeaveMutation,
  useUpdateLeaveStatusMutation,
} = leaveApi;