// src/components/activities/ActivityList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, useTheme, useMediaQuery, IconButton, Drawer, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PoolIcon from '@mui/icons-material/Pool';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MenuIcon from '@mui/icons-material/Menu';
import { getActivities } from '../../services/api';
import { useTheme as useCustomTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

// Shared design tokens (same palette as Dashboard/Navbar)
const COLORS = {
  bgBase: '#14171c',
  bgSurface: '#1b1f26',
  bgSurfaceHover: '#20252d',
  line: '#2a2f38',
  accent: '#ff4b2b',
  accentStrong: '#ff6b45',
  lime: '#b8ff3d',
  textPrimary: '#f3f4f1',
  textSecondary: '#9aa0ab',
  textTertiary: '#5b616c',
};

// Same lane-color mapping used for session cards on the Dashboard
const LANE_COLORS = {
  RUNNING: '#ff5a4d',
  WALKING: '#6ccb5f',
  CYCLING: '#4fa8ff',
  SWIMMING: '#38d6d2',
  WEIGHT_TRAINING: '#ffb23e',
  YOGA: '#c792ea',
  HIIT: '#ff3d71',
  CARDIO: '#ff8fb3',
  STRETCHING: '#5fe0c0',
  OTHER: '#8b92a0',
};

const getLaneColor = (type) => LANE_COLORS[type] || LANE_COLORS.OTHER;

const ICON_MAP = {
  'RUNNING': <DirectionsRunIcon sx={{ fontSize: 22 }} />,
  'WALKING': <DirectionsRunIcon sx={{ fontSize: 22 }} />,
  'CYCLING': <DirectionsBikeIcon sx={{ fontSize: 22 }} />,
  'SWIMMING': <PoolIcon sx={{ fontSize: 22 }} />,
  'WEIGHT_TRAINING': <FitnessCenterIcon sx={{ fontSize: 22 }} />,
  'YOGA': <SelfImprovementIcon sx={{ fontSize: 22 }} />,
  'HIIT': <WhatshotIcon sx={{ fontSize: 22 }} />,
  'CARDIO': <WhatshotIcon sx={{ fontSize: 22 }} />,
  'STRETCHING': <SelfImprovementIcon sx={{ fontSize: 22 }} />,
  'OTHER': <FitnessCenterIcon sx={{ fontSize: 22 }} />,
};

const FILTERS = ['All', 'Running', 'Walking', 'Cycling', 'Swimming', 'Weight Training', 'Yoga', 'HIIT', 'Cardio'];

const ActivityCard = ({ activity, onClick }) => {
  const icon = ICON_MAP[activity.type] ?? <FitnessCenterIcon sx={{ fontSize: 22 }} />;
  const date = new Date(activity.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const lane = getLaneColor(activity.type);

  return (
    <Box
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      sx={{
        bgcolor: COLORS.bgSurface,
        border: '1px solid',
        borderColor: COLORS.line,
        borderLeft: `3px solid ${lane}`,
        borderRadius: '8px',
        p: 3,
        cursor: 'pointer',
        transition: 'background-color 0.15s ease, transform 0.15s ease',
        '&:hover': { bgcolor: COLORS.bgSurfaceHover, transform: 'translateY(-2px)' },
        '&:focus-visible': { outline: `2px solid ${COLORS.lime}`, outlineOffset: '2px' },
        '@media (prefers-reduced-motion: reduce)': {
          '&:hover': { transform: 'none' },
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
        <Box sx={{
          width: 40, height: 40, borderRadius: '10px',
          bgcolor: `${lane}1a`, color: lane,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </Box>
        <Typography sx={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: COLORS.textTertiary }}>
          {date}
        </Typography>
      </Box>

      <Typography sx={{
        fontSize: 13, fontWeight: 700, mb: 2,
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: '0.06em', textTransform: 'uppercase',
        color: lane,
      }}>
        {activity.type}
      </Typography>

      <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5 }}>
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: '5px',
          bgcolor: 'rgba(255,255,255,0.04)', borderRadius: '6px', px: 1.25, py: '6px',
        }}>
          <ScheduleIcon sx={{ fontSize: 14, color: COLORS.textSecondary }} />
          <Typography sx={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: COLORS.textSecondary }}>
            {activity.duration} min
          </Typography>
        </Box>
      </Box>

      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        pt: 2, borderTop: '1px solid', borderColor: COLORS.line,
      }}>
        <Box sx={{
          fontSize: 12, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace",
          color: lane, bgcolor: `${lane}1a`, borderRadius: '24px', px: 1.5, py: '4px',
        }}>
          {activity.caloriesBurned} kcal
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 13, color: COLORS.accent }}>
          View <ArrowForwardIcon sx={{ fontSize: 13 }} />
        </Box>
      </Box>
    </Box>
  );
};

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode } = useCustomTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    getActivities()
      .then(r => setActivities(r.data))
      .catch(e => { console.error(e); setError('Could not load activities.'); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeFilter === 'All'
    ? activities
    : activities.filter(a => a.type.toLowerCase().includes(activeFilter.toLowerCase()));

  if (loading) return (
    <Box sx={{
      display: 'flex', alignItems: 'center', gap: 2, p: 6,
      bgcolor: COLORS.bgBase, minHeight: '100vh',
    }}>
      <CircularProgress size={22} sx={{ color: COLORS.accent }} />
      <Typography sx={{
        fontSize: 13, fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.textSecondary,
      }}>
        Loading activities…
      </Typography>
    </Box>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ p: { xs: '24px', md: '40px 48px' }, bgcolor: COLORS.bgBase, minHeight: '100vh', color: COLORS.textPrimary }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mb: 3.5 }}>
        <Box>
          <Typography sx={{
            fontSize: 11, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.14em', textTransform: 'uppercase', color: COLORS.accent, mb: 1.5,
          }}>
            Activity log
          </Typography>
          <Typography sx={{
            fontSize: 32, fontWeight: 600, lineHeight: 1,
            fontFamily: "'Oswald', sans-serif", letterSpacing: '-0.01em',
            color: COLORS.textPrimary,
          }}>
            Your activities
          </Typography>
          <Typography sx={{
            fontSize: 13, fontFamily: "'JetBrains Mono', monospace",
            color: COLORS.textSecondary, mt: '10px',
          }}>
            {filtered.length} session{filtered.length !== 1 ? 's' : ''} logged
          </Typography>
        </Box>
        <Box component="button" onClick={() => navigate('/activities/new')} sx={{
          display: 'flex', alignItems: 'center', gap: 1,
          px: '22px', py: '12px', borderRadius: '6px',
          fontSize: 14, fontWeight: 600, color: COLORS.bgBase,
          fontFamily: "'Inter', sans-serif",
          bgcolor: COLORS.accent, border: 'none', cursor: 'pointer',
          transition: 'background-color 0.15s ease, transform 0.15s ease',
          '&:hover': { bgcolor: COLORS.accentStrong, transform: 'translateY(-1px)' },
          '&:focus-visible': { outline: `2px solid ${COLORS.lime}`, outlineOffset: '3px' },
          '@media (prefers-reduced-motion: reduce)': {
            '&:hover': { transform: 'none' },
          },
        }}>
          <AddIcon sx={{ fontSize: 18 }} /> Log activity
        </Box>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3.5, flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <Box key={f} component="button" onClick={() => setActiveFilter(f)} sx={{
            px: '16px', py: '8px', borderRadius: '20px',
            fontSize: 11, fontWeight: 600, cursor: 'pointer',
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.05em', textTransform: 'uppercase',
            border: '1px solid',
            borderColor: activeFilter === f ? COLORS.accent : COLORS.line,
            bgcolor: activeFilter === f ? COLORS.accent : 'transparent',
            color: activeFilter === f ? COLORS.bgBase : COLORS.textSecondary,
            transition: 'all 0.15s ease',
            '&:hover': activeFilter === f ? {} : { borderColor: COLORS.textSecondary, color: COLORS.textPrimary },
            '&:focus-visible': { outline: `2px solid ${COLORS.lime}`, outlineOffset: '2px' },
          }}>
            {f}
          </Box>
        ))}
      </Box>

      {error && (
        <Box sx={{
          bgcolor: 'rgba(255,75,43,0.08)', border: '1px solid rgba(255,75,43,0.3)',
          borderRadius: '8px', px: 2, py: 1.5, mb: 3,
        }}>
          <Typography sx={{ fontSize: 14, color: '#ff8a6b' }}>{error}</Typography>
        </Box>
      )}

      {/* Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 2 }}>
        {filtered.map(a => (
          <ActivityCard key={a.id} activity={a} onClick={() => navigate(`/activities/${a.id}`)} />
        ))}
        {filtered.length === 0 && (
          <Box sx={{ gridColumn: '1/-1', textAlign: 'center', py: 8, color: COLORS.textTertiary }}>
            <Typography sx={{ fontSize: 15, fontFamily: "'JetBrains Mono', monospace" }}>
              No activities found
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
    </motion.div>
  );
};

export default ActivityList;