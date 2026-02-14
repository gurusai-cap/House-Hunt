const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['renter', 'owner', 'admin'], default: 'renter' },
    isApproved: { type: Boolean, default: false } // For owners to be approved by admin which is default false for owner and set to true for renter
}, { timestamps: true });

// Auto approve renters
UserSchema.pre('save', function (next) {
    if (this.role === 'renter' || this.role === 'admin') {
        this.isApproved = true;
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);
