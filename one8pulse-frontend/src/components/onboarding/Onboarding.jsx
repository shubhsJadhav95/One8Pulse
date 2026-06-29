// src/components/onboarding/Onboarding.jsx
import React, { useState, useCallback } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { ArrowForward, ArrowBack, Check } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ── Per-step data ────────────────────────────────────────────────────────────
const STEPS = [
  {
    eyebrow: 'Activity tracking',
    title: 'Every rep, every step,\nalways counted',
    description:
      'Log workouts, track calories, and watch your progress compound — all in one place built around how you actually train.',
    icon: '📊',
    accent: '#3B82F6',
    accentDim: 'rgba(59,130,246,0.12)',
    accentGlow: 'rgba(59,130,246,0.25)',
    pills: ['🔥 Calories', '🏃 Workouts', '🏆 Milestones'],
  },
  {
    eyebrow: 'Personalized plans',
    title: 'A plan that fits your\nlife, not the other way',
    description:
      'Set a goal and get a structured plan tailored to your schedule, fitness level, and how you prefer to train.',
    icon: '🎯',
    accent: '#10B981',
    accentDim: 'rgba(16,185,129,0.12)',
    accentGlow: 'rgba(16,185,129,0.25)',
    pills: ['💪 Strength', '❤️ Cardio', '🥗 Nutrition'],
  },
  {
    eyebrow: 'Community & streaks',
    title: 'Consistency beats\nmotivation every time',
    description:
      'Streaks, challenges, and a community of people who show up — even on the days it\'s hard. You won\'t be alone.',
    icon: '🔥',
    accent: '#F97316',
    accentDim: 'rgba(249,115,22,0.12)',
    accentGlow: 'rgba(249,115,22,0.25)',
    pills: ['📅 Streaks', '👥 Challenges', '🥇 Badges'],
  },
  {
    eyebrow: 'AI coaching',
    title: 'A coach that reads\nbetween the reps',
    description:
      'Powered by Gemini AI, one8pulse analyzes your patterns and surfaces insights you wouldn\'t catch yourself — before plateaus happen.',
    icon: '🤖',
    accent: '#8B5CF6',
    accentDim: 'rgba(139,92,246,0.12)',
    accentGlow: 'rgba(139,92,246,0.25)',
    pills: ['🧠 Smart insights', '📈 Plateau alerts', '⚙️ Auto-adjusts'],
  },
];

// ── Slide transition variants ─────────────────────────────────────────────────
const slideVariants = {
  enter: (dir) => ({
    x: dir > 0 ? 48 : -48,
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (dir) => ({
    x: dir > 0 ? -48 : 48,
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.28, ease: [0.4, 0, 1, 1] },
  }),
};

// ── Icon container with float + glow ─────────────────────────────────────────
const IconBadge = ({ icon, accent, accentDim, accentGlow }) => (
  <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
    {/* Outer glow ring */}
    <motion.div
      animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0, 0.4] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'absolute',
        width: 156,
        height: 156,
        borderRadius: '36px',
        border: `1.5px solid ${accentGlow}`,
        pointerEvents: 'none',
      }}
    />
    {/* Inner ring */}
    <motion.div
      animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0, 0.3] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
      style={{
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: '34px',
        border: `1px solid ${accentGlow}`,
        pointerEvents: 'none',
      }}
    />
    {/* Icon card */}
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        width: 120,
        height: 120,
        borderRadius: 32,
        background: accentDim,
        border: `1px solid ${accentGlow}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Typography sx={{ fontSize: '3.2rem', lineHeight: 1 }}>{icon}</Typography>
    </motion.div>
  </Box>
);

// ── Feature pill ──────────────────────────────────────────────────────────────
const Pill = ({ label, accent, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.35 }}
  >
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.6,
        px: 1.5,
        py: 0.6,
        borderRadius: '20px',
        border: '1px solid',
        borderColor: 'rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.04)',
        fontSize: '0.75rem',
        color: 'rgba(255,255,255,0.65)',
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </Box>
  </motion.div>
);

// ── Animated progress dot ─────────────────────────────────────────────────────
const Dot = ({ active, accent, onClick }) => (
  <motion.div
    onClick={onClick}
    animate={{
      width: active ? 28 : 8,
      background: active ? accent : 'rgba(255,255,255,0.2)',
    }}
    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    style={{
      height: 4,
      borderRadius: 2,
      cursor: 'pointer',
      flexShrink: 0,
    }}
  />
);

// ── Main component ────────────────────────────────────────────────────────────
const Onboarding = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const step = STEPS[activeStep];
  const isLast = activeStep === STEPS.length - 1;

  const goTo = useCallback((idx) => {
    if (idx === activeStep) return;
    setDirection(idx > activeStep ? 1 : -1);
    setActiveStep(idx);
  }, [activeStep]);

  const handleNext = () => {
    if (isLast) {
      localStorage.setItem('hasOnboarded', 'true');
      navigate('/register');
    } else {
      goTo(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) goTo(activeStep - 1);
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
        background: 'linear-gradient(160deg, #0b1120 0%, #0f1f38 60%, #0b1120 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ── Ambient background orbs ── */}
      <motion.div
        animate={{ background: step.accentGlow }}
        transition={{ duration: 0.8 }}
        style={{
          position: 'absolute',
          width: 480,
          height: 480,
          borderRadius: '50%',
          top: -200,
          right: -160,
          filter: 'blur(80px)',
          opacity: 0.35,
          pointerEvents: 'none',
          background: step.accentGlow,
        }}
      />
      <motion.div
        animate={{ background: step.accentDim }}
        transition={{ duration: 0.8 }}
        style={{
          position: 'absolute',
          width: 360,
          height: 360,
          borderRadius: '50%',
          bottom: -120,
          left: -120,
          filter: 'blur(70px)',
          opacity: 0.5,
          pointerEvents: 'none',
          background: step.accentDim,
        }}
      />

      {/* ── Header ── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          pt: 3,
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <motion.div
            animate={{ background: step.accent }}
            transition={{ duration: 0.6 }}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: step.accent,
            }}
          />
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 600,
              fontSize: '0.9rem',
              letterSpacing: '0.05em',
            }}
          >
            one8pulse
          </Typography>
        </Box>

        <Button
          onClick={handleSkip}
          sx={{
            color: 'rgba(255,255,255,0.35)',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.82rem',
            letterSpacing: '0.02em',
            '&:hover': { color: 'rgba(255,255,255,0.65)', background: 'rgba(255,255,255,0.05)' },
            borderRadius: 2,
            px: 1.5,
          }}
        >
          Skip for now
        </Button>
      </Box>

      {/* ── Slide content ── */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 3,
          position: 'relative',
          zIndex: 2,
          overflow: 'hidden',
        }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              maxWidth: 420,
              width: '100%',
            }}
          >
            {/* Icon */}
            <IconBadge
              icon={step.icon}
              accent={step.accent}
              accentDim={step.accentDim}
              accentGlow={step.accentGlow}
            />

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: step.accent,
                  mb: 1.2,
                  opacity: 0.9,
                }}
              >
                {step.eyebrow}
              </Typography>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.95)',
                  fontWeight: 700,
                  fontSize: { xs: '1.55rem', sm: '1.75rem' },
                  lineHeight: 1.25,
                  letterSpacing: '-0.03em',
                  mb: 2,
                  whiteSpace: 'pre-line',
                }}
              >
                {step.title}
              </Typography>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.22 }}
            >
              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.45)',
                  fontSize: '0.92rem',
                  lineHeight: 1.7,
                  mb: 3,
                  maxWidth: 360,
                }}
              >
                {step.description}
              </Typography>
            </motion.div>

            {/* Feature pills */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
              {step.pills.map((pill, i) => (
                <Pill
                  key={pill}
                  label={pill}
                  accent={step.accent}
                  delay={0.28 + i * 0.07}
                />
              ))}
            </Box>
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* ── Footer ── */}
      <Box sx={{ px: 3, pb: 4, position: 'relative', zIndex: 2 }}>
        {/* Step counter + dots */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2.5,
            maxWidth: 420,
            mx: 'auto',
          }}
        >
          <Typography
            sx={{
              fontSize: '0.72rem',
              color: 'rgba(255,255,255,0.25)',
              letterSpacing: '0.05em',
            }}
          >
            {activeStep + 1} / {STEPS.length}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
            {STEPS.map((_, i) => (
              <Dot
                key={i}
                active={i === activeStep}
                accent={step.accent}
                onClick={() => goTo(i)}
              />
            ))}
          </Box>
        </Box>

        {/* Action row */}
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            alignItems: 'center',
            maxWidth: 420,
            mx: 'auto',
          }}
        >
          {/* Back button */}
          <IconButton
            onClick={handleBack}
            disabled={activeStep === 0}
            sx={{
              width: 48,
              height: 48,
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '50%',
              color: 'rgba(255,255,255,0.5)',
              flexShrink: 0,
              transition: 'all 0.2s',
              '&:hover:not(:disabled)': {
                borderColor: 'rgba(255,255,255,0.25)',
                color: 'rgba(255,255,255,0.85)',
                background: 'rgba(255,255,255,0.06)',
              },
              '&:disabled': { opacity: 0.2 },
            }}
          >
            <ArrowBack sx={{ fontSize: 18 }} />
          </IconButton>

          {/* Next / Get started button */}
          <motion.div
            style={{ flex: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button
              onClick={handleNext}
              fullWidth
              endIcon={
                isLast ? (
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Check sx={{ fontSize: 13 }} />
                  </Box>
                ) : (
                  <ArrowForward sx={{ fontSize: 18 }} />
                )
              }
              sx={{
                height: 48,
                borderRadius: '24px',
                background: step.accent,
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.95rem',
                textTransform: 'none',
                letterSpacing: '0.01em',
                transition: 'background 0.5s ease, filter 0.2s',
                boxShadow: `0 4px 20px ${step.accentGlow}`,
                '&:hover': {
                  background: step.accent,
                  filter: 'brightness(1.12)',
                  boxShadow: `0 6px 28px ${step.accentGlow}`,
                },
                '& .MuiButton-endIcon': {
                  ml: 0.5,
                  transition: 'transform 0.2s',
                },
                '&:hover .MuiButton-endIcon': {
                  transform: isLast ? 'none' : 'translateX(3px)',
                },
              }}
            >
              {isLast ? 'Create account' : 'Next'}
            </Button>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};

export default Onboarding;