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
  manager: string;
  leavesTaken: leavesTaken;
  managerModel: string;
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
  employees: Employee[];
  total: number;
  page: number;
  totalPages: number;
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
  role: 'employee' | 'manager';
  hq: string;
  manager: string;
  managerModel: string
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




export const employeeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all employees with pagination and search
    getEmployees: builder.query<EmployeesResponse, GetEmployeesArgs>({
      query: ({ page = 1, limit = 10, search = '', department = '', status = '' }) => ({
        url: `/employees?page=${page}&limit=${limit}&search=${search}&department=${department}&status=${status}`,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.employees.map(({ _id }) => ({ type: 'Employee' as const, id: _id })),
              { type: 'Employee', id: 'LIST' },
            ]
          : [{ type: 'Employee', id: 'LIST' }],
    }),

    // Get employee by ID
   getMyDetail: builder.query<EmployeeResponse, GetEmployeeArgs>({
     query: ({ id }) => ({
       url: `/employee/${id}`,
       method: 'GET',
      }),
    }),


    

    // Create new employee
    createEmployee: builder.mutation<CreateEmployeeResponse, CreateEmployeeRequest>({
      query: (employeeData) => ({
        url: '/employee',
        method: 'POST',
        body: employeeData,
      }),
      invalidatesTags: ['AdminDashboard',{ type: 'Employee', id: 'LIST' },],
    }),

   

   

    
 
  }),
});

// Export hooks with TypeScript types
export const {
  
  useCreateEmployeeMutation,
  useGetEmployeesQuery,
  useGetMyDetailQuery
  
  
} = employeeApi;