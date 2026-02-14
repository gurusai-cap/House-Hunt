import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Grid, Paper, Tabs, Tab, Box, TextField, MenuItem } from '@mui/material';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [activeTab, setActiveTab] = useState(0);
    const [properties, setProperties] = useState([]);
    const [bookings, setBookings] = useState([]);

    // Owner: New Property State
    const [newProp, setNewProp] = useState({
        title: '', description: '', location: '', rent: '', bedrooms: '', type: 'apartment', photos: ['']
    });

    useEffect(() => {
        if (!user) return;
        fetchData();
    }, []); // eslint-disable-line

    const fetchData = async () => {
        try {
            if (user.role === 'owner') {
                // Fetch my properties (filtering by owner would be better on backend but for now filter client side or use specific route)
                // Actually I implemented getAll with filters. Let's add a filter or just fetch all and filter in JS for now (Proof of concept)
                const propsRes = await axios.get('http://localhost:5000/api/properties');
                setProperties(propsRes.data.filter(p => p.owner._id === user._id || p.owner === user._id));
            }

            // Fetch bookings
            const bookRes = await axios.get(`http://localhost:5000/api/bookings/${user._id}`);
            setBookings(bookRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateProperty = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/properties', { ...newProp, owner: user._id });
            alert('Property Created!');
            fetchData(); // refresh
            setNewProp({ title: '', description: '', location: '', rent: '', bedrooms: '', type: 'apartment', photos: [''] });
        } catch (err) {
            alert('Error creating property');
        }
    };

    if (!user) return <Typography>Please login</Typography>;

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4">Hello, {user.name} ({user.role})</Typography>

            {user.role === 'owner' && (
                <Box sx={{ mt: 2 }}>
                    <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)}>
                        <Tab label="My Properties" />
                        <Tab label="Add Property" />
                        <Tab label="Bookings" />
                    </Tabs>

                    {/* My Properties */}
                    {activeTab === 0 && (
                        <Grid container spacing={3} sx={{ mt: 2 }}>
                            {properties.map(p => (
                                <Grid item key={p._id} xs={12} md={4}>
                                    <PropertyCard property={p} />
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {/* Add Property */}
                    {activeTab === 1 && (
                        <Paper sx={{ p: 3, mt: 2 }}>
                            <Typography variant="h6">List a New Property</Typography>
                            <form onSubmit={handleCreateProperty}>
                                <TextField fullWidth margin="normal" label="Title" value={newProp.title} onChange={e => setNewProp({ ...newProp, title: e.target.value })} required />
                                <TextField fullWidth margin="normal" label="Description" value={newProp.description} onChange={e => setNewProp({ ...newProp, description: e.target.value })} required />
                                <TextField fullWidth margin="normal" label="Location" value={newProp.location} onChange={e => setNewProp({ ...newProp, location: e.target.value })} required />
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField fullWidth margin="normal" label="Rent (₹)" type="number" value={newProp.rent} onChange={e => setNewProp({ ...newProp, rent: e.target.value })} required />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField fullWidth margin="normal" label="Bedrooms" type="number" value={newProp.bedrooms} onChange={e => setNewProp({ ...newProp, bedrooms: e.target.value })} required />
                                    </Grid>
                                </Grid>
                                <TextField select fullWidth margin="normal" label="Type" value={newProp.type} onChange={e => setNewProp({ ...newProp, type: e.target.value })}>
                                    <MenuItem value="apartment">Apartment</MenuItem>
                                    <MenuItem value="house">House</MenuItem>
                                    <MenuItem value="room">Room</MenuItem>
                                </TextField>
                                <TextField fullWidth margin="normal" label="Photo URL" value={newProp.photos[0]} onChange={e => setNewProp({ ...newProp, photos: [e.target.value] })} />
                                <Button variant="contained" type="submit" sx={{ mt: 2 }}>Create Listing</Button>
                            </form>
                        </Paper>
                    )}

                    {/* Bookings (Requests) */}
                    {activeTab === 2 && (
                        <Box sx={{ mt: 2 }}>
                            {bookings.map(b => (
                                <Paper key={b._id} sx={{ p: 2, mb: 2 }}>
                                    <Typography>Property: {b.property?.title}</Typography>
                                    <Typography>Renter: {b.renter?.name}</Typography>
                                    <Typography>Status: {b.status}</Typography>
                                </Paper>
                            ))}
                        </Box>
                    )}
                </Box>
            )}

            {user.role === 'renter' && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h5">My Bookings</Typography>
                    {bookings.map(b => (
                        <Paper key={b._id} sx={{ p: 2, mb: 2 }}>
                            <Typography>Property: {b.property?.title}</Typography>
                            <Typography>Status: {b.status}</Typography>
                        </Paper>
                    ))}
                </Box>
            )}
        </Container>
    );
};

export default Dashboard;
