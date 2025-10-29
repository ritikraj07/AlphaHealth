import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  isLoggedIn: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.name = '';
      state.email = '';
      state.isLoggedIn = false;
    },
    updateProfile: (state, action) => {
      state.name = action.payload.name || state.name;
      state.email = action.payload.email || state.email;
    },
  },
});

export const { login, logout, updateProfile } = userSlice.actions;

export const selectUser = (state:any) => state.user;
export const selectIsLoggedIn = (state:any) => state.user.isLoggedIn;

export default userSlice.reducer;