import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Paper, Grid, Box } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PropertyDetails = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:5000/api/properties/${id}`)
            .then(res => setProperty(res.data))
            .catch(err => console.error(err));
    }, [id]);

    const handleBooking = async () => {
        if (!user) return navigate('/login');
        try {
            await axios.post('http://localhost:5000/api/bookings', {
                property: property._id,
                renter: user._id,
                message: 'I am interested!'
            });
            alert('Booking Request Sent!');
            navigate('/dashboard');
        } catch (err) {
            alert('Error booking property');
        }
    };

    if (!property) return <Typography>Loading...</Typography>;

    return (
        <Container sx={{ mt: 4 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <img src={property.photos[0] || 'https://via.placeholder.com/800x400'} alt={property.title} style={{ width: '100%', borderRadius: 8 }} />
                    <Typography variant="h3" sx={{ mt: 2 }}>{property.title}</Typography>
                    <Typography variant="h5" color="text.secondary">{property.location}</Typography>

                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6">Description</Typography>
                        <Typography paragraph>{property.description}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h4" color="primary">₹{property.rent}/mo</Typography>
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>{property.type} • {property.bedrooms} Beds</Typography>

                        <Typography variant="body2" gutterBottom>Owner: {property.owner?.name}</Typography>

                        <Button variant="contained" size="large" fullWidth onClick={handleBooking}>
                            Request to Rent
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default PropertyDetails;
