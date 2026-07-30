export const API_BASE_URL = "https://pharmaprime-195233003337.asia-south1.run.app/api";
// http://ipconfig ipv4 :3000/api
//https://alphahealth.onrender.com/api
//https://pharmaprime-195233003337.asia-south1.run.app/api

console.log('🔗 API Base URL:', API_BASE_URL);
console.log('🔗 Full Admin Login URL:', `${API_BASE_URL}/admin/login`);
console.log('🔗 Full Employee Login URL:', `${API_BASE_URL}/auth/login`);

export const Config = {
  API_URL: API_BASE_URL,
  ADMIN_LOGIN_URL: `${API_BASE_URL}/admin/login`,
  EMPLOYEE_LOGIN_URL: `${API_BASE_URL}/employee/login`,
  EMPLOYEE_URL: `${API_BASE_URL}/employees`,
};