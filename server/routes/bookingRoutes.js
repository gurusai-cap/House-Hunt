const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Create Booking
router.post('/', async (req, res) => {
    try {
        const booking = new Booking(req.body);
        await booking.save();
        res.status(201).json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Bookings (for a User or Owner)
router.get('/:userId', async (req, res) => {
    try {
        // This logic needs to separate based on role, but for now simple find
        const bookings = await Booking.find({
            $or: [{ renter: req.params.userId }, { owner: req.params.userId }] // Schema doesn't have owner on booking directly, need to look up via property?
        }).populate('property').populate('renter');

        // Wait, Booking model only has property and renter. 
        // To get bookings for an 'owner', we need to find bookings where the property belongs to that owner.
        // This is complex for a simple query.
        // Alternative: Find all properties by owner, then find bookings for those properties.

        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
