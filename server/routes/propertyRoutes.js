const express = require('express');
const router = express.Router();
const Property = require('../models/Property');

// GetAll
router.get('/', async (req, res) => {
    try {
        const { location, rentMax, type } = req.query;
        let filter = {};
        if (location) filter.location = new RegExp(location, 'i');
        if (type) filter.type = type;
        if (rentMax) filter.rent = { $lte: rentMax };

        // Filter by available status by default unless admin? 
        // For now show all or just available

        const properties = await Property.find(filter).populate('owner', 'name email');
        res.json(properties);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create (Owner only)
router.post('/', async (req, res) => {
    try {
        const newProperty = new Property(req.body);
        await newProperty.save();
        res.status(201).json(newProperty);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get One
router.get('/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate('owner', 'name email');
        if (!property) return res.status(404).json({ error: 'Property not found' });
        res.json(property);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
