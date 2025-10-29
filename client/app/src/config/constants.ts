
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.API_URL || 
                     process.env.EXPO_PUBLIC_API_URL || 
                     'http://localhost:3000/api';

console.log('🔗 API Base URL:', API_BASE_URL);
console.log('🔗 Full Admin Login URL:', `${API_BASE_URL}/admin/login`);
console.log('🔗 Full Employee Login URL:', `${API_BASE_URL}/auth/login`);

export const Config = {
  API_URL: API_BASE_URL,
  ADMIN_LOGIN_URL: `${API_BASE_URL}/admin/login`,
  EMPLOYEE_LOGIN_URL: `${API_BASE_URL}/auth/login`,
};