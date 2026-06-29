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
export const forgotPassword = (email) => api.post('/users/send-reset-otp', null, { params: { email } });
export const resetPassword = (otp, email, newPassword) => api.post('/users/reset-password', { otp, email, newPassword });

// Activity endpoints
export const getActivities = () => api.get('/activities');
export const addActivity = (activity) => api.post('/activities', activity);
export const getActivityDetail = (id) => api.get(`/activities/${id}`);

// AI Recommendations endpoints
export const getActivityRecommendation = (activityId) =>
    api.get(`/recommendations/activity/${activityId}`);
export const getUserRecommendations = () => api.get('/recommendations/user');

// SOS Service endpoints
export const addEmergencyContact = (contactData) => api.post('/sos/emergency-contact', contactData);
export const getEmergencyContacts = (userId) => api.get(`/sos/emergency-contact/${userId}`);
export const triggerSOS = (sosData) => api.post('/sos/trigger', sosData);
export const getNearbyHospitals = (lat, lng) => api.get('/sos/nearby-hospitals', { params: { lat, lng } });
export const getSOSAlerts = (userId) => api.get(`/sos/alerts/${userId}`);
export const markSOSAlertsRead = (userId) => api.patch(`/sos/alerts/${userId}/read`);