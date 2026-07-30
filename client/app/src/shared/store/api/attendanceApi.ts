import { apiSlice } from "./apiSlice";


export interface MarkAttendanceResponse {
    success: boolean;
    message: string;
    data: {
        message(message: any, SHORT: number): unknown;
        success: any;
        attendanceId: string;
        date: string;
        startTime: string;
        endTime?: string;
        startLocation?: {
            type: string;
            coordinates: [number, number];
        };
        endLocation?: {
            type: string;
            coordinates: [number, number];
        };
        workingHours?: number;
    };
}

export interface AttendanceLocation {
  type: string;
  coordinates: [number, number];
}

export interface Attendance {
  _id: string;
  employee: {
    _id: string;
    name: string;
    email: string;
    role: string;
    designation?: string;
    hq?: string;
    manager?: string;
  };
  date: string;
  startTime: string;
  endTime?: string;
  status: "present" | "absent" | "leave" | "holiday";
  workingHours?: number;
  startLocation?: AttendanceLocation;
  endLocation?: AttendanceLocation;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceHistoryQuery {
  status?: string;
  startDate?: string;
  endDate?: string;
  employeeId?: string;
  role?: string;
  hq?: string;
  page?: number;
  limit?: number;
}

export interface MarkAttendanceRequest {
    type: 'check-in' | 'check-out';
    location: {
        coordinates: [number, number];
    };
}



interface AttendanceData {
    attendanceId: string; // Maps to _id
    employeeId: string; // Maps to employee
    date: string;
    startTime: string;
    endTime?: string;
    status: string;
    startLocation?: AttendanceLocation;
    endLocation?: AttendanceLocation;
    createdAt: string;
    updatedAt: string;
    version: number; // Maps to __v
}

interface getMyTodaysAttendanceResponse {
    success: boolean;
    message: string;
    data: {
        workStarted: boolean;
        workEnded: boolean;
        workingHours: string;
        attendance: AttendanceData;
    };
}

export interface AttendanceHistoryResponse {
  success: boolean;
  message: string;
  data: Attendance[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
export const attendanceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    markAttendance: builder.mutation<
      MarkAttendanceResponse,
      MarkAttendanceRequest
    >({
      query: (credentials) => ({
        url: "/attendances/", // Make sure this matches your backend route
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          console.log("✅ Mark Attendance Success:", data);
        } catch (error) {
          console.log("❌ Mark Attendance Error:", error);
        }
      },
    }),
    getMyTodaysAttendance: builder.query<getMyTodaysAttendanceResponse, void>({
      query: () => "/attendances/",
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("✅ Get My Todays Attendance Success:", data);
        } catch (error) {
          console.log("❌ Get My Todays Attendance Error:", error);
        }
      },
    }),

    getMyAttendanceHistory: builder.query<
      AttendanceHistoryResponse,
      AttendanceHistoryQuery | void
    >({
      query: (params) => ({
        url: "/attendances/myhistory",
        params,
      }),
    }),

    getMyEmployeeAttendanceHistory: builder.query<
      AttendanceHistoryResponse,
      AttendanceHistoryQuery | void
    >({
      query: (params) => ({
        url: "/attendances/myemployeehistory",
        params,
      }),
    }),
    getAttendanceHistory: builder.query<
      AttendanceHistoryResponse,
      AttendanceHistoryQuery | void
    >({
      query: (params) => ({
        url: "/attendances/history",
        params,
      }),
    }),
  }),
});

export const { useMarkAttendanceMutation,
    useGetMyTodaysAttendanceQuery,
    useGetMyAttendanceHistoryQuery,
    useGetMyEmployeeAttendanceHistoryQuery,
    useGetAttendanceHistoryQuery
} = attendanceApi;