// src/components/dashboard/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, Chip } from '@mui/material';
import { 
  DirectionsRun, 
  LocalFireDepartment, 
  AccessTime, 
  TrendingUp,
  AddCircle,
  CalendarToday
} from '@mui/icons-material';
import { getActivities } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalCalories: 0,
    totalDuration: 0,
    thisWeek: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await getActivities();
      setActivities(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (activities) => {
    const totalWorkouts = activities.length;
    const totalCalories = activities.reduce((sum, act) => sum + (act.caloriesBurned || 0), 0);
    const totalDuration = activities.reduce((sum, act) => sum + (act.duration || 0), 0);
    
    // Calculate this week's workouts
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeek = activities.filter(act => new Date(act.createdAt) >= oneWeekAgo).length;

    setStats({ totalWorkouts, totalCalories, totalDuration, thisWeek });
  };

  const getActivityColor = (type) => {
    const colors = {
      RUNNING: '#E24B4A',
      WALKING: '#4CAF50',
      CYCLING: '#2196F3',
      SWIMMING: '#00BCD4',
      WEIGHT_TRAINING: '#FF9800',
      YOGA: '#9C27B0',
      HIIT: '#F44336',
      CARDIO: '#E91E63',
      STRETCHING: '#009688',
      OTHER: '#607D8B'
    };
    return colors[type] || '#607D8B';
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Welcome back! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's your fitness overview
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            bgcolor: 'linear-gradient(135deg, #E24B4A 0%, #C93B3A 100%)',
            color: 'white',
            borderRadius: '16px'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DirectionsRun sx={{ fontSize: 32, mr: 1 }} />
                <Typography variant="h6">Workouts</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {stats.totalWorkouts}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Total sessions
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            bgcolor: 'linear-gradient(135deg, #FF6B6B 0%, #EE5A5A 100%)',
            color: 'white',
            borderRadius: '16px'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalFireDepartment sx={{ fontSize: 32, mr: 1 }} />
                <Typography variant="h6">Calories</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {stats.totalCalories.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Total burned
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            bgcolor: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
            color: 'white',
            borderRadius: '16px'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTime sx={{ fontSize: 32, mr: 1 }} />
                <Typography variant="h6">Duration</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {formatDuration(stats.totalDuration)}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Total time
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '16px'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarToday sx={{ fontSize: 32, mr: 1 }} />
                <Typography variant="h6">This Week</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {stats.thisWeek}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Workouts completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<AddCircle />}
          onClick={() => navigate('/activities/new')}
          sx={{
            bgcolor: '#E24B4A',
            '&:hover': { bgcolor: '#C93B3A' },
            py: 1.5,
            px: 3,
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: 600
          }}
        >
          Log New Workout
        </Button>
      </Box>

      {/* Recent Activities */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Recent Activities
          </Typography>
          <Button 
            onClick={() => navigate('/activities')}
            sx={{ color: '#E24B4A', fontWeight: 600 }}
          >
            View All
          </Button>
        </Box>

        {activities.length === 0 ? (
          <Card sx={{ borderRadius: '16px', p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              No activities yet
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/activities/new')}
              sx={{ bgcolor: '#E24B4A' }}
            >
              Start Your First Workout
            </Button>
          </Card>
        ) : (
          <Grid container spacing={2}>
            {activities.slice(0, 6).map((activity) => (
              <Grid item xs={12} sm={6} md={4} key={activity.id}>
                <Card 
                  sx={{ 
                    borderRadius: '16px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                    }
                  }}
                  onClick={() => navigate(`/activities/${activity.id}`)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Chip 
                        label={activity.type}
                        sx={{ 
                          bgcolor: `${getActivityColor(activity.type)}20`,
                          color: getActivityColor(activity.type),
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {activity.duration}m
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocalFireDepartment sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {activity.caloriesBurned} cal
                        </Typography>
                      </Box>
                    </Box>

                    {activity.additionalMetrics && (
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {Object.entries(activity.additionalMetrics).slice(0, 2).map(([key, value]) => (
                          <Typography key={key} variant="caption" color="text.secondary">
                            {key}: {value}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
