import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Button, TextField } from '@mui/material';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import { Link } from 'react-router-dom';

const Home = () => {
    const [properties, setProperties] = useState([]);
    const [search, setSearch] = useState('');

    const fetchProperties = async (query = '') => {
        try {
            const url = query
                ? `http://localhost:5000/api/properties?location=${query}`
                : 'http://localhost:5000/api/properties';
            const res = await axios.get(url);
            setProperties(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProperties(search);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <div className="text-center mb-5">
                <Typography variant="h2" component="h1" gutterBottom>
                    Find Your Perfect Rental
                </Typography>
                <Typography variant="h5" color="text.secondary" paragraph>
                    Browse hundreds of apartments, houses, and rooms for rent.
                </Typography>

                {/* Search Bar */}
                <form onSubmit={handleSearch} style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                    <TextField
                        variant="outlined"
                        placeholder="Search by City..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ width: '300px', bgcolor: 'white' }}
                    />
                    <Button variant="contained" size="large" type="submit">
                        Search
                    </Button>
                </form>

                <Button variant="outlined" size="large" component={Link} to="/register">
                    Join as Renter/Owner
                </Button>
            </div>

            <Grid container spacing={4}>
                {properties.length > 0 ? (
                    properties.map((property) => (
                        <Grid item key={property._id} xs={12} sm={6} md={4}>
                            <PropertyCard property={property} />
                        </Grid>
                    ))
                ) : (
                    <Typography variant="h6" sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
                        No properties found in this location.
                    </Typography>
                )}
            </Grid>
        </Container>
    );
};

export default Home;
