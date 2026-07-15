import { apiSlice } from './apiSlice';


export interface leavesTaken {
  sick: number;
  casual: number;
  earned: number;
  public: number;

}
// Define TypeScript interfaces
export interface Employee {
  _id: string;
  name: string;
  email: string;
  role: string;
  hq: {
    _id: string;
    name: string;
  };
  manager: any;
  leavesTaken: leavesTaken;
  managerModel?: string;
  phone: number;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeResponse{
  success: boolean;
  data: Employee,
  message: string
}

export interface EmployeesResponse {
  success: boolean;
  message: string;
  data: {
    employees: Employee[];
    pagination: {
      currentPage: number;
      pageSize: number;
      totalEmployees: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    }
  };
}

export interface CreateEmployeeResponse {
  success: boolean;
  employee: Employee;
  message: string;
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  password: string;
  role: "employee" | "manager";
  hq: string;
  manager: string;
  managerModel: string;
  phone: string;
  designation: string;

}



// Define query argument types
export type GetEmployeesArgs = {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  status?: string;
};

export type GetEmployeeArgs = {
  id: string;
};


export interface UpdateEmployeeRequest {
  name?: string;
  email?: string;
  phone?: string;
  employmentStatus?: string;
  hq?: string;
  manager?: string | null;
  managerModel?: string | null;
  role?: string;
  designation?: string | null;
}




export const employeeApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get all employees with pagination and search
    getEmployees: builder.query<EmployeesResponse, GetEmployeesArgs>({
      query: () => ({
        url: `/employee`,
        method: "GET",
      }),
      providesTags: ["AdminDashboard", { type: "Employee", id: "LIST" }, "Employee"],
    }),

    // Get employee by ID
    getMyDetail: builder.query<EmployeeResponse, GetEmployeeArgs>({
      query: ({ id }) => ({
        url: `/employee/${id}`,
        method: "GET",
      }),
      providesTags: ["AdminDashboard", { type: "Employee", id: "LIST" }],
    }),

    //  get managers
    getManagers: builder.query<any, any>({
      query: () => ({
        url: `/employee?role=manager`,
        method: "GET",
      }),
      providesTags: ["AdminDashboard", { type: "Employee", id: "LIST" }, "Employee"],
    }),

    //  add employee from excel
    addEmployeeFromExcel: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", {
          uri: file.uri,
          type:
            file.type ||
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          name: file.name || "data.xlsx",
        } as any);

        return {
          url: "/upload-excel",
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      },
      invalidatesTags: ["AdminDashboard", { type: "Employee", id: "LIST" }, "Employee"],
    }),

    // Create new employee
    createEmployee: builder.mutation<
      CreateEmployeeResponse,
      CreateEmployeeRequest
    >({
      query: (employeeData) => ({
        url: "/employee",
        method: "POST",
        body: employeeData,
      }),
      invalidatesTags: ["AdminDashboard", { type: "Employee", id: "LIST" }, "Employee"],
    }),

    // Update employee
    updateEmployee: builder.mutation<
      CreateEmployeeResponse,
      { id: string; payload: UpdateEmployeeRequest }
    >({
      query: ({ id, payload }) => ({
        url: `/employee/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["AdminDashboard", { type: "Employee", id: "LIST" }],
    }),
  }),
});

// Export hooks with TypeScript types
export const {
  
  useCreateEmployeeMutation,
  useGetEmployeesQuery,
  useGetMyDetailQuery,
  useGetManagersQuery,
  useUpdateEmployeeMutation,
  
  
  
} = employeeApi;