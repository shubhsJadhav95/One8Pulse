// src/components/activities/ActivityList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, CircularProgress, useTheme, useMediaQuery,
} from '@mui/material';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PoolIcon from '@mui/icons-material/Pool';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SearchIcon from '@mui/icons-material/Search';
import { getActivities } from '../../services/api';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const COLORS = {
  bgBase: '#0e1117',
  bgSurface: '#161b24',
  bgSurfaceHover: '#1c2230',
  bgGlass: 'rgba(22,27,36,0.7)',
  line: '#242b38',
  lineStrong: '#2e3748',
  accent: '#ff4b2b',
  accentStrong: '#ff6b45',
  accentGlow: 'rgba(255,75,43,0.2)',
  lime: '#b8ff3d',
  textPrimary: '#eef0ed',
  textSecondary: '#8c93a0',
  textTertiary: '#4e5563',
};

const LANE_COLORS = {
  RUNNING:        '#ff5a4d',
  WALKING:        '#6ccb5f',
  CYCLING:        '#4fa8ff',
  SWIMMING:       '#38d6d2',
  WEIGHT_TRAINING:'#ffb23e',
  YOGA:           '#c792ea',
  HIIT:           '#ff3d71',
  CARDIO:         '#ff8fb3',
  STRETCHING:     '#5fe0c0',
  OTHER:          '#8b92a0',
};

const ICON_MAP = {
  RUNNING:         <DirectionsRunIcon sx={{ fontSize: 20 }} />,
  WALKING:         <DirectionsRunIcon sx={{ fontSize: 20 }} />,
  CYCLING:         <DirectionsBikeIcon sx={{ fontSize: 20 }} />,
  SWIMMING:        <PoolIcon sx={{ fontSize: 20 }} />,
  WEIGHT_TRAINING: <FitnessCenterIcon sx={{ fontSize: 20 }} />,
  YOGA:            <SelfImprovementIcon sx={{ fontSize: 20 }} />,
  HIIT:            <WhatshotIcon sx={{ fontSize: 20 }} />,
  CARDIO:          <WhatshotIcon sx={{ fontSize: 20 }} />,
  STRETCHING:      <SelfImprovementIcon sx={{ fontSize: 20 }} />,
  OTHER:           <FitnessCenterIcon sx={{ fontSize: 20 }} />,
};

const FILTERS = ['All', 'Running', 'Walking', 'Cycling', 'Swimming', 'Weight Training', 'Yoga', 'HIIT', 'Cardio'];

const getLaneColor = (type) => LANE_COLORS[type] || LANE_COLORS.OTHER;

// ── Animated background dots grid
const DotGrid = () => (
  <Box sx={{
    position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
    backgroundImage: `radial-gradient(circle, ${COLORS.lineStrong} 1px, transparent 1px)`,
    backgroundSize: '32px 32px',
    opacity: 0.35,
    maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
  }} />
);

// ── Stat bar for calories (visual fill)
const CalorieBar = ({ calories, max = 800, color }) => {
  const pct = Math.min((calories / max) * 100, 100);
  return (
    <Box sx={{ height: 3, bgcolor: `${color}20`, borderRadius: 2, overflow: 'hidden', mt: 1.5 }}>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${pct}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
        style={{ height: '100%', background: color, borderRadius: 4 }}
      />
    </Box>
  );
};

const ActivityCard = ({ activity, onClick, index }) => {
  const [hovered, setHovered] = useState(false);
  const prefersReduced = useReducedMotion();
  const icon = ICON_MAP[activity.type] ?? <FitnessCenterIcon sx={{ fontSize: 20 }} />;
  const date = new Date(activity.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const lane = getLaneColor(activity.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay: index * 0.055, ease: [0.22, 1, 0.36, 1] }}
      whileHover={prefersReduced ? {} : { y: -4, scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
    >
      <Box
        onClick={onClick}
        role="button" tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        sx={{
          bgcolor: COLORS.bgSurface,
          border: '1px solid',
          borderColor: hovered ? lane + '55' : COLORS.line,
          borderTop: `2px solid ${lane}`,
          borderRadius: '10px',
          p: '20px',
          cursor: 'pointer',
          transition: 'border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',
          boxShadow: hovered ? `0 8px 32px ${lane}18, 0 0 0 1px ${lane}22` : '0 2px 8px rgba(0,0,0,0.2)',
          position: 'relative', overflow: 'hidden',
          '&:focus-visible': { outline: `2px solid ${COLORS.lime}`, outlineOffset: '2px' },
        }}
      >
        {/* Hover glow layer */}
        <Box sx={{
          position: 'absolute', inset: 0, borderRadius: '10px', pointerEvents: 'none',
          background: `radial-gradient(ellipse at 50% 0%, ${lane}12 0%, transparent 60%)`,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }} />

        {/* Header row */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5, position: 'relative' }}>
          <Box sx={{
            width: 40, height: 40, borderRadius: '10px',
            bgcolor: `${lane}18`, color: lane,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background-color 0.2s',
            ...(hovered && { bgcolor: `${lane}28` }),
          }}>
            {icon}
          </Box>
          <Typography sx={{
            fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
            color: COLORS.textTertiary, letterSpacing: '0.04em',
          }}>
            {date}
          </Typography>
        </Box>

        {/* Type label */}
        <Typography sx={{
          fontSize: 11, fontWeight: 700, mb: 2,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: lane,
        }}>
          {activity.type.replace('_', ' ')}
        </Typography>

        {/* Duration badge */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: '5px',
            bgcolor: 'rgba(255,255,255,0.04)', borderRadius: '6px', px: 1.25, py: '5px',
            border: '1px solid rgba(255,255,255,0.05)',
          }}>
            <ScheduleIcon sx={{ fontSize: 12, color: COLORS.textSecondary }} />
            <Typography sx={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: COLORS.textSecondary }}>
              {activity.duration} min
            </Typography>
          </Box>
        </Box>

        {/* Calorie bar */}
        <CalorieBar calories={activity.caloriesBurned} color={lane} />

        {/* Footer row */}
        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          mt: 2, pt: 2, borderTop: '1px solid', borderColor: COLORS.line,
        }}>
          <Box sx={{
            fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
            color: lane, bgcolor: `${lane}18`, borderRadius: '24px', px: 1.5, py: '4px',
            border: `1px solid ${lane}30`,
          }}>
            {activity.caloriesBurned} kcal
          </Box>
          <motion.div
            animate={hovered ? { x: 3 } : { x: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: 12, color: COLORS.accent }}>
              View <ArrowForwardIcon sx={{ fontSize: 12 }} />
            </Box>
          </motion.div>
        </Box>
      </Box>
    </motion.div>
  );
};

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getActivities()
      .then(r => setActivities(r.data))
      .catch(e => { console.error(e); setError('Could not load activities.'); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = activities.filter(a => {
    const matchesFilter = activeFilter === 'All' || a.type.toLowerCase().includes(activeFilter.toLowerCase().replace(' ', '_'));
    const matchesSearch = !search || a.type.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Totals for the summary bar
  const totalCals = activities.reduce((s, a) => s + a.caloriesBurned, 0);
  const totalMins = activities.reduce((s, a) => s + a.duration, 0);

  if (loading) return (
    <Box sx={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5, p: 6,
      bgcolor: COLORS.bgBase, minHeight: '100vh', justifyContent: 'center',
    }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
      >
        <LocalFireDepartmentIcon sx={{ fontSize: 32, color: COLORS.accent }} />
      </motion.div>
      <Typography sx={{
        fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: '0.12em', textTransform: 'uppercase', color: COLORS.textSecondary,
      }}>
        Loading activities…
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ position: 'relative', bgcolor: COLORS.bgBase, minHeight: '100vh' }}>
      <DotGrid />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Box sx={{ p: { xs: '24px', md: '40px 48px' }, color: COLORS.textPrimary, position: 'relative', zIndex: 1 }}>

          {/* ── Hero header */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Typography sx={{
                fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '0.16em', textTransform: 'uppercase', color: COLORS.accent, mb: 1.5,
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.8, repeat: Infinity }}>
                  ●
                </motion.span>
                Activity log
              </Typography>
              <Typography sx={{
                fontSize: 34, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em',
                fontFamily: "'Oswald', sans-serif", color: COLORS.textPrimary,
              }}>
                Your activities
              </Typography>
              <Typography sx={{
                fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
                color: COLORS.textSecondary, mt: 1,
              }}>
                {filtered.length} of {activities.length} session{activities.length !== 1 ? 's' : ''} shown
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.button
                onClick={() => navigate('/activities/new')}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '12px 22px', borderRadius: 8,
                  fontSize: 14, fontWeight: 700, color: '#0e1117',
                  fontFamily: "'Inter', sans-serif",
                  background: 'linear-gradient(135deg, #ff4b2b, #ff6b45)',
                  border: 'none', cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(255,75,43,0.35)',
                }}
              >
                <AddIcon style={{ fontSize: 18 }} /> Log activity
              </motion.button>
            </motion.div>
          </Box>

          {/* ── Summary stats */}
          {activities.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <Box sx={{ display: 'flex', gap: 2, mb: 3.5, flexWrap: 'wrap' }}>
                {[
                  { label: 'Total sessions', value: activities.length, unit: '' },
                  { label: 'Total calories', value: totalCals.toLocaleString(), unit: 'kcal' },
                  { label: 'Total time', value: (totalMins / 60).toFixed(1), unit: 'hrs' },
                ].map(({ label, value, unit }, i) => (
                  <motion.div key={i} whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                    <Box sx={{
                      bgcolor: COLORS.bgSurface, border: '1px solid', borderColor: COLORS.line,
                      borderRadius: '8px', px: 2.5, py: 1.75,
                    }}>
                      <Typography sx={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: COLORS.textTertiary, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 }}>
                        {label}
                      </Typography>
                      <Typography sx={{ fontSize: 20, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: COLORS.textPrimary }}>
                        {value}<Box component="span" sx={{ fontSize: 11, color: COLORS.textSecondary, ml: '3px' }}>{unit}</Box>
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          )}

          {/* ── Search + Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Search input */}
              <Box sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                bgcolor: COLORS.bgSurface, border: '1px solid', borderColor: COLORS.line,
                borderRadius: '8px', px: 1.5, py: '8px',
                '&:focus-within': { borderColor: COLORS.accent },
                transition: 'border-color 0.15s',
              }}>
                <SearchIcon sx={{ fontSize: 15, color: COLORS.textTertiary }} />
                <Box
                  component="input"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search…"
                  sx={{
                    border: 'none', outline: 'none', background: 'transparent',
                    color: COLORS.textPrimary, fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12, width: 120,
                    '&::placeholder': { color: COLORS.textTertiary },
                  }}
                />
              </Box>

              {/* Filter chips */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {FILTERS.map((f, i) => (
                  <motion.button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    whileTap={{ scale: 0.94 }}
                    style={{
                      padding: '7px 16px', borderRadius: 20, cursor: 'pointer',
                      fontSize: 10, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                      border: `1px solid ${activeFilter === f ? COLORS.accent : COLORS.line}`,
                      background: activeFilter === f ? COLORS.accent : 'transparent',
                      color: activeFilter === f ? '#0e1117' : COLORS.textSecondary,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {f}
                  </motion.button>
                ))}
              </Box>
            </Box>
          </motion.div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Box sx={{
                bgcolor: 'rgba(255,75,43,0.07)', border: '1px solid rgba(255,75,43,0.25)',
                borderRadius: '8px', px: 2, py: 1.5, mb: 3,
              }}>
                <Typography sx={{ fontSize: 13, color: '#ff8a6b' }}>{error}</Typography>
              </Box>
            </motion.div>
          )}

          {/* ── Grid */}
          <AnimatePresence mode="wait">
            <motion.div key={activeFilter + search}>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 2 }}>
                {filtered.map((a, i) => (
                  <ActivityCard key={a.id} activity={a} index={i} onClick={() => navigate(`/activities/${a.id}`)} />
                ))}
                {filtered.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ gridColumn: '1/-1' }}
                  >
                    <Box sx={{ textAlign: 'center', py: 10, color: COLORS.textTertiary }}>
                      <FitnessCenterIcon sx={{ fontSize: 36, mb: 2, opacity: 0.3 }} />
                      <Typography sx={{ fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }}>
                        No activities found
                      </Typography>
                    </Box>
                  </motion.div>
                )}
              </Box>
            </motion.div>
          </AnimatePresence>
        </Box>
      </motion.div>
    </Box>
  );
};

export default ActivityList;