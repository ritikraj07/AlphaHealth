import { createSlice } from '@reduxjs/toolkit';

export type UserRole = 'admin' | 'employee' | 'manager' | null;

interface AuthState {
  token: string;
  role: 'admin' | 'employee' | string;
  userId: string ;
  isAuthenticated: boolean;
  name: string;
}

const initialState: AuthState = {
  token: "",
  role: "",
  userId: "",
  isAuthenticated: false,
  name: ""
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, role, _id, name } = action.payload;
      state.userId = _id;
      state.role = role;
      state.token = token;
      state.name = name;
      state.isAuthenticated = true;
      },
    
    clearCredentials: (state) => {
      state.userId = "";
      state.token = "";
      state.isAuthenticated = false;
    },
    
  
    
  },
});

export const {
  setCredentials,
  clearCredentials,

} = authSlice.actions;

export default authSlice.reducer;