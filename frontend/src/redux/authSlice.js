import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loading: false,
    user: null,
    authToken: null, // Ensure this is present
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAuthToken: (state, action) => {
      state.authToken = action.payload; // Ensure this action updates authToken
    },
  },
});

export const { setLoading, setUser, setAuthToken } = authSlice.actions;
export default authSlice.reducer;
