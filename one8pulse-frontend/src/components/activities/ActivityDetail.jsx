// src/components/activities/ActivityDetail.jsx
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import {
  FitnessCenter, Whatshot, Schedule, CalendarToday,
  Psychology, TrendingUp, Lightbulb, Shield,
  ErrorOutline, Circle,
} from '@mui/icons-material';
import { getActivityDetail, getActivityRecommendation } from '../../services/api';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const COLORS = {
  bgBase: '#0e1117',
  bgSurface: '#161b24',
  bgSurfaceHover: '#1c2230',
  line: '#242b38',
  lineStrong: '#2e3748',
  accent: '#ff4b2b',
  lime: '#b8ff3d',
  textPrimary: '#eef0ed',
  textSecondary: '#8c93a0',
  textTertiary: '#4e5563',
  errorText: '#ff6b6b',
};

const LANE_COLORS = {
  RUNNING:         '#ff5a4d',
  WALKING:         '#6ccb5f',
  CYCLING:         '#4fa8ff',
  SWIMMING:        '#38d6d2',
  WEIGHT_TRAINING: '#ffb23e',
  YOGA:            '#c792ea',
  HIIT:            '#ff3d71',
  CARDIO:          '#ff8fb3',
  STRETCHING:      '#5fe0c0',
  OTHER:           '#8b92a0',
};

// ── Typewriter hook — streams text character by character
const useTypewriter = (text, { speed = 18, startDelay = 0, enabled = true } = {}) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!text || !enabled) {
      setDisplayed(text || '');
      setDone(true);
      return;
    }
    setDisplayed('');
    setDone(false);
    let i = 0;
    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(startTimer);
  }, [text, speed, startDelay, enabled]);

  return { displayed, done };
};

// ── Typewriter for a bullet list — items reveal one by one, each typed out
const useListTypewriter = (items, { speed = 14, itemDelay = 320, startDelay = 0, enabled = true } = {}) => {
  const [visibleItems, setVisibleItems] = useState([]);
  const [typedTexts, setTypedTexts] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!items || !enabled) {
      setVisibleItems(items || []);
      setTypedTexts(items || []);
      setDone(true);
      return;
    }
    setVisibleItems([]);
    setTypedTexts([]);
    setDone(false);

    let cancelled = false;

    const runAll = async () => {
      await new Promise(r => setTimeout(r, startDelay));

      for (let idx = 0; idx < items.length; idx++) {
        if (cancelled) return;
        const text = items[idx];

        // Add empty slot for this item
        setVisibleItems(prev => [...prev, '']);
        setTypedTexts(prev => [...prev, '']);

        // Type it out
        for (let ci = 1; ci <= text.length; ci++) {
          if (cancelled) return;
          await new Promise(r => setTimeout(r, speed));
          setTypedTexts(prev => {
            const next = [...prev];
            next[idx] = text.slice(0, ci);
            return next;
          });
        }

        // Pause before next item
        if (idx < items.length - 1) {
          await new Promise(r => setTimeout(r, itemDelay));
        }
      }
      if (!cancelled) setDone(true);
    };

    runAll();
    return () => { cancelled = true; };
  }, [items, speed, itemDelay, startDelay, enabled]);

  return { typedTexts, done };
};

// ── Blinking cursor
const Cursor = ({ color }) => (
  <motion.span
    animate={{ opacity: [1, 0, 1] }}
    transition={{ duration: 0.75, repeat: Infinity, ease: 'steps(1)' }}
    style={{
      display: 'inline-block', width: 2, height: '1em',
      background: color || COLORS.accent,
      marginLeft: 2, verticalAlign: 'text-bottom', borderRadius: 1,
    }}
  />
);

// ── Animated counting number
const AnimatedNumber = ({ value, unit }) => {
  const [display, setDisplay] = useState(0);
  const numValue = typeof value === 'number' ? value : NaN;

  useEffect(() => {
    if (isNaN(numValue)) return;
    let frame;
    const start = performance.now();
    const dur = 900;
    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1);
      setDisplay(Math.round((1 - Math.pow(1 - t, 3)) * numValue));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [numValue]);

  if (isNaN(numValue)) return <>{value}{unit && <Box component="span" sx={{ fontSize: 12, color: COLORS.textSecondary, ml: '2px' }}>{unit}</Box>}</>;
  return <>{display}{unit && <Box component="span" sx={{ fontSize: 12, color: COLORS.textSecondary, ml: '2px' }}>{unit}</Box>}</>;
};

// ── Stat card
const StatCard = ({ icon, label, value, unit, subtext, valueColor, index = 0 }) => {
  const [hovered, setHovered] = useState(false);
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={prefersReduced ? {} : { y: -3, scale: 1.02 }}
      style={{ flex: '1 1 130px' }}
    >
      <Box
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        sx={{
          bgcolor: COLORS.bgSurfaceHover, border: '1px solid',
          borderColor: hovered ? (valueColor || COLORS.accent) + '44' : COLORS.line,
          borderRadius: '10px', p: '16px 18px',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          boxShadow: hovered ? `0 8px 24px ${(valueColor || COLORS.accent)}18` : 'none',
          height: '100%',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px', mb: '8px' }}>
          <Box sx={{ fontSize: 13, color: valueColor || COLORS.textTertiary, display: 'flex' }}>{icon}</Box>
          <Typography sx={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: COLORS.textTertiary, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {label}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: typeof value === 'string' && value.length > 6 ? 15 : 24, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: valueColor || COLORS.textPrimary, lineHeight: 1.1 }}>
          <AnimatedNumber value={value} unit={unit} />
        </Typography>
        {subtext && <Typography sx={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: COLORS.textTertiary, mt: '4px' }}>{subtext}</Typography>}
      </Box>
    </motion.div>
  );
};

// ── Section wrapper (collapsible)
const Section = ({ icon, title, children, index = 0, accent }) => {
  const [open, setOpen] = useState(true);
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Box sx={{
        border: '1px solid', borderColor: COLORS.line, borderRadius: '10px',
        overflow: 'hidden', mb: 1.5, bgcolor: COLORS.bgSurface,
        transition: 'border-color 0.2s',
        '&:hover': { borderColor: COLORS.lineStrong },
      }}>
        <Box
          onClick={() => setOpen(o => !o)}
          sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            px: 2.5, py: 1.75, borderBottom: open ? '1px solid' : 'none',
            borderColor: COLORS.line, cursor: 'pointer',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' },
            transition: 'background-color 0.15s',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ color: accent || COLORS.accent, fontSize: 16, display: 'flex' }}>{icon}</Box>
            <Typography sx={{ fontSize: 10, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.1em', color: COLORS.textSecondary }}>
              {title}
            </Typography>
          </Box>
          <motion.div animate={{ rotate: open ? 0 : -90 }} transition={{ duration: 0.2 }}>
            <Typography sx={{ fontSize: 14, color: COLORS.textTertiary, lineHeight: 1 }}>›</Typography>
          </motion.div>
        </Box>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <Box sx={{ px: 2.5, py: 2 }}>{children}</Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </motion.div>
  );
};

// ── Typewriter paragraph (Analysis section)
const TypewriterParagraph = ({ text, color, startDelay = 0 }) => {
  const { displayed, done } = useTypewriter(text, { speed: 16, startDelay, enabled: !!text });
  return (
    <Typography sx={{ fontSize: 14, fontFamily: "'Inter', sans-serif", color: COLORS.textSecondary, lineHeight: 1.7 }}>
      {displayed}
      {!done && <Cursor color={color} />}
    </Typography>
  );
};

// ── Typewriter bullet list
const TypewriterBulletList = ({ items, color, startDelay = 0 }) => {
  const { typedTexts } = useListTypewriter(items, { speed: 12, itemDelay: 280, startDelay, enabled: !!items?.length });
  return (
    <Box component="ul" sx={{ listStyle: 'none', p: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {typedTexts.map((text, i) => {
        const fullText = items[i] || '';
        const isTyping = text.length < fullText.length;
        return (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            style={{ display: 'flex', gap: 12 }}
          >
            <motion.div
              animate={isTyping ? { scale: [1, 1.4, 1] } : { scale: 1 }}
              transition={{ duration: 0.4, repeat: isTyping ? Infinity : 0 }}
              style={{ width: 6, height: 6, borderRadius: '50%', background: color || COLORS.accent, flexShrink: 0, marginTop: 9 }}
            />
            <Typography sx={{ fontSize: 14, fontFamily: "'Inter', sans-serif", color: COLORS.textSecondary, lineHeight: 1.65 }}>
              {text}
              {isTyping && <Cursor color={color} />}
            </Typography>
          </motion.li>
        );
      })}
    </Box>
  );
};

// ── Skeleton loader
const Skeleton = ({ w = '100%', h = 16, radius = 6, delay = 0 }) => (
  <motion.div
    animate={{ opacity: [0.4, 0.8, 0.4] }}
    transition={{ duration: 1.6, repeat: Infinity, delay }}
    style={{ width: w, height: h, borderRadius: radius, background: COLORS.bgSurfaceHover }}
  />
);

// ── "AI is thinking" placeholder shown while rec is still loading
const AIThinkingPlaceholder = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
    {[0, 1, 2, 3].map(i => (
      <Box key={i} sx={{ bgcolor: COLORS.bgSurface, border: `1px solid ${COLORS.line}`, borderRadius: '10px', p: 2.5, mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Skeleton h={10} w="28%" delay={i * 0.08} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
          {[88, 72, 80].map((w, j) => <Skeleton key={j} h={11} w={`${w}%`} delay={i * 0.08 + j * 0.05} />)}
        </Box>
        {/* Animated "generating" label */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
          <Box sx={{ display: 'flex', gap: '4px' }}>
            {[0, 1, 2].map(d => (
              <motion.div
                key={d}
                animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.8, delay: d * 0.18, repeat: Infinity }}
                style={{ width: 4, height: 4, borderRadius: '50%', background: COLORS.textTertiary }}
              />
            ))}
          </Box>
          <Typography sx={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: COLORS.textTertiary, letterSpacing: '0.08em' }}>
            AI generating
          </Typography>
        </Box>
      </Box>
    ))}
  </motion.div>
);

// ─────────────────────────────────────────────
const ActivityDetail = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [activityLoading, setActivityLoading] = useState(true);
  const [recLoading, setRecLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch activity data
  const fetchActivity = useCallback(async () => {
    setActivityLoading(true);
    setError(null);
    try {
      const res = await getActivityDetail(id);
      setActivity(res.data);
    } catch (e) {
      console.error(e);
      setError('Could not load this activity.');
    }
    setActivityLoading(false);
  }, [id]);

  // Fetch AI recommendation separately so it never blocks the stats UI
  const fetchRecommendation = useCallback(async () => {
    setRecLoading(true);
    try {
      const res = await getActivityRecommendation(id);
      setRecommendation(res.data);
    } catch (e) {
      console.log('AI recommendations unavailable:', e.message);
    }
    setRecLoading(false);
  }, [id]);

  // On mount: load activity and recommendation
  useEffect(() => {
    fetchActivity();
    fetchRecommendation();
  }, [fetchActivity, fetchRecommendation]);

  const activityColor = activity ? (LANE_COLORS[activity.type] || LANE_COLORS.OTHER) : COLORS.accent;
  const date = activity ? new Date(activity.createdAt) : new Date();

  // Stagger delays for typewriter sections so they don't all start at once
  const analysisDelay   = 200;
  const improvDelay     = 600;
  const suggestDelay    = 1000;
  const safetyDelay     = 1400;

  return (
    <Box sx={{ maxWidth: 780, mx: 'auto', p: 2, pb: 6, bgcolor: COLORS.bgBase, minHeight: '100vh', position: 'relative' }}>

      {/* Ambient glow */}
      <AnimatePresence>
        {activity && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
            style={{
              position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
              width: 500, height: 200, pointerEvents: 'none', zIndex: 0,
              background: `radial-gradient(ellipse, ${activityColor}18 0%, transparent 70%)`,
              filter: 'blur(20px)',
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Header — just the logo, no refresh button */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
          <motion.div
            animate={{ opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            <Circle sx={{ fontSize: 8, color: COLORS.accent, filter: `drop-shadow(0 0 5px ${COLORS.accent})` }} />
          </motion.div>
          <Typography sx={{
            fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.12em', textTransform: 'uppercase', color: COLORS.textSecondary, ml: 1,
          }}>
            one8pulse
          </Typography>
        </Box>
      </motion.div>

      {/* ── Error */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}>
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: 1,
              bgcolor: 'rgba(255,75,43,0.07)', border: '1px solid rgba(255,75,43,0.25)',
              borderRadius: '9px', p: '12px 14px', mb: 2.5,
            }}>
              <ErrorOutline sx={{ fontSize: 15, color: COLORS.errorText, flexShrink: 0 }} />
              <Typography sx={{ fontSize: 13, fontFamily: "'Inter', sans-serif", color: COLORS.errorText }}>{error}</Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      <Box sx={{ position: 'relative', zIndex: 1 }}>

        {/* ── Stat cards */}
        {activityLoading ? (
          <Box sx={{ display: 'flex', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
            {[0, 1, 2, 3].map(i => (
              <Box key={i} sx={{ flex: '1 1 130px', bgcolor: COLORS.bgSurfaceHover, borderRadius: '10px', p: '16px 18px' }}>
                <Skeleton h={10} w="60%" delay={i * 0.1} />
                <Box sx={{ mt: 1.5 }}><Skeleton h={24} w="80%" delay={i * 0.1 + 0.05} /></Box>
              </Box>
            ))}
          </Box>
        ) : activity && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2.5 }}>
            <StatCard index={0} icon={<FitnessCenter fontSize="inherit" />} label="Activity"
              value={activity.type.replace('_', ' ')} valueColor={activityColor} />
            <StatCard index={1} icon={<Schedule fontSize="inherit" />} label="Duration"
              value={activity.duration} unit="min" valueColor={activityColor} />
            <StatCard index={2} icon={<Whatshot fontSize="inherit" />} label="Calories"
              value={activity.caloriesBurned} unit="kcal" valueColor={activityColor} />
            <StatCard index={3} icon={<CalendarToday fontSize="inherit" />} label="Date"
              value={date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              subtext={date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
              valueColor={activityColor}
            />
          </Box>
        )}

        {/* ── AI Recommendation — skeleton while fetching, then typewriter reveal */}
        {recLoading ? (
          <AIThinkingPlaceholder />
        ) : recommendation ? (
          <>
            <Section index={0} icon={<Psychology fontSize="inherit" />} title="Analysis" accent="#60A5FA">
              <TypewriterParagraph
                text={recommendation.recommendation}
                color="#60A5FA"
                startDelay={analysisDelay}
              />
            </Section>

            <Section index={1} icon={<TrendingUp fontSize="inherit" />} title="Improvements" accent="#34D399">
              <TypewriterBulletList
                items={recommendation.improvements}
                color="#34D399"
                startDelay={improvDelay}
              />
            </Section>

            <Section index={2} icon={<Lightbulb fontSize="inherit" />} title="Suggestions" accent="#FCD34D">
              <TypewriterBulletList
                items={recommendation.suggestions}
                color="#FCD34D"
                startDelay={suggestDelay}
              />
            </Section>

            <Section index={3} icon={<Shield fontSize="inherit" />} title="Safety guidelines" accent="#F87171">
              <TypewriterBulletList
                items={recommendation.safety}
                color="#F87171"
                startDelay={safetyDelay}
              />
            </Section>
          </>
        ) : !error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <Box sx={{ textAlign: 'center', py: 8, border: '1px dashed', borderColor: COLORS.line, borderRadius: '10px' }}>
              <Psychology sx={{ fontSize: 36, color: COLORS.textTertiary, mb: 1.5 }} />
              <Typography sx={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: COLORS.textTertiary }}>
                AI recommendations unavailable
              </Typography>
            </Box>
          </motion.div>
        )}
      </Box>
    </Box>
  );
};

export default ActivityDetail;