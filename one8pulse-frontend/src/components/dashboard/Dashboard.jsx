// src/components/dashboard/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DirectionsRun,
  LocalFireDepartment,
  AccessTime,
  AddCircle,
  CalendarToday
} from '@mui/icons-material';
import { getActivities } from '../../services/api';
import { useTheme as useCustomTheme } from '../../context/ThemeContext';
import styles from '../../styles/dashboard/dashboard.module.css';

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
  const { mode } = useCustomTheme();

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

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeek = activities.filter(act => new Date(act.createdAt) >= oneWeekAgo).length;

    setStats({ totalWorkouts, totalCalories, totalDuration, thisWeek });
  };

  const getActivityColor = (type) => {
    const colors = {
      RUNNING: '#ff5a4d',
      WALKING: '#6ccb5f',
      CYCLING: '#4fa8ff',
      SWIMMING: '#38d6d2',
      WEIGHT_TRAINING: '#ffb23e',
      YOGA: '#c792ea',
      HIIT: '#ff3d71',
      CARDIO: '#ff8fb3',
      STRETCHING: '#5fe0c0',
      OTHER: '#8b92a0'
    };
    return colors[type] || '#8b92a0';
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const goToActivity = (id) => navigate(`/activities/${id}`);

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <p className={styles.loadingPulse}>Loading session data…</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.eyebrow}>Training log</div>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Here's how your training is going.</p>
      </div>

      {/* Scoreboard */}
      <div className={styles.scoreboard}>
        <div className={styles.statCell}>
          <div className={styles.statCellHead}>
            <DirectionsRun />
            <h3 className={styles.statLabel}>Sessions</h3>
          </div>
          <p className={styles.statValue}>{stats.totalWorkouts}</p>
          <p className={styles.statCaption}>Total logged</p>
        </div>

        <div className={styles.statCell}>
          <div className={styles.statCellHead}>
            <LocalFireDepartment />
            <h3 className={styles.statLabel}>Calories</h3>
          </div>
          <p className={styles.statValue}>{stats.totalCalories.toLocaleString()}</p>
          <p className={styles.statCaption}>Total burned</p>
        </div>

        <div className={styles.statCell}>
          <div className={styles.statCellHead}>
            <AccessTime />
            <h3 className={styles.statLabel}>Time</h3>
          </div>
          <p className={styles.statValue}>{formatDuration(stats.totalDuration)}</p>
          <p className={styles.statCaption}>Total trained</p>
        </div>

        <div className={styles.statCell}>
          <div className={styles.statCellHead}>
            <CalendarToday />
            <h3 className={styles.statLabel}>This week</h3>
          </div>
          <p className={`${styles.statValue} ${styles.statValueAccent}`}>{stats.thisWeek}</p>
          <p className={styles.statCaption}>Sessions completed</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className={styles.actions}>
        <button className={styles.primaryButton} onClick={() => navigate('/activities/new')}>
          <AddCircle sx={{ fontSize: 20 }} />
          Log a workout
        </button>
      </div>

      {/* Recent activities */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent sessions</h2>
          <button className={styles.textButton} onClick={() => navigate('/activities')}>
            View all
          </button>
        </div>

        {activities.length === 0 ? (
          <div className={styles.emptyCard}>
            <p className={styles.emptyText}>Nothing logged yet.</p>
            <button className={styles.primaryButton} onClick={() => navigate('/activities/new')}>
              Log your first workout
            </button>
          </div>
        ) : (
          <div className={styles.sessionsGrid}>
            {activities.slice(0, 6).map((activity) => (
              <div
                key={activity.id}
                className={styles.sessionCard}
                style={{ borderLeftColor: getActivityColor(activity.type) }}
                role="button"
                tabIndex={0}
                onClick={() => goToActivity(activity.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    goToActivity(activity.id);
                  }
                }}
              >
                <div className={styles.sessionTop}>
                  <span
                    className={styles.sessionType}
                    style={{ color: getActivityColor(activity.type) }}
                  >
                    {activity.type}
                  </span>
                  <span className={styles.sessionDate}>
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className={styles.sessionMetrics}>
                  <span className={styles.metric}>
                    <AccessTime sx={{ fontSize: 16 }} />
                    {activity.duration}m
                  </span>
                  <span className={styles.metric}>
                    <LocalFireDepartment sx={{ fontSize: 16 }} />
                    {activity.caloriesBurned} cal
                  </span>
                </div>

                {activity.additionalMetrics && (
                  <div className={styles.extraMetrics}>
                    {Object.entries(activity.additionalMetrics).slice(0, 2).map(([key, value]) => (
                      <span key={key} className={styles.extraMetric}>
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;