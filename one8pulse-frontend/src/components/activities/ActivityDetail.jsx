// src/components/activities/ActivityDetail.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import {
  FitnessCenter, Whatshot, Schedule, CalendarToday,
  Psychology, TrendingUp, Lightbulb, Shield,
  Refresh, ErrorOutline, Circle
} from '@mui/icons-material';
import { getActivityDetail, getActivityRecommendation } from '../../services/api';

const RELOAD_INTERVAL = 10;
const MAX_RETRIES = 5;
const RETRY_DELAY = 3000;

const StatCard = ({ icon, label, value, unit, subtext }) => (
  <Box sx={{
    background: 'action.hover', bgcolor: 'action.hover',
    borderRadius: 2, p: '14px 16px', flex: '1 1 130px'
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px', mb: '6px' }}>
      <Box sx={{ fontSize: 13, color: 'text.disabled' }}>{icon}</Box>
      <Typography sx={{ fontSize: 11, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        {label}
      </Typography>
    </Box>
    <Typography sx={{ fontSize: typeof value === 'string' && value.length > 6 ? 15 : 22, fontWeight: 500 }}>
      {value}{unit && <Box component="span" sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 400, ml: '2px' }}>{unit}</Box>}
    </Typography>
    {subtext && <Typography sx={{ fontSize: 12, color: 'text.disabled', mt: '2px' }}>{subtext}</Typography>}
  </Box>
);

const Section = ({ icon, title, children }) => (
  <Box sx={{
    border: '0.5px solid', borderColor: 'divider',
    borderRadius: 3, overflow: 'hidden', mb: 1.5
  }}>
    <Box sx={{
      display: 'flex', alignItems: 'center', gap: 1,
      px: 2.5, py: 1.75, borderBottom: '0.5px solid', borderColor: 'divider'
    }}>
      <Box sx={{ color: '#E24B4A', fontSize: 16 }}>{icon}</Box>
      <Typography sx={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
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
          background: '#E24B4A', flexShrink: 0, mt: '7px'
        }} />
        <Typography sx={{ fontSize: 14, color: 'text.secondary', lineHeight: 1.6 }}>{item}</Typography>
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
  const [countdown, setCountdown] = useState(RELOAD_INTERVAL);
  const [progress, setProgress] = useState(100);
  const retryRef = useRef(0);
  const intervalRef = useRef(null);
  const countdownRef = useRef(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    retryRef.current = 0;

    try {
      const actRes = await getActivityDetail(id);
      setActivity(actRes.data);
    } catch (e) {
      console.error('Failed to fetch activity:', e);
    }

    const tryRec = async () => {
      try {
        const recRes = await getActivityRecommendation(id);
        setRecommendation(recRes.data);
      } catch (e) {
        // AI recommendations are optional - don't block the UI
        console.log('AI recommendations unavailable:', e.message);
      }
      setLoading(false);
    };
    tryRec();
  }, [id]);

  const startCountdown = useCallback(() => {
    clearInterval(intervalRef.current);
    clearInterval(countdownRef.current);
    setCountdown(RELOAD_INTERVAL);
    setProgress(100);
    let t = RELOAD_INTERVAL;

    countdownRef.current = setInterval(() => {
      t -= 1;
      setCountdown(t);
      setProgress((t / RELOAD_INTERVAL) * 100);
      if (t <= 0) {
        clearInterval(countdownRef.current);
        fetchData().then(startCountdown);
      }
    }, 1000);
  }, [fetchData]);

  useEffect(() => {
    fetchData().then(startCountdown);
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(countdownRef.current);
    };
  }, [fetchData, startCountdown]);

  const handleManualRefresh = () => {
    clearInterval(countdownRef.current);
    fetchData().then(startCountdown);
  };

  if (loading) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, p: 6 }}>
      <CircularProgress size={28} sx={{ color: '#E24B4A' }} />
      <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
        Fetching AI recommendation{retryRef.current > 0 ? ` · attempt ${retryRef.current + 1} of ${MAX_RETRIES}` : '…'}
      </Typography>
    </Box>
  );

  const date = activity ? new Date(activity.createdAt) : new Date();

  return (
    <Box sx={{ maxWidth: 760, mx: 'auto', p: 2, pb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Circle sx={{ fontSize: 10, color: '#E24B4A' }} />
          <Typography sx={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            one8pulse
          </Typography>
        </Box>
        <Box sx={{ position: 'relative', cursor: 'pointer' }} onClick={handleManualRefresh}>
          <CircularProgress variant="determinate" value={progress} size={36}
            sx={{ color: '#E24B4A', position: 'absolute', top: 0, left: 0 }} />
          <CircularProgress variant="determinate" value={100} size={36}
            sx={{ color: 'divider', position: 'absolute', top: 0, left: 0 }} />
          <Box sx={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Refresh sx={{ fontSize: 16, color: 'text.secondary' }} />
          </Box>
        </Box>
      </Box>

      {/* Progress bar */}
      <Box sx={{ height: 2, bgcolor: 'divider', borderRadius: 1, mb: 2, overflow: 'hidden' }}>
        <Box sx={{
          height: '100%', bgcolor: '#E24B4A', borderRadius: 1,
          width: `${progress}%`, transition: 'width 1s linear'
        }} />
      </Box>

      {error && (
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1,
          bgcolor: '#FCEBEB', border: '0.5px solid #F0959580',
          borderRadius: 2, p: '12px 14px', mb: 2
        }}>
          <ErrorOutline sx={{ fontSize: 16, color: '#A32D2D', flexShrink: 0 }} />
          <Typography sx={{ fontSize: 13, color: '#A32D2D' }}>{error}</Typography>
        </Box>
      )}

      {/* Stats */}
      {activity && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, mb: 2 }}>
          <StatCard icon={<FitnessCenter fontSize="inherit" />} label="Activity" value={activity.type} />
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
            <Typography sx={{ fontSize: 14, color: 'text.secondary', lineHeight: 1.65 }}>
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