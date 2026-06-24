// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // Your API Gateway URL

const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Get userId from localStorage
    const userId = localStorage.getItem('userId');
    if (userId) {
        config.headers['X-User-ID'] = userId;
    }
    return config;
});

// Auth endpoints
export const login = (credentials) => api.post('/users/login', credentials);
export const register = (userData) => api.post('/users/register', userData);
export const getUserProfile = () => api.get('/users/profile');

// Activity endpoints
export const getActivities = () => api.get('/activities');
export const addActivity = (activity) => api.post('/activities', activity);
export const getActivityDetail = (id) => api.get(`/activities/${id}`);

// AI Recommendations endpoints
export const getActivityRecommendation = (activityId) =>
    api.get(`/recommendations/activity/${activityId}`);
export const getUserRecommendations = () => api.get('/recommendations/user');