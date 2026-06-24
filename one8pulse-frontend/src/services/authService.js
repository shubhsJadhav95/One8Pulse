// src/services/authService.js
import { login, register, getUserProfile } from './api';

export const authService = {
  async login(credentials) {
    const response = await login(credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      
      // Decode JWT to get user info
      const tokenData = this.decodeToken(response.data.token);
      if (tokenData.userId) {
        localStorage.setItem('userId', tokenData.userId);
        localStorage.setItem('user', JSON.stringify({
          email: tokenData.email,
          userId: tokenData.userId
        }));
      }
      
      return response.data;
    }
    throw new Error('Login failed');
  },

  async register(userData) {
    const response = await register(userData);
    return response.data;
  },

  async getProfile() {
    const response = await getUserProfile();
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  decodeToken(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
};
