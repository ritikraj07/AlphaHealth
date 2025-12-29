import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiSlice } from './apiSlice';
import { Config } from '@/app/src/config/constants';

export const authApi = apiSlice.injectEndpoints({
  /**
   * Endpoints for auth API
   * @property {Mutation<string, import('~/shared/store/api/authApi').AdminLoginArgs>} adminLogin - Admin login endpoint
   * @property {Mutation<string, import('~/shared/store/api/authApi').LoginArgs>} login - Employee login endpoint
   */
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (credentials) => {
        // console.log('Admin Login Attempt:', {
        //   email: credentials.email,
        //   url: Config.ADMIN_LOGIN_URL,
        //   fullRequest: `${Config.API_URL}/admin/login`
        // });
        
        return {
          url: '/admin/login',
          method: 'POST',
          body: credentials,
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('✅ Admin Login Success:', data);
          if (data.success) {
            await AsyncStorage.setItem('userToken', data?.data?.token);
            await AsyncStorage.setItem('userRole', data.data?.role);
          }
        } catch (error) {
          console.log('❌ Admin Login Error:', error);
        }
      },
      
    }),

    login: builder.mutation({
      query: (credentials) => {
        // console.log('🔐 Employee Login Attempt:', {
        //   email: credentials.email,
        //   url: Config.EMPLOYEE_LOGIN_URL,
        //   fullRequest: `${Config.API_URL}/employee/login`
        // });
        
        return {
          url: '/employee/login',
          method: 'POST',
          body: credentials,
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          if (data.success) {
            // ! persist token can to store in local storage here
            console.log('✅ Employee Login Success:', data);
          }
        } catch (error) {
          console.log('❌ Employee Login Error:', error);
        }
      },
      invalidatesTags: [],
    }),
    // ... rest of  code
  }),
});

export const { useAdminLoginMutation, useLoginMutation } = authApi;