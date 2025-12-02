import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    name: null,
    role: null,
    email: null,
    token: null,
    _id: null
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      state.name = action.payload.name;
      state.role = action.payload.role;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state._id = action?.payload?._id
    }
  },
});

export const {
 setAdmin
} = adminSlice.actions;

export default adminSlice.reducer;