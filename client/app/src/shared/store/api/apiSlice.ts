// store/api/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  prepareHeaders: async (headers) => {
    const token = await AsyncStorage.getItem('userToken');
    
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    headers.set('content-type', 'application/json');
    return headers;
  },
});

// Add logging to see the actual requests
const baseQueryWithLogging = async (args: any, api: any, extraOptions: any) => {
  console.log('🔄 Making API request:', {
    url: args.url,
    method: args.method,
    body: args.body,
    fullUrl: `${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api'}${args.url}`
  });

  const result = await baseQuery(args, api, extraOptions);
  
  console.log('📡 API Response:', {
    url: args.url,
    status: result.meta?.response?.status,
    error: result.error
  });

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithLogging, // Use the logging version
  tagTypes: ['User', 'Employee', 'Leave'],
  endpoints: () => ({}),
});