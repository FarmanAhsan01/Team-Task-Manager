import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  token: localStorage.getItem('accessToken') || null,
};

// Attempt to load user from localStorage safely
try {
  const userData = localStorage.getItem('user');
  const tokenData = localStorage.getItem('accessToken');
  
  if (userData && userData !== 'undefined' && tokenData) {
    initialState.user = JSON.parse(userData);
    initialState.isAuthenticated = true;
    initialState.token = tokenData;
  } else {
    // Clear any partial data
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    initialState.isAuthenticated = false;
    initialState.user = null;
    initialState.token = null;
  }
} catch (e) {
  console.error('Failed to parse user from localStorage');
  localStorage.clear();
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.token = accessToken;
      state.isAuthenticated = true;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    }
  },
});

export const { loginSuccess, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
