// src/components/activities/ActivityList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PoolIcon from '@mui/icons-material/Pool';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getActivities } from '../../services/api';

const ICON_MAP = {
  'RUNNING': <DirectionsRunIcon sx={{ fontSize: 26 }} />,
  'WALKING': <DirectionsRunIcon sx={{ fontSize: 26 }} />,
  'CYCLING': <DirectionsBikeIcon sx={{ fontSize: 26 }} />,
  'SWIMMING': <PoolIcon sx={{ fontSize: 26 }} />,
  'WEIGHT_TRAINING': <FitnessCenterIcon sx={{ fontSize: 26 }} />,
  'YOGA': <SelfImprovementIcon sx={{ fontSize: 26 }} />,
  'HIIT': <WhatshotIcon sx={{ fontSize: 26 }} />,
  'CARDIO': <WhatshotIcon sx={{ fontSize: 26 }} />,
  'STRETCHING': <SelfImprovementIcon sx={{ fontSize: 26 }} />,
  'OTHER': <FitnessCenterIcon sx={{ fontSize: 26 }} />,
};

const FILTERS = ['All', 'Running', 'Walking', 'Cycling', 'Swimming', 'Weight Training', 'Yoga', 'HIIT', 'Cardio'];

const ActivityCard = ({ activity, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const icon = ICON_MAP[activity.type] ?? <FitnessCenterIcon sx={{ fontSize: 26 }} />;
  const date = new Date(activity.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  return (
    <Box
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: hovered ? '#E24B4A40' : 'divider',
        borderRadius: '16px',
        p: 3,
        cursor: 'pointer',
        transform: hovered ? 'translateY(-2px)' : 'none',
        transition: 'border-color 0.15s, transform 0.12s',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
        <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#FCEBEB', color: '#A32D2D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </Box>
        <Typography sx={{ fontSize: 12, color: 'text.disabled' }}>{date}</Typography>
      </Box>

      <Typography sx={{ fontSize: 18, fontWeight: 500, mb: 2 }}>{activity.type}</Typography>

      <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px', bgcolor: 'action.hover', borderRadius: '8px', px: 1.25, py: '6px' }}>
          <ScheduleIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{activity.duration} min</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ fontSize: 12, fontWeight: 500, color: '#791F1F', bgcolor: '#FCEBEB', borderRadius: '24px', px: 1.5, py: '4px' }}>
          {activity.caloriesBurned} kcal
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 13, color: '#E24B4A' }}>
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
  const navigate = useNavigate();

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
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 6 }}>
      <CircularProgress size={24} sx={{ color: '#E24B4A' }} />
      <Typography sx={{ fontSize: 15, color: 'text.secondary' }}>Loading activities…</Typography>
    </Box>
  );

  return (
    <Box sx={{ p: '40px 48px', bgcolor: 'grey.50', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mb: 3.5 }}>
        <Box>
          <Typography sx={{ fontSize: 32, fontWeight: 500, lineHeight: 1 }}>Your activities</Typography>
          <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: '6px' }}>
            {filtered.length} session{filtered.length !== 1 ? 's' : ''} logged
          </Typography>
        </Box>
        <Box component="button" onClick={() => navigate('/activities/new')} sx={{
          display: 'flex', alignItems: 'center', gap: 1,
          px: '22px', py: '12px', borderRadius: '10px',
          fontSize: 14, fontWeight: 500, color: '#fff',
          bgcolor: '#E24B4A', border: 'none', cursor: 'pointer',
          '&:hover': { bgcolor: '#C93B3A' },
        }}>
          <AddIcon sx={{ fontSize: 18 }} /> Log activity
        </Box>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3.5 }}>
        {FILTERS.map(f => (
          <Box key={f} component="button" onClick={() => setActiveFilter(f)} sx={{
            px: '18px', py: '8px', borderRadius: '24px',
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
            border: '1px solid',
            borderColor: activeFilter === f ? '#E24B4A' : 'divider',
            bgcolor: activeFilter === f ? '#E24B4A' : 'background.paper',
            color: activeFilter === f ? '#fff' : 'text.secondary',
            transition: 'all 0.15s',
          }}>
            {f}
          </Box>
        ))}
      </Box>

      {error && (
        <Box sx={{ bgcolor: '#FCEBEB', border: '1px solid #F0959560', borderRadius: 2, px: 2, py: 1.5, mb: 3 }}>
          <Typography sx={{ fontSize: 14, color: '#791F1F' }}>{error}</Typography>
        </Box>
      )}

      {/* Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 2 }}>
        {filtered.map(a => (
          <ActivityCard key={a.id} activity={a} onClick={() => navigate(`/activities/${a.id}`)} />
        ))}
        {filtered.length === 0 && (
          <Box sx={{ gridColumn: '1/-1', textAlign: 'center', py: 8, color: 'text.disabled' }}>
            <Typography sx={{ fontSize: 16 }}>No activities found</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ActivityList;