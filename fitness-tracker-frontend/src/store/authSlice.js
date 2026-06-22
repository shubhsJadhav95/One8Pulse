// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: JSON.parse(localStorage.getItem('user')) || null,  // ✅ Persist user data
        token: localStorage.getItem('token') || null,
        userId: localStorage.getItem('userId') || null
    },
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user;  // ✅ Store user details
            state.token = action.payload.token;
            state.userId = action.payload.user.sub;
            
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));  // ✅ Persist user data
            console.log(action.payload.user.sub);
            localStorage.setItem('userId', action.payload.user.sub);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('user');  // ✅ Clear user data on logout
        }
    }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
