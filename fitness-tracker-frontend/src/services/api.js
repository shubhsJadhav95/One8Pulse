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

    // Get user (tokenData) from localStorage and parse it
    const user = localStorage.getItem('user');
    if (user) {
        try {
            const userObj = JSON.parse(user);
            if (userObj.sub) {
                // Attach the "sub" value as a custom header, e.g., "X-User-Sub"
                config.headers['X-User-ID'] = userObj.sub;
            }
        } catch (error) {
            console.error("Error parsing user from localStorage:", error);
        }
    }
    return config;
});

export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const getActivities = () => api.get('/activities');
export const addActivity = (activity) => api.post('/activities', activity);
export const getActivityDetail = (id) => api.get(`/recommendations/activity/${id}`);
// export const getActivityDetail = (id) => api.get(`/activities/${id}`);
