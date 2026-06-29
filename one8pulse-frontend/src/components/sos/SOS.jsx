import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar
} from '@mui/material';
import {
  Emergency,
  LocalHospital,
  Phone,
  Email,
  Person,
  Add,
  LocationOn,
  Directions,
  Close,
  NotificationsActive
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import {
  triggerSOS,
  getNearbyHospitals,
  addEmergencyContact,
  getEmergencyContacts,
  getSOSAlerts,
  markSOSAlertsRead
} from '../../services/api';

const SOS = () => {
  const { isDarkMode } = useTheme();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [openContactDialog, setOpenContactDialog] = useState(false);
  const [openHospitalDialog, setOpenHospitalDialog] = useState(false);
  const [newContact, setNewContact] = useState({
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  });

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      loadEmergencyContacts();
      loadSOSAlerts();
    }
  }, [userId]);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  const handleTriggerSOS = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const currentLocation = await getCurrentLocation();
      setLocation(currentLocation);

      const response = await triggerSOS({
        userId: userId,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        locationUrl: `https://www.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`
      });

      setSuccess('SOS Alert triggered successfully! Emergency contacts have been notified.');
      setHospitals(response.data.nearbyHospitals || []);
      setOpenHospitalDialog(true);

      // Reload alerts after triggering
      setTimeout(() => loadSOSAlerts(), 2000);
    } catch (err) {
      if (err.response?.status === 503) {
        setError('SOS service is currently unavailable. Please ensure the backend service is running.');
      } else {
        setError(err.response?.data?.message || 'Failed to trigger SOS. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadEmergencyContacts = async () => {
    try {
      const response = await getEmergencyContacts(userId);
      setContacts(response.data || []);
    } catch (err) {
      console.error('Failed to load emergency contacts:', err);
    }
  };

  const loadSOSAlerts = async () => {
    try {
      const response = await getSOSAlerts(userId);
      setAlerts(response.data || []);
    } catch (err) {
      console.error('Failed to load SOS alerts:', err);
    }
  };

  const handleAddContact = async () => {
    try {
      console.log('Current userId from localStorage:', userId);
      if (!userId) {
        setError('Invalid user ID. Please log in again.');
        return;
      }
      await addEmergencyContact({
        userId: userId,
        ...newContact
      });
      setSuccess('Emergency contact added successfully!');
      setOpenContactDialog(false);
      setNewContact({ contactName: '', contactEmail: '', contactPhone: '' });
      loadEmergencyContacts();
    } catch (err) {
      if (err.response?.status === 503) {
        setError('SOS service is currently unavailable. Please ensure the backend service is running.');
      } else {
        setError(err.response?.data?.message || 'Failed to add emergency contact.');
      }
    }
  };

  const handleMarkAsRead = async () => {
    try {
      await markSOSAlertsRead(userId);
      loadSOSAlerts();
    } catch (err) {
      console.error('Failed to mark alerts as read:', err);
    }
  };

  const openHospitalInMaps = (hospital) => {
    window.open(hospital.googleMapsUrl, '_blank');
  };

  const getDirections = (hospital) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`, '_blank');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Emergency SOS
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
          Quick access to emergency services and nearby hospitals
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* SOS Trigger Button */}
        <Card
          sx={{
            mb: 4,
            background: isDarkMode ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)' : 'linear-gradient(135deg, #fff5f5 0%, #ffebee 100%)',
            border: '2px solid #ef5350'
          }}
        >
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={handleTriggerSOS}
                disabled={loading}
                sx={{
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ef5350 0%, #c62828 100%)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  boxShadow: '0 8px 32px rgba(239, 83, 80, 0.4)',
                  '&:hover': {
                    boxShadow: '0 12px 40px rgba(239, 83, 80, 0.6)',
                  },
                  '&:disabled': {
                    background: '#bdbdbd',
                  }
                }}
              >
                {loading ? <CircularProgress color="inherit" size={60} /> : 'SOS'}
              </Button>
            </motion.div>
            <Typography variant="h6" sx={{ mt: 3, fontWeight: 600, color: '#c62828' }}>
              Emergency Alert
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              Press to trigger emergency notification
            </Typography>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Emergency Contacts
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => setOpenContactDialog(true)}
              >
                Add Contact
              </Button>
            </Box>

            {contacts.length === 0 ? (
              <Card sx={{ p: 4, textAlign: 'center' }}>
                <Person sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  No emergency contacts added yet
                </Typography>
              </Card>
            ) : (
              <Grid container spacing={2}>
                {contacts.map((contact) => (
                  <Grid item xs={12} md={6} key={contact.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ bgcolor: '#ef5350', mr: 2 }}>
                            {contact.contactName.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {contact.contactName}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Phone sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">{contact.contactPhone}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Email sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">{contact.contactEmail}</Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>

        {/* SOS Alerts History */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                SOS Alert History
              </Typography>
              {alerts.some(a => !a.read) && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleMarkAsRead}
                >
                  Mark All as Read
                </Button>
              )}
            </Box>

            {alerts.length === 0 ? (
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
                No SOS alerts triggered yet
              </Typography>
            ) : (
              <List>
                {alerts.map((alert) => (
                  <ListItem
                    key={alert.id}
                    sx={{
                      mb: 1,
                      background: alert.read ? 'transparent' : isDarkMode ? 'rgba(239, 83, 80, 0.1)' : 'rgba(239, 83, 80, 0.05)',
                      borderRadius: 1,
                      border: alert.read ? 'none' : '1px solid #ef5350'
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: alert.read ? 'text.secondary' : '#ef5350' }}>
                        <NotificationsActive />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={alert.title}
                      secondary={
                        <Box>
                          <Typography variant="body2">{alert.message}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {new Date(alert.createdAt).toLocaleString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Contact Dialog */}
      <Dialog open={openContactDialog} onClose={() => setOpenContactDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Emergency Contact</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Contact Name"
            fullWidth
            variant="outlined"
            value={newContact.contactName}
            onChange={(e) => setNewContact({ ...newContact, contactName: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            variant="outlined"
            type="email"
            value={newContact.contactEmail}
            onChange={(e) => setNewContact({ ...newContact, contactEmail: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Phone Number"
            fullWidth
            variant="outlined"
            type="tel"
            value={newContact.contactPhone}
            onChange={(e) => setNewContact({ ...newContact, contactPhone: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenContactDialog(false)}>Cancel</Button>
          <Button onClick={handleAddContact} variant="contained">Add Contact</Button>
        </DialogActions>
      </Dialog>

      {/* Nearby Hospitals Dialog */}
      <Dialog open={openHospitalDialog} onClose={() => setOpenHospitalDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalHospital sx={{ mr: 1, color: '#ef5350' }} />
              Nearby Hospitals
            </Box>
            <IconButton onClick={() => setOpenHospitalDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {hospitals.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {hospitals.map((hospital, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#4caf50' }}>
                        <LocalHospital />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {hospital.name}
                          </Typography>
                          <Chip
                            label={`${hospital.distanceKm.toFixed(2)} km`}
                            size="small"
                            color="primary"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                            <Typography variant="body2">{hospital.address}</Typography>
                          </Box>
                          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<Directions />}
                              onClick={() => getDirections(hospital)}
                            >
                              Directions
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => openHospitalInMaps(hospital)}
                            >
                              View on Maps
                            </Button>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < hospitals.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default SOS;
