import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from 'react-oauth2-code-pkce';
import { useDispatch } from 'react-redux';
import { setCredentials } from './store/authSlice';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Box, CssBaseline, Button, CircularProgress } from '@mui/material';
import Navbar from './components/layout/Navbar';
import ActivityForm from './components/activities/ActivityForm';
import ActivityList from './components/activities/ActivityList';
import ActivityDetail from './components/activities/ActivityDetail';

// PrivateRoute that avoids redirecting when OAuth callback is in progress
function PrivateRoute({ children }) {
  const { token } = useContext(AuthContext);
  const location = useLocation();

  // Prevent redirecting if the OAuth callback (code param) is in progress
  if (location.search.includes('code=')) {
    return <CircularProgress />; // Show a loading spinner instead
  }

  return token ? children : <Navigate to="/" replace />;
}

const ActivitiesPage = () => (
  <Box sx={{ p: 3 }}>
    <ActivityForm onActivityAdded={() => window.location.reload()} />
    <ActivityList />
  </Box>
);

function App() {
  const { token, tokenData, login, logOut, isAuthenticated } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);

  // Ensure token is set before rendering UI
  useEffect(() => {
    if (token) {
      console.log("Token available, updating Redux...", token);
      dispatch(setCredentials({ token, user: tokenData }));
      setAuthReady(true);
    } else {
      setAuthReady(true); // Mark auth as ready even if no token
    }
  }, [token, tokenData, dispatch]);

  // Prevent UI from rendering until auth is initialized
  if (!authReady) {
    return <CircularProgress sx={{ display: "block", margin: "auto", mt: 5 }} />;
  }

  return (
    <Router>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />

        {/* Login/Logout Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          {!token ? (
            <Button 
            variant="contained" 
            color="primary" 
            onClick={() => {
              console.log("Login button clicked, calling login()");
              login();
            }}
          >
            Login
          </Button>
          
          ) : (
            <Button variant="contained" color="secondary" onClick={logOut}>
              Logout
            </Button>
          )}
        </Box>

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Routes>
            <Route path="/activities" element={<PrivateRoute><ActivitiesPage /></PrivateRoute>} />
            <Route path="/activities/:id" element={<PrivateRoute><ActivityDetail /></PrivateRoute>} />

            {/* Handle Home Route */}
            <Route 
              path="/" 
              element={token ? <Navigate to="/activities" replace /> : <div>Welcome! Please log in.</div>} 
            />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
