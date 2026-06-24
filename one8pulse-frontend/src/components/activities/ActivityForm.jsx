// src/components/activities/ActivityForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, TextField, Chip, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
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
import { addActivity } from '../../services/api';

const ACTIVITY_TYPES = [
    { value: 'RUNNING', label: 'Running', icon: <DirectionsRunIcon /> },
    { value: 'WALKING', label: 'Walking', icon: <DirectionsWalkIcon /> },
    { value: 'CYCLING', label: 'Cycling', icon: <DirectionsBikeIcon /> },
    { value: 'SWIMMING', label: 'Swimming', icon: <PoolIcon /> },
    { value: 'WEIGHT_TRAINING', label: 'Weight Training', icon: <FitnessCenterIcon /> },
    { value: 'YOGA', label: 'Yoga', icon: <SelfImprovementIcon /> },
    { value: 'HIIT', label: 'HIIT', icon: <WhatshotIcon /> },
    { value: 'CARDIO', label: 'Cardio', icon: <FavoriteIcon /> },
    { value: 'STRETCHING', label: 'Stretching', icon: <AccessTimeIcon /> },
    { value: 'OTHER', label: 'Other', icon: <AutoAwesomeIcon /> },
];

const METRIC_OPTIONS = [
    { key: 'avgHeartRate', label: 'Avg heart rate', icon: <FavoriteIcon sx={{ fontSize: 15 }} />, unit: 'bpm' },
    { key: 'distance', label: 'Distance', icon: <StraightenIcon sx={{ fontSize: 15 }} />, unit: 'km' },
    { key: 'avgPace', label: 'Avg pace', icon: <SpeedIcon sx={{ fontSize: 15 }} />, unit: 'min/km' },
    { key: 'elevationGain', label: 'Elevation gain', icon: <LandscapeIcon sx={{ fontSize: 15 }} />, unit: 'm' },
];

const ActivityForm = ({ onActivityAdded }) => {
    const navigate = useNavigate();
    const [type, setType] = useState('RUNNING');
    const [duration, setDuration] = useState('');
    const [caloriesBurned, setCaloriesBurned] = useState('');
    const [startTime, setStartTime] = useState(new Date().toISOString().slice(0, 16));
    const [selectedMetrics, setSelectedMetrics] = useState([]);
    const [metricValues, setMetricValues] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const toggleMetric = (key) => {
        setSelectedMetrics(prev =>
            prev.includes(key) ? prev.filter(m => m !== key) : [...prev, key]
        );
    };

    const handleReset = () => {
        setType('RUNNING');
        setDuration('');
        setCaloriesBurned('');
        setStartTime(new Date().toISOString().slice(0, 16));
        setSelectedMetrics([]);
        setMetricValues({});
        setError('');
    };

    const handleSubmit = async () => {
        if (!duration || !caloriesBurned) {
            setError('Please fill in duration and calories.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const additionalMetrics = {};
            selectedMetrics.forEach(key => {
                if (metricValues[key]) additionalMetrics[key] = metricValues[key];
            });
            await addActivity({ 
                type, 
                duration: Number(duration), 
                caloriesBurned: Number(caloriesBurned),
                startTime: new Date(startTime).toISOString(),
                additionalMetrics 
            });
            if (onActivityAdded) {
                onActivityAdded();
            } else {
                navigate('/dashboard');
            }
            handleReset();
        } catch (err) {
            setError('Failed to save activity. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            maxWidth: 520,
            mx: 'auto',
            mb: 4,
            border: '0.5px solid',
            borderColor: 'divider',
            borderRadius: 3,
            overflow: 'hidden',
            bgcolor: 'background.paper',
        }}>
            {/* Header */}
            <Box sx={{ px: 3, py: 2.5, borderBottom: '0.5px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AutoAwesomeIcon sx={{ fontSize: 18 }} />
                </Box>
                <Box>
                    <Typography variant="body1" fontWeight={500}>Log activity</Typography>
                    <Typography variant="caption" color="text.secondary">Track your workout and get AI recommendations</Typography>
                </Box>
            </Box>

            {/* Body */}
            <Box sx={{ px: 3, py: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>

                {/* Activity type */}
                <Box>
                    <Typography variant="caption" fontWeight={500} color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        Activity type
                    </Typography>
                    <FormControl fullWidth size="small">
                        <Select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            sx={{ borderRadius: 2 }}
                        >
                            {ACTIVITY_TYPES.map(({ value, label, icon }) => (
                                <MenuItem key={value} value={value}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {icon}
                                        {label}
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* Start Time */}
                <Box>
                    <Typography variant="caption" fontWeight={500} color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        Start Time
                    </Typography>
                    <TextField
                        fullWidth
                        size="small"
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ borderRadius: 2 }}
                    />
                </Box>

                {/* Duration + Calories */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                    <Box>
                        <Typography variant="caption" fontWeight={500} color="text.secondary" sx={{ mb: 1, display: 'block' }}>Duration</Typography>
                        <TextField
                            fullWidth size="small" type="number" placeholder="45"
                            value={duration} onChange={e => setDuration(e.target.value)}
                            InputProps={{ endAdornment: <Typography variant="caption" color="text.disabled">min</Typography> }}
                        />
                    </Box>
                    <Box>
                        <Typography variant="caption" fontWeight={500} color="text.secondary" sx={{ mb: 1, display: 'block' }}>Calories burned</Typography>
                        <TextField
                            fullWidth size="small" type="number" placeholder="320"
                            value={caloriesBurned} onChange={e => setCaloriesBurned(e.target.value)}
                            InputProps={{ endAdornment: <Typography variant="caption" color="text.disabled">kcal</Typography> }}
                        />
                    </Box>
                </Box>

                {/* Additional metrics */}
                <Box>
                    <Typography variant="caption" fontWeight={500} color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        Additional metrics <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional)</span>
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                        {METRIC_OPTIONS.map(({ key, label, icon }) => (
                            <Chip
                                key={key}
                                icon={icon}
                                label={label}
                                onClick={() => toggleMetric(key)}
                                variant={selectedMetrics.includes(key) ? 'filled' : 'outlined'}
                                size="small"
                                sx={{
                                    justifyContent: 'flex-start', px: 0.5, height: 34,
                                    borderRadius: 2, fontSize: 12, cursor: 'pointer',
                                    bgcolor: selectedMetrics.includes(key) ? 'action.selected' : 'transparent',
                                    borderColor: selectedMetrics.includes(key) ? 'text.primary' : 'divider',
                                }}
                            />
                        ))}
                    </Box>

                    {/* Metric value inputs */}
                    {selectedMetrics.length > 0 && (
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 1.5 }}>
                            {selectedMetrics.map(key => {
                                const metric = METRIC_OPTIONS.find(m => m.key === key);
                                return (
                                    <TextField
                                        key={key} size="small" type="number"
                                        label={metric.label} placeholder="0"
                                        value={metricValues[key] || ''}
                                        onChange={e => setMetricValues(prev => ({ ...prev, [key]: e.target.value }))}
                                        InputProps={{ endAdornment: <Typography variant="caption" color="text.disabled">{metric.unit}</Typography> }}
                                    />
                                );
                            })}
                        </Box>
                    )}
                </Box>

                {error && (
                    <Typography variant="caption" color="error">{error}</Typography>
                )}
            </Box>

            {/* Footer */}
            <Box sx={{ px: 3, py: 2, borderTop: '0.5px solid', borderColor: 'divider', display: 'flex', gap: 1.5 }}>
                <Button variant="outlined" size="small" onClick={handleReset} sx={{ borderColor: 'divider', color: 'text.secondary', borderRadius: 2 }}>
                    Clear
                </Button>
                <Button
                    fullWidth variant="contained" size="medium" onClick={handleSubmit} disabled={loading}
                    startIcon={<AutoAwesomeIcon sx={{ fontSize: 16 }} />}
                    sx={{ borderRadius: 2, fontWeight: 500, textTransform: 'none', boxShadow: 'none' }}
                >
                    {loading ? 'Saving...' : 'Save & get recommendations'}
                </Button>
            </Box>
        </Box>
    );
};

export default ActivityForm;