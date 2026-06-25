// src/components/activities/ActivityDetail.jsx
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import {
  FitnessCenter, Whatshot, Schedule, CalendarToday,
  Psychology, TrendingUp, Lightbulb, Shield,
  Refresh, ErrorOutline, Circle
} from '@mui/icons-material';
import { getActivityDetail, getActivityRecommendation } from '../../services/api';

// Shared design tokens (same palette as Dashboard/Navbar/ActivityList/ActivityForm)
const COLORS = {
  bgBase: '#14171c',
  bgSurface: '#1b1f26',
  bgSurfaceHover: '#20252d',
  line: '#2a2f38',
  accent: '#ff4b2b',
  lime: '#b8ff3d',
  textPrimary: '#f3f4f1',
  textSecondary: '#9aa0ab',
  textTertiary: '#5b616c',
  errorText: '#ff6b6b',
};

// Same lane-color mapping used across the app, for tinting the activity-type stat
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

const StatCard = ({ icon, label, value, unit, subtext, valueColor }) => (
  <Box sx={{
    bgcolor: COLORS.bgSurfaceHover, border: '1px solid', borderColor: COLORS.line,
    borderRadius: '8px', p: '14px 16px', flex: '1 1 130px'
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px', mb: '6px' }}>
      <Box sx={{ fontSize: 13, color: COLORS.textTertiary, display: 'flex' }}>{icon}</Box>
      <Typography sx={{
        fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
        color: COLORS.textTertiary, textTransform: 'uppercase', letterSpacing: '0.08em',
      }}>
        {label}
      </Typography>
    </Box>
    <Typography sx={{
      fontSize: typeof value === 'string' && value.length > 6 ? 15 : 22,
      fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
      color: valueColor || COLORS.textPrimary,
    }}>
      {value}{unit && <Box component="span" sx={{ fontSize: 12, color: COLORS.textSecondary, fontWeight: 500, ml: '2px' }}>{unit}</Box>}
    </Typography>
    {subtext && (
      <Typography sx={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: COLORS.textTertiary, mt: '2px' }}>
        {subtext}
      </Typography>
    )}
  </Box>
);

const Section = ({ icon, title, children }) => (
  <Box sx={{
    border: '1px solid', borderColor: COLORS.line, borderRadius: '8px',
    overflow: 'hidden', mb: 1.5, bgcolor: COLORS.bgSurface,
  }}>
    <Box sx={{
      display: 'flex', alignItems: 'center', gap: 1,
      px: 2.5, py: 1.75, borderBottom: '1px solid', borderColor: COLORS.line,
    }}>
      <Box sx={{ color: COLORS.accent, fontSize: 16, display: 'flex' }}>{icon}</Box>
      <Typography sx={{
        fontSize: 11, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace",
        textTransform: 'uppercase', letterSpacing: '0.08em', color: COLORS.textSecondary,
      }}>
        {title}
      </Typography>
    </Box>
    <Box sx={{ px: 2.5, py: 2 }}>{children}</Box>
  </Box>
);

const BulletList = ({ items }) => (
  <Box component="ul" sx={{ listStyle: 'none', p: 0, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
    {items?.map((item, i) => (
      <Box key={i} component="li" sx={{ display: 'flex', gap: 1.25 }}>
        <Box sx={{
          width: 6, height: 6, borderRadius: '50%',
          bgcolor: COLORS.accent, flexShrink: 0, mt: '7px',
        }} />
        <Typography sx={{ fontSize: 14, fontFamily: "'Inter', sans-serif", color: COLORS.textSecondary, lineHeight: 1.6 }}>
          {item}
        </Typography>
      </Box>
    ))}
  </Box>
);

const ActivityDetail = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const actRes = await getActivityDetail(id);
      setActivity(actRes.data);
    } catch (e) {
      console.error('Failed to fetch activity:', e);
      setError('Could not load this activity.');
    }

    try {
      const recRes = await getActivityRecommendation(id);
      setRecommendation(recRes.data);
    } catch (e) {
      // AI recommendations are optional - don't block the UI
      console.log('AI recommendations unavailable:', e.message);
    }

    setLoading(false);
  }, [id]);

  // Single fetch on mount - no auto-reload polling
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleManualRefresh = () => {
    fetchData();
  };

  if (loading) return (
    <Box sx={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, p: 6,
      bgcolor: COLORS.bgBase, minHeight: '100vh',
    }}>
      <CircularProgress size={26} sx={{ color: COLORS.accent }} />
      <Typography sx={{
        fontSize: 13, fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.textSecondary,
      }}>
        Loading activity…
      </Typography>
    </Box>
  );

  const date = activity ? new Date(activity.createdAt) : new Date();

  return (
    <Box sx={{ maxWidth: 760, mx: 'auto', p: 2, pb: 4, bgcolor: COLORS.bgBase, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Circle sx={{ fontSize: 8, color: COLORS.accent, filter: `drop-shadow(0 0 4px ${COLORS.accent})` }} />
          <Typography sx={{
            fontSize: 12, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.textSecondary,
          }}>
            one8pulse
          </Typography>
        </Box>

        <Box
          component="button"
          onClick={handleManualRefresh}
          aria-label="Refresh"
          title="Refresh"
          sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 34, height: 34, borderRadius: '8px',
            border: '1px solid', borderColor: COLORS.line, bgcolor: 'transparent', cursor: 'pointer',
            color: COLORS.textSecondary,
            transition: 'color 0.15s ease, border-color 0.15s ease',
            '&:hover': { color: COLORS.accent, borderColor: COLORS.accent },
            '&:focus-visible': { outline: `2px solid ${COLORS.lime}`, outlineOffset: '2px' },
          }}
        >
          <Refresh sx={{
            fontSize: 16,
            '@keyframes spin': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
            animation: loading ? 'spin 1s linear infinite' : 'none',
            '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
          }} />
        </Box>
      </Box>

      {error && (
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1,
          bgcolor: 'rgba(255,75,43,0.08)', border: '1px solid rgba(255,75,43,0.3)',
          borderRadius: '8px', p: '12px 14px', mb: 2,
        }}>
          <ErrorOutline sx={{ fontSize: 16, color: COLORS.errorText, flexShrink: 0 }} />
          <Typography sx={{ fontSize: 13, fontFamily: "'Inter', sans-serif", color: COLORS.errorText }}>
            {error}
          </Typography>
        </Box>
      )}

      {/* Stats */}
      {activity && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, mb: 2 }}>
          <StatCard
            icon={<FitnessCenter fontSize="inherit" />} label="Activity"
            value={activity.type} valueColor={LANE_COLORS[activity.type]}
          />
          <StatCard icon={<Schedule fontSize="inherit" />} label="Duration" value={activity.duration} unit="min" />
          <StatCard icon={<Whatshot fontSize="inherit" />} label="Calories" value={activity.caloriesBurned} unit="kcal" />
          <StatCard icon={<CalendarToday fontSize="inherit" />} label="Date"
            value={date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            subtext={date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
          />
        </Box>
      )}

      {recommendation && (
        <>
          <Section icon={<Psychology fontSize="inherit" />} title="Analysis">
            <Typography sx={{ fontSize: 14, fontFamily: "'Inter', sans-serif", color: COLORS.textSecondary, lineHeight: 1.65 }}>
              {recommendation.recommendation}
            </Typography>
          </Section>
          <Section icon={<TrendingUp fontSize="inherit" />} title="Improvements">
            <BulletList items={recommendation.improvements} />
          </Section>
          <Section icon={<Lightbulb fontSize="inherit" />} title="Suggestions">
            <BulletList items={recommendation.suggestions} />
          </Section>
          <Section icon={<Shield fontSize="inherit" />} title="Safety guidelines">
            <BulletList items={recommendation.safety} />
          </Section>
        </>
      )}
    </Box>
  );
};

export default ActivityDetail;