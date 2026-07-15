import { apiSlice } from "./apiSlice";

export interface CreateDoctorChemistRequest {
  name: string;
  email?: string;
  type: "doctor" | "chemist";
  specialization?: string;
  location?: string;
  hq: string;
  addedBy: {
    id: string;
    role: string;
    model: string;
  };
  phoneNo?: string;
}

export interface DoctorChemist {
  _id: string;
  name: string;
  email?: string;
  type: string;
  specialization?: string;
  location?: string;
  hq: string;
  addedBy: {
    id: string;
    role: string;
    model: string;
  };
  createdAt: string;
  updatedAt: string;
  potential: string;
  frequency: number;
  isApproved: boolean;
  approvedBy: {
    id: string;
    role: string;
    model: string;
  };
  phone?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  extra: {
    total: number;
    chemists: number;
    doctors: number;
  };
}

export const doctorChemistApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 Dashboard list
    getDoctorChemistDashboard: builder.query<
      ApiResponse<DoctorChemist[]>,
      {
        type?: string;
        potential?: string;
        isApproved?: boolean;
        search?: string;
        page?: number;
      }
    >({
      query: (params) => ({
        url: "/doctorChemists",
        params,
      }),
      providesTags: ["DoctorChemist"],
    }),

    // 🔹 Create doctor / chemist
    createDoctorChemist: builder.mutation<
      ApiResponse<DoctorChemist>,
      CreateDoctorChemistRequest
    >({
      query: (body) => ({
        url: "/doctorChemists",
        method: "POST",
        body,
      }),
      invalidatesTags: ["DoctorChemist"],
    }),


    // approve doctor / chemist

    approveDoctorChemist: builder.mutation<
      ApiResponse<DoctorChemist>,
      { doctorChemistId: string }
    >({
      query: (body) => ({
        url: `/doctorChemists/approve`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["DoctorChemist"],
    })


  }),
});

export const {
  useGetDoctorChemistDashboardQuery,
  useCreateDoctorChemistMutation,
  useApproveDoctorChemistMutation
} = doctorChemistApi;
