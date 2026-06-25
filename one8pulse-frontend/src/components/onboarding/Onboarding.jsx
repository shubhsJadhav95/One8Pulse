// src/components/onboarding/Onboarding.jsx
import React, { useState } from 'react';
import { Box, Typography, Button, IconButton, MobileStepper, Paper } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const onboardingData = [
  {
    title: 'Track Your Progress',
    description: 'Monitor your workouts, calories, and achievements with our advanced tracking system',
    icon: '📊',
    gradient: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
  },
  {
    title: 'Personalized Plans',
    description: 'Get customized workout and nutrition plans tailored to your fitness goals',
    icon: '🎯',
    gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
  },
  {
    title: 'Stay Motivated',
    description: 'Join challenges, earn badges, and connect with a community of fitness enthusiasts',
    icon: '🔥',
    gradient: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
  },
  {
    title: 'AI-Powered Insights',
    description: 'Get intelligent recommendations and analysis powered by advanced AI technology',
    icon: '🤖',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
  },
];

const Onboarding = () => {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const maxSteps = onboardingData.length;

  const handleNext = () => {
    if (activeStep === maxSteps - 1) {
      localStorage.setItem('hasOnboarded', 'true');
      navigate('/register');
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    localStorage.setItem('hasOnboarded', 'true');
    navigate('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: (theme) => theme.palette.background.default,
      }}
    >
      {/* Skip button */}
      <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 1 }}>
        <Button
          onClick={handleSkip}
          sx={{
            color: 'text.secondary',
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Skip
        </Button>
      </Box>

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            style={{ textAlign: 'center', maxWidth: 600, width: '100%' }}
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              style={{ marginBottom: 40 }}
            >
              <Box
                sx={{
                  width: 180,
                  height: 180,
                  borderRadius: '40%',
                  background: onboardingData[activeStep].gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                }}
              >
                <Typography sx={{ fontSize: '5rem' }}>
                  {onboardingData[activeStep].icon}
                </Typography>
              </Box>
            </motion.div>

            {/* Title */}
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                background: onboardingData[activeStep].gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {onboardingData[activeStep].title}
            </Typography>

            {/* Description */}
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontSize: '1.125rem',
                lineHeight: 1.6,
                mb: 4,
              }}
            >
              {onboardingData[activeStep].description}
            </Typography>
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* Navigation */}
      <Box sx={{ p: 3 }}>
        <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          sx={{
            background: 'transparent',
            maxWidth: 400,
            mx: 'auto',
            mb: 2,
            '& .MuiMobileStepper-dots': {
              justifyContent: 'center',
            },
            '& .MuiMobileStepper-dot': {
              width: 10,
              height: 10,
              borderRadius: 5,
              bgcolor: 'divider',
            },
            '& .MuiMobileStepper-dotActive': {
              width: 30,
              bgcolor: 'primary.main',
            },
          }}
          nextButton={
            <Button
              size="large"
              onClick={handleNext}
              variant="contained"
              sx={{
                borderRadius: 12,
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                background: onboardingData[activeStep].gradient,
              }}
            >
              {activeStep === maxSteps - 1 ? 'Get Started' : 'Next'}
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button
              size="large"
              onClick={handleBack}
              disabled={activeStep === 0}
              sx={{
                borderRadius: 12,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              <KeyboardArrowLeft />
              Back
            </Button>
          }
        />
      </Box>
    </Box>
  );
};

export default Onboarding;
