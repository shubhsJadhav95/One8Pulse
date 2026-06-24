// src/components/auth/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Container, Alert, CircularProgress } from '@mui/material';
import { authService } from '../../services/authService';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(formData);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: 'grey.50',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3,
    }}>
      <Box sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '20px',
        p: '48px 44px',
        width: '100%',
        maxWidth: 420,
      }}>

        {/* Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.25, mb: 4.5 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#E24B4A' }} />
          <Typography sx={{ fontSize: 18, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            one8pulse
          </Typography>
        </Box>

        {/* Heading */}
        <Typography sx={{ fontSize: 26, fontWeight: 500, textAlign: 'center', mb: '6px' }}>
          Welcome back
        </Typography>
        <Typography sx={{ fontSize: 14, color: 'text.secondary', textAlign: 'center', lineHeight: 1.6, mb: 4 }}>
          Sign in to track your workouts,<br />view AI recommendations, and stay on pace.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Login Form */}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              py: '14px',
              borderRadius: '12px',
              fontSize: 15,
              fontWeight: 500,
              bgcolor: '#E24B4A',
              '&:hover': { bgcolor: '#C93B3A' },
              '&:disabled': { bgcolor: '#C93B3A' }
            }}
          >
            {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Sign In'}
          </Button>
        </Box>

        {/* Footer */}
        <Typography sx={{ fontSize: 13, color: 'text.disabled', textAlign: 'center', mt: 3 }}>
          Don't have an account?{' '}
          <Box 
            component="span" 
            sx={{ color: '#E24B4A', cursor: 'pointer', fontWeight: 500 }}
            onClick={() => navigate('/register')}
          >
            Get started
          </Box>
        </Typography>

      </Box>
    </Box>
  );
};

export default Login;