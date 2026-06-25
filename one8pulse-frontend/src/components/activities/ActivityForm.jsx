// src/components/activities/ActivityForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, TextField, Chip, Grid, MenuItem, Select, InputLabel, FormControl, useTheme, useMediaQuery } from '@mui/material';
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
import { useTheme as useCustomTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

// Shared design tokens (same palette as Dashboard/Navbar/ActivityList)
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
    errorText: '#ff6b6b',
};

// Same lane-color mapping used across the app, here for tinting the type-select icons
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

// Shared style fragments so every field follows the same dark-input treatment
const labelSx = {
    fontSize: 11,
    fontWeight: 600,
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: COLORS.textSecondary,
    mb: 1,
    display: 'block',
};

const fieldSx = {
    '& .MuiOutlinedInput-root': {
        bgcolor: COLORS.bgSurfaceHover,
        borderRadius: '6px',
        color: COLORS.textPrimary,
        fontFamily: "'Inter', sans-serif",
        '& fieldset': { borderColor: COLORS.line },
        '&:hover fieldset': { borderColor: COLORS.textSecondary },
        '&.Mui-focused fieldset': { borderColor: COLORS.accent },
    },
    '& .MuiInputBase-input': { color: COLORS.textPrimary },
    '& .MuiInputBase-input::placeholder': { color: COLORS.textTertiary, opacity: 1 },
    '& input[type="datetime-local"]::-webkit-calendar-picker-indicator': { filter: 'invert(0.8)' },
};

const unitSx = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: COLORS.textTertiary,
};

const focusRingSx = {
    '&.Mui-focusVisible': { outline: `2px solid ${COLORS.lime}`, outlineOffset: '2px' },
};

const ActivityForm = ({ onActivityAdded }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { mode } = useCustomTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Box sx={{
                maxWidth: { xs: '100%', md: 520 },
                mx: 'auto',
                mb: 4,
                border: '1px solid',
                borderColor: COLORS.line,
                borderRadius: '10px',
                overflow: 'hidden',
                bgcolor: COLORS.bgSurface,
            }}>
            {/* Header */}
            <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid', borderColor: COLORS.line, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{
                    width: 36, height: 36, borderRadius: '8px',
                    bgcolor: `${COLORS.accent}1a`, color: COLORS.accent,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <AutoAwesomeIcon sx={{ fontSize: 18 }} />
                </Box>
                <Box>
                    <Typography sx={{ fontSize: 15, fontWeight: 600, fontFamily: "'Inter', sans-serif", color: COLORS.textPrimary }}>
                        Log activity
                    </Typography>
                    <Typography sx={{ fontSize: 12, fontFamily: "'Inter', sans-serif", color: COLORS.textSecondary }}>
                        Track your workout and get AI recommendations
                    </Typography>
                </Box>
            </Box>

            {/* Body */}
            <Box sx={{ px: 3, py: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>

                {/* Activity type */}
                <Box>
                    <Typography component="span" sx={labelSx}>Activity type</Typography>
                    <FormControl fullWidth size="small">
                        <Select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            sx={{
                                bgcolor: COLORS.bgSurfaceHover,
                                borderRadius: '6px',
                                color: COLORS.textPrimary,
                                fontFamily: "'Inter', sans-serif",
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.line },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.textSecondary },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: COLORS.accent },
                                '& .MuiSelect-icon': { color: COLORS.textSecondary },
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        bgcolor: COLORS.bgSurfaceHover,
                                        border: `1px solid ${COLORS.line}`,
                                        mt: 0.5,
                                    },
                                },
                            }}
                        >
                            {ACTIVITY_TYPES.map(({ value, label, icon }) => (
                                <MenuItem
                                    key={value}
                                    value={value}
                                    sx={{
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: 14,
                                        color: COLORS.textPrimary,
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                                        '&.Mui-selected': {
                                            bgcolor: `${COLORS.accent}1a`,
                                            color: COLORS.accent,
                                            '&:hover': { bgcolor: `${COLORS.accent}26` },
                                        },
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{ display: 'flex', color: LANE_COLORS[value] }}>{icon}</Box>
                                        {label}
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* Start time */}
                <Box>
                    <Typography component="span" sx={labelSx}>Start time</Typography>
                    <TextField
                        fullWidth
                        size="small"
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={fieldSx}
                    />
                </Box>

                {/* Duration + Calories */}
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

                {/* Additional metrics */}
                <Box>
                    <Typography component="span" sx={labelSx}>
                        Additional metrics <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: COLORS.textTertiary }}>(optional)</span>
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                        {METRIC_OPTIONS.map(({ key, label, icon }) => {
                            const selected = selectedMetrics.includes(key);
                            return (
                                <Chip
                                    key={key}
                                    icon={icon}
                                    label={label}
                                    onClick={() => toggleMetric(key)}
                                    variant={selected ? 'filled' : 'outlined'}
                                    size="small"
                                    sx={{
                                        justifyContent: 'flex-start', px: 0.5, height: 34,
                                        borderRadius: '6px', fontSize: 12, cursor: 'pointer',
                                        fontFamily: "'Inter', sans-serif",
                                        bgcolor: selected ? `${COLORS.accent}1a` : 'transparent',
                                        borderColor: selected ? COLORS.accent : COLORS.line,
                                        color: selected ? COLORS.accent : COLORS.textSecondary,
                                        '& .MuiChip-icon': { color: selected ? COLORS.accent : COLORS.textSecondary },
                                        '&:hover': { borderColor: selected ? COLORS.accent : COLORS.textSecondary },
                                        ...focusRingSx,
                                    }}
                                />
                            );
                        })}
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
                                        InputProps={{ endAdornment: <Typography sx={unitSx}>{metric.unit}</Typography> }}
                                        sx={{
                                            ...fieldSx,
                                            '& .MuiInputLabel-root': { color: COLORS.textSecondary, fontFamily: "'Inter', sans-serif" },
                                            '& .MuiInputLabel-root.Mui-focused': { color: COLORS.accent },
                                        }}
                                    />
                                );
                            })}
                        </Box>
                    )}
                </Box>

                {error && (
                    <Typography sx={{ fontSize: 12, fontFamily: "'Inter', sans-serif", color: COLORS.errorText }}>
                        {error}
                    </Typography>
                )}
            </Box>

            {/* Footer */}
            <Box sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: COLORS.line, display: 'flex', gap: 1.5 }}>
                <Button
                    variant="outlined" size="small" onClick={handleReset}
                    sx={{
                        borderColor: COLORS.line, color: COLORS.textSecondary, borderRadius: '6px',
                        fontFamily: "'Inter', sans-serif", textTransform: 'none', fontWeight: 600,
                        '&:hover': { borderColor: COLORS.textSecondary, bgcolor: 'rgba(255,255,255,0.04)' },
                        ...focusRingSx,
                    }}
                >
                    Clear
                </Button>
                <Button
                    fullWidth variant="contained" size="medium" onClick={handleSubmit} disabled={loading}
                    startIcon={<AutoAwesomeIcon sx={{ fontSize: 16 }} />}
                    sx={{
                        borderRadius: '6px', fontWeight: 600, textTransform: 'none', boxShadow: 'none',
                        fontFamily: "'Inter', sans-serif",
                        bgcolor: COLORS.accent, color: COLORS.bgBase,
                        '&:hover': { bgcolor: COLORS.accentStrong, boxShadow: 'none' },
                        '&.Mui-disabled': { bgcolor: COLORS.bgSurfaceHover, color: COLORS.textTertiary },
                        ...focusRingSx,
                    }}
                >
                    {loading ? 'Saving...' : 'Save & get recommendations'}
                </Button>
            </Box>
        </Box>
        </motion.div>
    );
};

export default ActivityForm;