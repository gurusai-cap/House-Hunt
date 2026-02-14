const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    renter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'rejected'], default: 'pending' },
    message: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
