import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from './api/apiSlice';

// Import your slices
import authReducer from './slices/authSlice';
import adminSlice from './slices/adminSlice';
// import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminSlice,
    // user: userReducer,
    // Add the generated reducer as a specific top-level slice
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling, etc.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(apiSlice.middleware),
});

// Optional: Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export default store;