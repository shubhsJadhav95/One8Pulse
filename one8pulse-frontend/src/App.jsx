import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import Navbar from './components/layout/Navbar';
import SplashScreen from './components/onboarding/SplashScreen';
import Onboarding from './components/onboarding/Onboarding';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import Dashboard from './components/dashboard/Dashboard';
import ActivityForm from './components/activities/ActivityForm';
import ActivityList from './components/activities/ActivityList';
import ActivityDetail from './components/activities/ActivityDetail';
import Profile from './components/profile/Profile';
import SOS from './components/sos/SOS';

// PrivateRoute component
function PrivateRoute({ children }) {
  const token = useSelector(state => state.auth.token);
  return token ? children : <Navigate to="/login" replace />;
}

// PublicRoute component (redirect to dashboard if authenticated)
function PublicRoute({ children }) {
  const token = useSelector(state => state.auth.token);
  return token ? <Navigate to="/dashboard" replace /> : children;
}

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Routes>
          {/* Splash and Onboarding */}
          <Route path="/" element={<SplashScreen />} />
          <Route path="/onboarding" element={<Onboarding />} />
          
          {/* Public auth routes */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
          
          {/* Private routes with navbar */}
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <Box component="main" sx={{ flexGrow: 1 }}>
                  <Routes>
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/activities" element={<PrivateRoute><ActivityList /></PrivateRoute>} />
                    <Route path="/activities/new" element={<PrivateRoute><ActivityForm /></PrivateRoute>} />
                    <Route path="/activities/:id" element={<PrivateRoute><ActivityDetail /></PrivateRoute>} />
                    <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                    <Route path="/sos" element={<PrivateRoute><SOS /></PrivateRoute>} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </Box>
              </>
            }
          />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
