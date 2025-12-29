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
  leaves: Leave[];
  total: number;
  page: number;
  totalPages: number;
}

// ! Leave
export interface LeaveResponse {
  success: boolean;
  leave: Leave;
  message: string;
  data: Leave;
}

export interface ApplyLeaveRequest {
  startDate: string;
  endDate: string;
  reason: string;
  type: string | 'sick' | 'casual' | 'earned' | 'public' | 'maternity' | 'paternity';
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
};

export type GetMyLeavesArgs = {
  page?: number;
  limit?: number;
  status?: string;
};

export type UpdateLeaveStatusArgs = {
  id: string;
  status: 'approved' | 'rejected';
  adminNotes?: string;
};

export type DeleteLeaveArgs = {
  id: string;
};

export const leaveApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all leaves (for admins)
    getLeaves: builder.query<LeavesResponse, GetLeavesArgs>({
      query: ({ page = 1, limit = 10, status = '', employeeId = '' }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        
        if (status) params.append('status', status);
        if (employeeId) params.append('employeeId', employeeId);
        
        return `/leaves?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.leaves.map(({ _id }) => ({ type: 'Leave' as const, id: _id })),
              { type: 'Leave', id: 'LIST' },
            ]
          : [{ type: 'Leave', id: 'LIST' }],
    }),
    
    // Get current user's leaves
    getMyLeaves: builder.query<LeavesResponse, GetMyLeavesArgs>({
      query: ({ page = 1, limit = 10, status = '' } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        
        if (status) params.append('status', status);
        
        return `/leaves/my?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.leaves.map(({ _id }) => ({ type: 'Leave' as const, id: _id })),
              { type: 'Leave', id: 'MY_LIST' },
            ]
          : [{ type: 'Leave', id: 'MY_LIST' }],
    }),
    
    // Apply for leave
    applyLeave: builder.mutation<LeaveResponse, ApplyLeaveRequest>({
      query: (leaveData) => ({
        url: '/leaves',
        method: 'POST',
        body: leaveData,
      }),
      invalidatesTags: [{ type: 'Leave', id: 'MY_LIST' }],
    }),
    
    // Update leave status (admin only)
    updateLeaveStatus: builder.mutation<LeaveResponse, UpdateLeaveStatusArgs>({
      query: ({ id, status, adminNotes }) => ({
        url: `/leaves/${id}/status`,
        method: 'PATCH',
        body: { status, adminNotes },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Leave', id },
        { type: 'Leave', id: 'LIST' },
        { type: 'Leave', id: 'MY_LIST' },
      ],
    }),
    
    // Delete leave
    deleteLeave: builder.mutation<{ success: boolean; message: string }, DeleteLeaveArgs>({
      query: ({ id }) => ({
        url: `/leaves/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Leave', id },
        { type: 'Leave', id: 'MY_LIST' },
      ],
    }),

    // Get leave by ID
    getLeave: builder.query<LeaveResponse, { id: string }>({
      query: ({ id }) => `/leaves/${id}`,
      providesTags: (result, error, { id }) => [{ type: 'Leave', id }],
    }),

    // Get leave statistics
    getLeaveStats: builder.query<{
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
    }, void>({
      query: () => '/leaves/stats',
      providesTags: ['Leave'],
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
  useDeleteLeaveMutation,
} = leaveApi;