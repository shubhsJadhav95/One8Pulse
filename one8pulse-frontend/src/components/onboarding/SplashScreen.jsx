// src/components/onboarding/SplashScreen.jsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SplashScreen = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      const hasOnboarded = localStorage.getItem('hasOnboarded');
      const token = localStorage.getItem('token');
      
      if (token) {
        navigate('/dashboard');
      } else if (hasOnboarded) {
        navigate('/login');
      } else {
        navigate('/onboarding');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2563EB 0%, #10B981 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.1 }}
        transition={{ duration: 1.5 }}
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'white',
          top: '-100px',
          right: '-100px',
        }}
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'white',
          bottom: '-100px',
          left: '-100px',
        }}
      />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', zIndex: 1 }}
      >
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: '30%',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: '3rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #2563EB 0%, #10B981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            8
          </Typography>
        </Box>
        <Typography
          variant="h4"
          sx={{
            color: 'white',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            mb: 2,
          }}
        >
          one8pulse
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255,255,255,0.8)',
            fontWeight: 500,
          }}
        >
          Elevate Your Fitness
        </Typography>
      </motion.div>

      {/* Loading indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ marginTop: 40, zIndex: 1 }}
      >
        <CircularProgress
          size={40}
          sx={{
            color: 'white',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
      </motion.div>
    </Box>
  );
};

export default SplashScreen;
