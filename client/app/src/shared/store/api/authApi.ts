// store/api/authApi.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiSlice } from './apiSlice';
import { Config } from '@/app/src/config/constants';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (credentials) => {
        console.log('🔐 Admin Login Attempt:', {
          email: credentials.email,
          url: Config.ADMIN_LOGIN_URL,
          fullRequest: `${Config.API_URL}/admin/login`
        });
        
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
            await AsyncStorage.setItem('userToken', data.data.token);
            await AsyncStorage.setItem('userRole', data.data.user.role);
          }
        } catch (error) {
          console.log('❌ Admin Login Error:', error);
        }
      },
      invalidatesTags: ['User'],
    }),

    login: builder.mutation({
      query: (credentials) => {
        console.log('🔐 Employee Login Attempt:', {
          email: credentials.email,
          url: Config.EMPLOYEE_LOGIN_URL,
          fullRequest: `${Config.API_URL}/auth/login`
        });
        
        return {
          url: '/auth/login',
          method: 'POST',
          body: credentials,
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('✅ Employee Login Success:', data);
          if (data.success) {
            await AsyncStorage.setItem('userToken', data.data.token);
            await AsyncStorage.setItem('userRole', data.data.user.role);
          }
        } catch (error) {
          console.log('❌ Employee Login Error:', error);
        }
      },
      invalidatesTags: ['User'],
    }),
    // ... rest of  code
  }),
});

export const { useAdminLoginMutation, useLoginMutation } = authApi;