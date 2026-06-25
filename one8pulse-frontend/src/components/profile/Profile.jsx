// src/components/profile/Profile.jsx
import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Avatar, Button, TextField, Grid, CircularProgress, useTheme, useMediaQuery } from '@mui/material';
import { Person, Email, Edit } from '@mui/icons-material';
import { authService } from '../../services/authService';
import { useTheme as useCustomTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

// Shared design tokens (same palette as Dashboard/Navbar/ActivityList/ActivityForm/ActivityDetail)
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

const cardSx = {
  borderRadius: '10px',
  mb: 4,
  bgcolor: COLORS.bgSurface,
  border: '1px solid',
  borderColor: COLORS.line,
  boxShadow: 'none',
};

const labelSx = {
  fontSize: 11,
  fontWeight: 600,
  fontFamily: "'JetBrains Mono', monospace",
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: COLORS.textSecondary,
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
  '& .MuiInputLabel-root': { color: COLORS.textSecondary, fontFamily: "'Inter', sans-serif" },
  '& .MuiInputLabel-root.Mui-focused': { color: COLORS.accent },
  '& .Mui-disabled': { color: `${COLORS.textTertiary} !important`, WebkitTextFillColor: COLORS.textTertiary },
};

const focusRingSx = {
  '&.Mui-focusVisible': { outline: `2px solid ${COLORS.lime}`, outlineOffset: '2px' },
};

const primaryButtonSx = {
  bgcolor: COLORS.accent,
  color: COLORS.bgBase,
  borderRadius: '6px',
  textTransform: 'none',
  fontWeight: 600,
  fontFamily: "'Inter', sans-serif",
  boxShadow: 'none',
  '&:hover': { bgcolor: COLORS.accentStrong, boxShadow: 'none' },
  ...focusRingSx,
};

const outlinedButtonSx = {
  borderColor: COLORS.line,
  color: COLORS.textSecondary,
  borderRadius: '6px',
  textTransform: 'none',
  fontWeight: 600,
  fontFamily: "'Inter', sans-serif",
  '&:hover': { borderColor: COLORS.textSecondary, bgcolor: 'rgba(255,255,255,0.04)' },
  ...focusRingSx,
};

const Profile = () => {
  const theme = useTheme();
  const { mode } = useCustomTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setFormData({ name: currentUser.name || '', email: currentUser.email || '' });
    }
  }, []);

  const handleSave = () => {
    setUser({ ...user, ...formData });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2,
        mt: 4, bgcolor: COLORS.bgBase, minHeight: '100vh',
      }}>
        <CircularProgress size={22} sx={{ color: COLORS.accent }} />
        <Typography sx={{
          fontSize: 13, fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.06em', textTransform: 'uppercase', color: COLORS.textSecondary,
        }}>
          Loading profile…
        </Typography>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, md: 3 }, bgcolor: COLORS.bgBase, minHeight: '100vh' }}>
        <Typography sx={{ ...labelSx, mb: 1.5 }}>Account</Typography>
        <Typography sx={{
          fontSize: { xs: 24, md: 28 }, fontWeight: 600, fontFamily: "'Oswald', sans-serif",
          letterSpacing: '-0.01em', color: COLORS.textPrimary, mb: 4,
        }}>
          Profile
      </Typography>

      <Card sx={cardSx}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: COLORS.accent, color: COLORS.bgBase, fontSize: 32, fontWeight: 700 }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: 20, fontWeight: 600, fontFamily: "'Inter', sans-serif", color: COLORS.textPrimary }}>
                {user.name || 'User'}
              </Typography>
              <Typography sx={{ fontSize: 14, fontFamily: "'Inter', sans-serif", color: COLORS.textSecondary }}>
                {user.email}
              </Typography>
            </Box>
          </Box>

          {isEditing ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                InputProps={{ startAdornment: <Person sx={{ mr: 1, color: COLORS.textSecondary, fontSize: 20 }} /> }}
                sx={fieldSx}
              />
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                disabled
                InputProps={{ startAdornment: <Email sx={{ mr: 1, color: COLORS.textSecondary, fontSize: 20 }} /> }}
                sx={fieldSx}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" onClick={handleSave} sx={primaryButtonSx}>
                  Save changes
                </Button>
                <Button variant="outlined" onClick={() => setIsEditing(false)} sx={outlinedButtonSx}>
                  Cancel
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Edit sx={{ fontSize: 16 }} />}
                onClick={() => setIsEditing(true)}
                sx={primaryButtonSx}
              >
                Edit profile
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      <Card sx={{ ...cardSx, mb: 0 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography sx={{ ...labelSx, mb: 3 }}>Account information</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ ...labelSx, fontSize: 11, mb: '6px' }}>User ID</Typography>
              <Typography sx={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: COLORS.textPrimary }}>
                {user.userId || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography sx={{ ...labelSx, fontSize: 11, mb: '6px' }}>Email</Typography>
              <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: COLORS.textPrimary }}>
                {user.email}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
    </motion.div>
  );
};

export default Profile;