// src/components/activities/ActivityForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, TextField, Chip, MenuItem,
  Select, FormControl, useTheme, useMediaQuery,
} from '@mui/material';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import PoolIcon from '@mui/icons-material/Pool';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StraightenIcon from '@mui/icons-material/Straighten';
import SpeedIcon from '@mui/icons-material/Speed';
import LandscapeIcon from '@mui/icons-material/Landscape';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { addActivity } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = {
  bgBase: '#0e1117',
  bgSurface: '#161b24',
  bgSurfaceHover: '#1c2230',
  line: '#242b38',
  lineStrong: '#2e3748',
  accent: '#ff4b2b',
  accentStrong: '#ff6b45',
  lime: '#b8ff3d',
  textPrimary: '#eef0ed',
  textSecondary: '#8c93a0',
  textTertiary: '#4e5563',
  errorText: '#ff6b6b',
  successText: '#34d399',
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

const ACTIVITY_TYPES = [
  { value: 'RUNNING',         label: 'Running',        icon: <DirectionsRunIcon /> },
  { value: 'WALKING',         label: 'Walking',        icon: <DirectionsWalkIcon /> },
  { value: 'CYCLING',         label: 'Cycling',        icon: <DirectionsBikeIcon /> },
  { value: 'SWIMMING',        label: 'Swimming',       icon: <PoolIcon /> },
  { value: 'WEIGHT_TRAINING', label: 'Weight Training',icon: <FitnessCenterIcon /> },
  { value: 'YOGA',            label: 'Yoga',           icon: <SelfImprovementIcon /> },
  { value: 'HIIT',            label: 'HIIT',           icon: <WhatshotIcon /> },
  { value: 'CARDIO',          label: 'Cardio',         icon: <FavoriteIcon /> },
  { value: 'STRETCHING',      label: 'Stretching',     icon: <AccessTimeIcon /> },
  { value: 'OTHER',           label: 'Other',          icon: <AutoAwesomeIcon /> },
];

const METRIC_OPTIONS = [
  { key: 'avgHeartRate',  label: 'Avg heart rate',  icon: <FavoriteIcon sx={{ fontSize: 14 }} />,  unit: 'bpm' },
  { key: 'distance',      label: 'Distance',         icon: <StraightenIcon sx={{ fontSize: 14 }} />, unit: 'km' },
  { key: 'avgPace',       label: 'Avg pace',         icon: <SpeedIcon sx={{ fontSize: 14 }} />,      unit: 'min/km' },
  { key: 'elevationGain', label: 'Elevation gain',   icon: <LandscapeIcon sx={{ fontSize: 14 }} />,  unit: 'm' },
];

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: 'rgba(28,34,48,0.8)',
    borderRadius: '8px',
    color: COLORS.textPrimary,
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    transition: 'box-shadow 0.2s ease',
    '& fieldset': { borderColor: COLORS.line },
    '&:hover fieldset': { borderColor: COLORS.lineStrong },
    '&.Mui-focused fieldset': { borderColor: COLORS.accent, borderWidth: '1px' },
    '&.Mui-focused': { boxShadow: `0 0 0 3px rgba(255,75,43,0.12)` },
  },
  '& .MuiInputBase-input': { color: COLORS.textPrimary },
  '& .MuiInputBase-input::placeholder': { color: COLORS.textTertiary, opacity: 1 },
  '& input[type="datetime-local"]::-webkit-calendar-picker-indicator': { filter: 'invert(0.7) sepia(1) hue-rotate(-30deg)' },
};

const labelSx = {
  fontSize: 10, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
  letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.textSecondary,
  mb: 1, display: 'block',
};

const unitSx = {
  fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: COLORS.textTertiary,
};

// ── Animated field wrapper
const Field = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

// ── Success burst overlay
const SuccessBurst = ({ onDone }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    style={{
      position: 'absolute', inset: 0, borderRadius: 12,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', background: 'rgba(14,17,23,0.92)',
      backdropFilter: 'blur(8px)', zIndex: 10,
    }}
  >
    <motion.div
      initial={{ scale: 0, rotate: -30 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
    >
      <CheckCircleIcon sx={{ fontSize: 56, color: COLORS.successText, mb: 2 }} />
    </motion.div>
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
    >
      <Typography sx={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 16, color: COLORS.textPrimary, mb: 0.5 }}>
        Activity saved!
      </Typography>
      <Typography sx={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: COLORS.textSecondary, textAlign: 'center' }}>
        Getting AI recommendations…
      </Typography>
    </motion.div>
  </motion.div>
);

const ActivityForm = ({ onActivityAdded }) => {
  const navigate = useNavigate();
  const [type, setType] = useState('RUNNING');
  const [duration, setDuration] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [startTime, setStartTime] = useState(new Date().toISOString().slice(0, 16));
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [metricValues, setMetricValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const currentColor = LANE_COLORS[type] || LANE_COLORS.OTHER;

  const toggleMetric = (key) => {
    setSelectedMetrics(prev =>
      prev.includes(key) ? prev.filter(m => m !== key) : [...prev, key]
    );
  };

  const handleReset = () => {
    setType('RUNNING'); setDuration(''); setCaloriesBurned('');
    setStartTime(new Date().toISOString().slice(0, 16));
    setSelectedMetrics([]); setMetricValues({}); setError('');
  };

  const handleSubmit = async () => {
    if (!duration || !caloriesBurned) { setError('Please fill in duration and calories.'); return; }
    setError(''); setLoading(true);
    try {
      const additionalMetrics = {};
      selectedMetrics.forEach(key => { if (metricValues[key]) additionalMetrics[key] = metricValues[key]; });
      await addActivity({
        type, duration: Number(duration), caloriesBurned: Number(caloriesBurned),
        startTime: new Date(startTime).toISOString(), additionalMetrics,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (onActivityAdded) onActivityAdded();
        else navigate('/dashboard');
        handleReset();
      }, 1600);
    } catch {
      setError('Failed to save activity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <Box sx={{
        maxWidth: { xs: '100%', md: 520 }, mx: 'auto', mb: 4,
        border: '1px solid', borderColor: COLORS.line,
        borderTop: `2px solid ${currentColor}`,
        borderRadius: '12px', overflow: 'hidden',
        bgcolor: COLORS.bgSurface, position: 'relative',
        boxShadow: `0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)`,
        transition: 'border-top-color 0.3s ease',
      }}>
        {/* Active color glow at top */}
        <Box sx={{
          position: 'absolute', top: 0, left: '10%', right: '10%', height: 60, pointerEvents: 'none',
          background: `radial-gradient(ellipse, ${currentColor}25 0%, transparent 70%)`,
          transition: 'background 0.3s ease',
        }} />

        {/* ── Header */}
        <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid', borderColor: COLORS.line, display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative' }}>
          <motion.div
            key={type}
            initial={{ scale: 0.6, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          >
            <Box sx={{
              width: 38, height: 38, borderRadius: '9px',
              bgcolor: `${currentColor}20`, color: currentColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1px solid ${currentColor}30`,
              transition: 'all 0.3s ease',
            }}>
              <AutoAwesomeIcon sx={{ fontSize: 18 }} />
            </Box>
          </motion.div>
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 700, fontFamily: "'Inter', sans-serif", color: COLORS.textPrimary, mb: 0.25 }}>
              Log activity
            </Typography>
            <Typography sx={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: COLORS.textSecondary }}>
              Track your workout · get AI recommendations
            </Typography>
          </Box>
        </Box>

        {/* ── Body */}
        <Box sx={{ px: 3, py: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>

          {/* Activity type selector — shown as a scrollable pill row */}
          <Field delay={0.05}>
            <Typography component="span" sx={labelSx}>Activity type</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {ACTIVITY_TYPES.map(({ value, label, icon }) => {
                const selected = type === value;
                const laneColor = LANE_COLORS[value];
                return (
                  <motion.button
                    key={value}
                    onClick={() => setType(value)}
                    whileTap={{ scale: 0.92 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '7px 14px', borderRadius: 8, cursor: 'pointer',
                      fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600,
                      border: `1px solid ${selected ? laneColor + '60' : COLORS.line}`,
                      background: selected ? `${laneColor}15` : 'transparent',
                      color: selected ? laneColor : COLORS.textSecondary,
                      transition: 'all 0.18s ease',
                    }}
                  >
                    <Box sx={{ display: 'flex', color: selected ? laneColor : COLORS.textTertiary, '& svg': { fontSize: 15 } }}>
                      {icon}
                    </Box>
                    {label}
                  </motion.button>
                );
              })}
            </Box>
          </Field>

          {/* Start time */}
          <Field delay={0.1}>
            <Typography component="span" sx={labelSx}>Start time</Typography>
            <TextField
              fullWidth size="small" type="datetime-local"
              value={startTime} onChange={e => setStartTime(e.target.value)}
              InputLabelProps={{ shrink: true }} sx={fieldSx}
            />
          </Field>

          {/* Duration + Calories */}
          <Field delay={0.15}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              <Box>
                <Typography component="span" sx={labelSx}>Duration</Typography>
                <TextField
                  fullWidth size="small" type="number" placeholder="45"
                  value={duration} onChange={e => setDuration(e.target.value)}
                  InputProps={{ endAdornment: <Typography sx={unitSx}>min</Typography> }}
                  sx={fieldSx}
                />
              </Box>
              <Box>
                <Typography component="span" sx={labelSx}>Calories burned</Typography>
                <TextField
                  fullWidth size="small" type="number" placeholder="320"
                  value={caloriesBurned} onChange={e => setCaloriesBurned(e.target.value)}
                  InputProps={{ endAdornment: <Typography sx={unitSx}>kcal</Typography> }}
                  sx={fieldSx}
                />
              </Box>
            </Box>
          </Field>

          {/* Additional metrics */}
          <Field delay={0.2}>
            <Typography component="span" sx={{ ...labelSx, mb: 1.25 }}>
              Additional metrics
              <Box component="span" sx={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: COLORS.textTertiary, ml: 1 }}>
                (optional)
              </Box>
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              {METRIC_OPTIONS.map(({ key, label, icon }) => {
                const selected = selectedMetrics.includes(key);
                return (
                  <motion.div key={key} whileTap={{ scale: 0.95 }}>
                    <Chip
                      icon={icon}
                      label={label}
                      onClick={() => toggleMetric(key)}
                      variant={selected ? 'filled' : 'outlined'}
                      size="small"
                      sx={{
                        justifyContent: 'flex-start', px: 0.5, height: 34, width: '100%',
                        borderRadius: '7px', fontSize: 11, cursor: 'pointer',
                        fontFamily: "'Inter', sans-serif",
                        bgcolor: selected ? `${currentColor}15` : 'transparent',
                        borderColor: selected ? currentColor : COLORS.line,
                        color: selected ? currentColor : COLORS.textSecondary,
                        '& .MuiChip-icon': { color: selected ? currentColor : COLORS.textSecondary, fontSize: 14 },
                        '&:hover': { borderColor: selected ? currentColor : COLORS.lineStrong },
                        transition: 'all 0.15s ease',
                        '&.MuiFocusVisible': { outline: `2px solid ${COLORS.lime}`, outlineOffset: '2px' },
                      }}
                    />
                  </motion.div>
                );
              })}
            </Box>

            <AnimatePresence>
              {selectedMetrics.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                    {selectedMetrics.map(key => {
                      const metric = METRIC_OPTIONS.find(m => m.key === key);
                      return (
                        <TextField
                          key={key} size="small" type="number"
                          label={metric.label} placeholder="0"
                          value={metricValues[key] || ''}
                          onChange={e => setMetricValues(prev => ({ ...prev, [key]: e.target.value }))}
                          InputProps={{ endAdornment: <Typography sx={unitSx}>{metric.unit}</Typography> }}
                          sx={{
                            ...fieldSx,
                            '& .MuiInputLabel-root': { color: COLORS.textSecondary, fontFamily: "'Inter', sans-serif", fontSize: 12 },
                            '& .MuiInputLabel-root.Mui-focused': { color: currentColor },
                          }}
                        />
                      );
                    })}
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Field>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
              >
                <Box sx={{
                  display: 'flex', alignItems: 'center', gap: 1,
                  bgcolor: 'rgba(255,75,43,0.07)', border: '1px solid rgba(255,75,43,0.22)',
                  borderRadius: '7px', px: 1.5, py: 1,
                }}>
                  <Typography sx={{ fontSize: 12, fontFamily: "'Inter', sans-serif", color: COLORS.errorText }}>
                    {error}
                  </Typography>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {/* ── Footer */}
        <Box sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: COLORS.line, display: 'flex', gap: 1.5 }}>
          <motion.button
            onClick={handleReset}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            style={{
              padding: '10px 18px', borderRadius: 7, cursor: 'pointer',
              fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
              border: `1px solid ${COLORS.line}`, background: 'transparent', color: COLORS.textSecondary,
              transition: 'border-color 0.15s, color 0.15s',
            }}
          >
            Clear
          </motion.button>

          <motion.button
            onClick={handleSubmit}
            disabled={loading}
            whileHover={!loading ? { scale: 1.02, y: -1 } : {}}
            whileTap={!loading ? { scale: 0.97 } : {}}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '10px 18px', borderRadius: 7, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700,
              border: 'none', color: '#0e1117',
              background: loading
                ? COLORS.bgSurfaceHover
                : `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentStrong})`,
              boxShadow: loading ? 'none' : `0 4px 20px rgba(255,75,43,0.3)`,
              transition: 'background 0.2s, box-shadow 0.2s',
            }}
          >
            {loading ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <LocalFireDepartmentIcon style={{ fontSize: 16, color: COLORS.textTertiary }} />
                </motion.div>
                <span style={{ color: COLORS.textTertiary }}>Saving…</span>
              </>
            ) : (
              <>
                <AutoAwesomeIcon style={{ fontSize: 16 }} />
                Save & get recommendations
              </>
            )}
          </motion.button>
        </Box>

        {/* ── Success overlay */}
        <AnimatePresence>
          {success && <SuccessBurst />}
        </AnimatePresence>
      </Box>
    </motion.div>
  );
};

export default ActivityForm;