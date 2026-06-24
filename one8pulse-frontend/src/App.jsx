import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import ActivityForm from './components/activities/ActivityForm';
import ActivityList from './components/activities/ActivityList';
import ActivityDetail from './components/activities/ActivityDetail';
import Profile from './components/profile/Profile';

// PrivateRoute component
function PrivateRoute({ children }) {
  const token = useSelector(state => state.auth.token);
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Private routes */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/activities" element={<PrivateRoute><ActivityList /></PrivateRoute>} />
            <Route path="/activities/new" element={<PrivateRoute><ActivityForm /></PrivateRoute>} />
            <Route path="/activities/:id" element={<PrivateRoute><ActivityDetail /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
