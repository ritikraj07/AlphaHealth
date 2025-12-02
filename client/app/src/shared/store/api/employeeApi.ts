import { apiSlice } from './apiSlice';

// Define TypeScript interfaces
export interface Employee {
  _id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  employeeId: string;
  phone?: string;
  joiningDate: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface EmployeesResponse {
  success: boolean;
  employees: Employee[];
  total: number;
  page: number;
  totalPages: number;
}

export interface EmployeeResponse {
  success: boolean;
  employee: Employee;
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

export interface UpdateEmployeeRequest {
  name?: string;
  email?: string;
  department?: string;
  position?: string;
  phone?: string;
  status?: 'active' | 'inactive';
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

export type UpdateEmployeeArgs = {
  id: string;
  data: UpdateEmployeeRequest;
};

export type DeleteEmployeeArgs = {
  id: string;
};

export const employeeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all employees with pagination and search
    getEmployees: builder.query<EmployeesResponse, GetEmployeesArgs>({
/**
 * Builds a query string for retrieving a paginated list of employees
 * with optional filtering and searching.
 * 
 * @param {Object} params - Query parameters
 * @param {number} [params.page=1] - Page number for pagination
 * @param {number} [params.limit=10] - Number of records per page
 * @param {string} [params.search=''] - Search in name and email
 * @param {string} [params.department=''] - Filter by department
 * @param {string} [params.status=''] - Filter by status (active/inactive)
 * 
 * @returns {string} Query string for API request
 */
      query: ({ page = 1, limit = 10, search = '', department = '', status = '' }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (search) params.append('search', search);
        if (department) params.append('department', department);
        if (status) params.append('status', status);

        return `/employee?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.employees.map(({ _id }) => ({ type: 'Employee' as const, id: _id })),
              { type: 'Employee', id: 'LIST' },
            ]
          : [{ type: 'Employee', id: 'LIST' }],
    }),

    // Get single employee by ID
    getEmployee: builder.query<EmployeeResponse, GetEmployeeArgs>({
      query: ({ id }) => `/employee/${id}`,
      providesTags: (result, error, { id }) => [{ type: 'Employee', id }],
    }),

    // Create new employee
    createEmployee: builder.mutation<EmployeeResponse, CreateEmployeeRequest>({
      query: (employeeData) => ({
        url: '/employee',
        method: 'POST',
        body: employeeData,
      }),
      invalidatesTags: [{ type: 'Employee', id: 'LIST' }],
    }),

    // Update employee
    updateEmployee: builder.mutation<EmployeeResponse, UpdateEmployeeArgs>({
      query: ({ id, data }) => ({
        url: `/employee/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Employee', id }],
    }),

    // Delete employee
    deleteEmployee: builder.mutation<{ success: boolean; message: string }, DeleteEmployeeArgs>({
      query: ({ id }) => ({
        url: `/employee/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Employee', id },
        { type: 'Employee', id: 'LIST' },
      ],
    }),

    // Bulk delete employees
    bulkDeleteEmployees: builder.mutation<{ success: boolean; message: string }, { ids: string[] }>({
      query: ({ ids }) => ({
        url: '/employee/bulk-delete',
        method: 'POST',
        body: { ids },
      }),
      invalidatesTags: [{ type: 'Employee', id: 'LIST' }],
    }),
  }),
});

// Export hooks with TypeScript types
export const {
  useGetEmployeesQuery,
  useGetEmployeeQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useBulkDeleteEmployeesMutation,
} = employeeApi;