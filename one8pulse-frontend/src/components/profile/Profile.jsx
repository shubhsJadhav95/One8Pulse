// src/components/profile/Profile.jsx
import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Avatar, Button, TextField, Grid } from '@mui/material';
import { Person, Email, Edit } from '@mui/icons-material';
import { authService } from '../../services/authService';

const Profile = () => {
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
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography>Loading profile...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 4 }}>
        Profile
      </Typography>

      <Card sx={{ borderRadius: '16px', mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: '#E24B4A', fontSize: 32 }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {user.name || 'User'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
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
                InputProps={{ startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} /> }}
              />
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                disabled
                InputProps={{ startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} /> }}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  sx={{ bgcolor: '#E24B4A', '&:hover': { bgcolor: '#C93B3A' } }}
                >
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => setIsEditing(true)}
                sx={{ bgcolor: '#E24B4A', '&:hover': { bgcolor: '#C93B3A' } }}
              >
                Edit Profile
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: '16px' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Account Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                User ID
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                {user.userId || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">
                {user.email}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
