// src/components/activities/ActivityList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import { getActivities } from '../../services/api';

const ActivityList = () => {
    const [activities, setActivities] = useState([]);
    const navigate = useNavigate();

    const fetchActivities = async () => {
        try {
            const response = await getActivities();
            setActivities(response.data);
        } catch (error) {
            console.error('Failed to fetch activities:', error);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    return (
        <Grid container spacing={2}>
            {activities.map((activity) => (
                <Grid item xs={12} sm={6} md={4} key={activity.id}>
                    <Card 
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/activities/${activity.id}`)}
                    >
                        <CardContent>
                            <Typography variant="h6">{activity.type}</Typography>
                            <Typography>Duration: {activity.duration} minutes</Typography>
                            <Typography>Calories: {activity.caloriesBurned}</Typography>
                            <Typography variant="caption">
                                {new Date(activity.createdAt).toLocaleDateString()}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default ActivityList;
