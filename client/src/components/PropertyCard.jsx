import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, CardActions } from '@mui/material';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
                component="img"
                height="140"
                image={property.photos[0] || 'https://via.placeholder.com/300'}
                alt={property.title}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                    {property.title}
                </Typography>
                <Typography>
                    {property.location} - ₹{property.rent}/mo
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {property.type} | {property.bedrooms} Bed
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" component={Link} to={`/properties/${property._id}`}>View Details</Button>
            </CardActions>
        </Card>
    );
};

export default PropertyCard;
