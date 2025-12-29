const API_BASE_URL = 'https://alphahealth.onrender.com/api';


console.log('🔗 API Base URL:', API_BASE_URL);
console.log('🔗 Full Admin Login URL:', `${API_BASE_URL}/admin/login`);
console.log('🔗 Full Employee Login URL:', `${API_BASE_URL}/auth/login`);

export const Config = {
  API_URL: API_BASE_URL,
  ADMIN_LOGIN_URL: `${API_BASE_URL}/admin/login`,
  EMPLOYEE_LOGIN_URL: `${API_BASE_URL}/employee/login`,
  EMPLOYEE_URL: `${API_BASE_URL}/employees`,
};