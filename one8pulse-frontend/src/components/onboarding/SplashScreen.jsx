// src/components/onboarding/SplashScreen.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';

// ── Floating orb with glow
const GlowOrb = ({ x, y, size, color, delay, duration, blur = 60 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.6 }}
    animate={{ opacity: [0, 0.5, 0.3, 0.5, 0], scale: [0.6, 1, 1.1, 0.95, 0.6] }}
    transition={{ delay, duration, repeat: Infinity, ease: 'easeInOut' }}
    style={{
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      borderRadius: '50%',
      background: color,
      filter: `blur(${blur}px)`,
      pointerEvents: 'none',
      transform: 'translate(-50%, -50%)',
    }}
  />
);

// ── Small sparkle particle
const Sparkle = ({ x, y, size, delay, duration, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 0, scale: 0 }}
    animate={{ opacity: [0, 1, 0], y: [-20, -80], scale: [0, 1, 0] }}
    transition={{ delay, duration, repeat: Infinity, ease: 'easeOut' }}
    style={{
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      borderRadius: '50%',
      background: color,
      boxShadow: `0 0 ${size * 2}px ${color}`,
      pointerEvents: 'none',
    }}
  />
);

// ── Expanding pulse ring
const PulseRing = ({ delay, baseSize, color }) => (
  <motion.div
    initial={{ scale: 0.5, opacity: 0.8 }}
    animate={{ scale: 2.2, opacity: 0 }}
    transition={{ delay, duration: 3, repeat: Infinity, ease: 'easeOut' }}
    style={{
      position: 'absolute',
      width: baseSize,
      height: baseSize,
      borderRadius: '50%',
      border: `1.5px solid ${color}`,
      pointerEvents: 'none',
    }}
  />
);

// ── Rotating dashes orbit
const OrbitRing = ({ size, duration, reverse }) => (
  <motion.div
    animate={{ rotate: reverse ? -360 : 360 }}
    transition={{ duration, repeat: Infinity, ease: 'linear' }}
    style={{
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: '50%',
      border: '1px dashed rgba(255,255,255,0.12)',
      pointerEvents: 'none',
    }}
  />
);

// ── Morphing gradient blob
const MorphBlob = ({ style, colors, duration, delay }) => (
  <motion.div
    animate={{
      borderRadius: [
        '60% 40% 30% 70% / 60% 30% 70% 40%',
        '30% 60% 70% 40% / 50% 60% 30% 60%',
        '60% 40% 30% 70% / 60% 30% 70% 40%',
      ],
      rotate: [0, 120, 240, 360],
    }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    style={{
      position: 'absolute',
      background: `radial-gradient(ellipse, ${colors[0]} 0%, ${colors[1]} 50%, transparent 70%)`,
      filter: 'blur(40px)',
      pointerEvents: 'none',
      ...style,
    }}
  />
);

// ── Animated progress bar
const ProgressBar = () => (
  <Box sx={{ width: 180, mt: 5.5, position: 'relative' }}>
    {/* Track */}
    <Box sx={{
      width: '100%', height: 2, borderRadius: 4,
      background: 'rgba(255,255,255,0.08)',
      overflow: 'hidden', position: 'relative',
    }}>
      {/* Shimmer layer */}
      <motion.div
        animate={{ x: ['-100%', '300%'] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '40%', height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
          zIndex: 2,
        }}
      />
      {/* Fill */}
      <motion.div
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: 2.0, ease: [0.22, 0, 0.4, 1], delay: 0.4 }}
        style={{
          height: '100%',
          background: 'linear-gradient(90deg, #3B82F6, #34D399, #60A5FA)',
          borderRadius: 4,
          position: 'relative',
        }}
      />
    </Box>
    {/* Percentage label */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}
    >
      <Typography sx={{ fontSize: 9, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.25)', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase' }}>
        Initializing
      </Typography>
      <CountUp />
    </motion.div>
  </Box>
);

// ── Counting percentage
const CountUp = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let frame;
    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / 2200, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * 100));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    const delay = setTimeout(() => { frame = requestAnimationFrame(animate); }, 400);
    return () => { clearTimeout(delay); cancelAnimationFrame(frame); };
  }, []);
  return (
    <Typography sx={{ fontSize: 9, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace" }}>
      {count}%
    </Typography>
  );
};

// ── Tilt card that follows mouse
const TiltCard = ({ children }) => {
  const ref = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - left - width / 2) / width);
    mouseY.set((e.clientY - top - height / 2) / height);
  };
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 800 }}
    >
      {children}
    </motion.div>
  );
};

const SPARKLES = [
  { x: 10, y: 72, size: 4, delay: 0,   duration: 3.8, color: '#60A5FA' },
  { x: 22, y: 58, size: 3, delay: 0.9, duration: 3.2, color: '#34D399' },
  { x: 38, y: 82, size: 5, delay: 1.4, duration: 4.5, color: '#A78BFA' },
  { x: 55, y: 68, size: 3, delay: 0.5, duration: 3.6, color: '#60A5FA' },
  { x: 72, y: 78, size: 4, delay: 1.8, duration: 4.0, color: '#34D399' },
  { x: 86, y: 62, size: 3, delay: 0.3, duration: 3.4, color: '#F472B6' },
  { x: 48, y: 88, size: 2, delay: 2.2, duration: 3.0, color: '#FCD34D' },
  { x: 15, y: 40, size: 3, delay: 1.1, duration: 4.2, color: '#34D399' },
  { x: 90, y: 45, size: 4, delay: 0.7, duration: 3.7, color: '#60A5FA' },
];

const SplashScreen = () => {
  const navigate = useNavigate();
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        const token = localStorage.getItem('token');
        const hasOnboarded = localStorage.getItem('hasOnboarded');
        if (token) navigate('/dashboard');
        else if (hasOnboarded) navigate('/login');
        else navigate('/onboarding');
      }, 700);
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06, filter: 'blur(8px)' }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          style={{ position: 'fixed', inset: 0, zIndex: 9999 }}
        >
          <Box sx={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(160deg, #060b14 0%, #0d1a2e 40%, #0a1628 70%, #060b14 100%)',
            position: 'relative', overflow: 'hidden',
          }}>

            {/* ── Morphing blobs */}
            <MorphBlob
              style={{ width: 600, height: 600, top: -200, right: -200 }}
              colors={['rgba(59,130,246,0.18)', 'rgba(99,102,241,0.08)']}
              duration={12} delay={0}
            />
            <MorphBlob
              style={{ width: 500, height: 500, bottom: -180, left: -180 }}
              colors={['rgba(16,185,129,0.15)', 'rgba(52,211,153,0.05)']}
              duration={15} delay={2}
            />
            <MorphBlob
              style={{ width: 300, height: 300, top: '30%', left: '10%' }}
              colors={['rgba(167,139,250,0.12)', 'transparent']}
              duration={10} delay={1}
            />

            {/* ── Glow orbs */}
            <GlowOrb x={75} y={20} size={280} color="radial-gradient(circle, rgba(59,130,246,0.35) 0%, transparent 70%)" delay={0.5} duration={8} blur={40} />
            <GlowOrb x={25} y={80} size={220} color="radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)" delay={1} duration={10} blur={40} />
            <GlowOrb x={50} y={50} size={140} color="radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%)" delay={0} duration={6} blur={30} />

            {/* ── Sparkles */}
            {SPARKLES.map((s, i) => <Sparkle key={i} {...s} />)}

            {/* ── Logo area */}
            <motion.div
              initial={{ opacity: 0, y: 36, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}
            >
              <TiltCard>
                {/* Icon stack */}
                <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4, width: 220, height: 220, mx: 'auto' }}>
                  {/* Pulse rings */}
                  <PulseRing delay={0}   baseSize={120} color="rgba(59,130,246,0.5)" />
                  <PulseRing delay={1.0} baseSize={120} color="rgba(52,211,153,0.4)" />
                  <PulseRing delay={2.0} baseSize={120} color="rgba(167,139,250,0.3)" />

                  {/* Orbit rings */}
                  <OrbitRing size={180} duration={20} reverse={false} />
                  <OrbitRing size={155} duration={16} reverse={true} />

                  {/* Logo card */}
                  <motion.div
                    initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    style={{ position: 'relative', zIndex: 2 }}
                  >
                    <motion.div
                      animate={{
                        boxShadow: [
                          '0 0 0px rgba(59,130,246,0), 0 0 0px rgba(52,211,153,0)',
                          '0 0 50px rgba(59,130,246,0.5), 0 0 80px rgba(52,211,153,0.25)',
                          '0 0 0px rgba(59,130,246,0), 0 0 0px rgba(52,211,153,0)',
                        ],
                        borderColor: [
                          'rgba(255,255,255,0.1)',
                          'rgba(96,165,250,0.4)',
                          'rgba(255,255,255,0.1)',
                        ],
                      }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                      style={{
                        width: 108, height: 108, borderRadius: 28,
                        background: 'linear-gradient(145deg, rgba(30,42,68,0.9) 0%, rgba(15,23,42,0.95) 100%)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backdropFilter: 'blur(12px)',
                        position: 'relative', overflow: 'hidden',
                      }}
                    >
                      {/* Inner shimmer sweep */}
                      <motion.div
                        animate={{ x: ['-200%', '300%'], opacity: [0, 1, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                        style={{
                          position: 'absolute', top: 0, left: 0, width: '50%', height: '100%',
                          background: 'linear-gradient(105deg, transparent, rgba(255,255,255,0.06), transparent)',
                          transform: 'skewX(-20deg)',
                        }}
                      />
                      <Typography sx={{
                        fontSize: '3rem', fontWeight: 900, lineHeight: 1,
                        letterSpacing: '-3px',
                        background: 'linear-gradient(135deg, #60A5FA 0%, #34D399 60%, #A78BFA 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        position: 'relative', zIndex: 1,
                        filter: 'drop-shadow(0 0 20px rgba(96,165,250,0.4))',
                      }}>
                        8
                      </Typography>
                    </motion.div>
                  </motion.div>
                </Box>
              </TiltCard>

              {/* Wordmark */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                style={{ textAlign: 'center' }}
              >
                {/* Letter-by-letter stagger */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: '1px', mb: 0.75 }}>
                  {'one8pulse'.split('').map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ delay: 0.5 + i * 0.06, duration: 0.5, ease: 'easeOut' }}
                      style={{
                        fontSize: '1.65rem', fontWeight: 800,
                        color: char === '8' ? 'transparent' : 'rgba(255,255,255,0.92)',
                        background: char === '8' ? 'linear-gradient(135deg, #60A5FA, #34D399)' : 'none',
                        WebkitBackgroundClip: char === '8' ? 'text' : 'unset',
                        WebkitTextFillColor: char === '8' ? 'transparent' : 'rgba(255,255,255,0.92)',
                        textTransform: 'uppercase', letterSpacing: '0.1em',
                        display: 'inline-block',
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </Box>

                {/* Tagline with typewriter fade */}
                <motion.div
                  initial={{ opacity: 0, letterSpacing: '0.5em' }}
                  animate={{ opacity: 1, letterSpacing: '0.22em' }}
                  transition={{ delay: 1.0, duration: 1.0, ease: 'easeOut' }}
                >
                  <Typography sx={{
                    color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem',
                    letterSpacing: '0.22em', textTransform: 'uppercase',
                    fontWeight: 500, fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    Elevate your fitness
                  </Typography>
                </motion.div>
              </motion.div>

              {/* Progress bar */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <ProgressBar />
              </motion.div>
            </motion.div>

            {/* ── Grid overlay (subtle) */}
            <Box sx={{
              position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.025,
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }} />

            {/* ── Corner accent lines */}
            {[
              { top: 24, left: 24, borderTop: '1px solid', borderLeft: '1px solid' },
              { top: 24, right: 24, borderTop: '1px solid', borderRight: '1px solid' },
              { bottom: 24, left: 24, borderBottom: '1px solid', borderLeft: '1px solid' },
              { bottom: 24, right: 24, borderBottom: '1px solid', borderRight: '1px solid' },
            ].map((pos, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                style={{
                  position: 'absolute', width: 28, height: 28,
                  borderColor: 'rgba(255,255,255,0.12)',
                  ...pos,
                }}
              />
            ))}

            {/* ── Bottom version + status */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              style={{ position: 'absolute', bottom: 28, zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
            >
              {/* Live dot */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <motion.div
                  animate={{ opacity: [1, 0.2, 1], scale: [1, 0.7, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  style={{ width: 5, height: 5, borderRadius: '50%', background: '#34D399' }}
                />
                <Typography sx={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', fontFamily: "'JetBrains Mono', monospace" }}>
                  Systems online
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.12)', fontFamily: "'JetBrains Mono', monospace" }}>
                v1.0.0
              </Typography>
            </motion.div>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;