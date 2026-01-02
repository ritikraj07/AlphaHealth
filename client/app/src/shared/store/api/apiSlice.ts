import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseQuery = fetchBaseQuery({
  baseUrl: "https://alphahealth.onrender.com/api",
/**
 * Prepare headers for API requests.
 * If a valid user token is stored, it will be added as a Bearer token.
 * Content type is set to 'application/json' by default.
 * @param {Headers} headers - Headers object passed from the API.
 * @returns {Promise<Headers>} - Prepared headers object with optional authorization and content type set.
 */
  prepareHeaders: async (headers) => {
    
    const token = await AsyncStorage.getItem('token');
    // console.log('token from api slice', token);
    
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    headers.set('content-type', 'application/json');
    return headers;
  },
});

// Add logging to see the actual requests
const baseQueryWithLogging = async (args: any, api: any, extraOptions: any) => {
  const request = typeof args === "string" ? { url: args } : args;
  // console.log("🔄 Making API request:", request);
  const result = await baseQuery(args, api, extraOptions);
  // console.log("📡 API Response:", result);

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithLogging, // Use the logging version
  tagTypes: ['DoctorChemist','Employee', 'Leave', 'Dashboard', 'HQ', 'AdminDashboard'],
  endpoints: () => ({}),
});