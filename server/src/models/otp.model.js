const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
     email: {
        type: String,
        required: true
     },
     otp: {
        type: String,
        required: true
     },
     action:{
        type: String,
        enum: ['account-verification', 'event-booking'],
        required: true
     },
     createdAt: {
        type: Date,
        default: Date.now,
        expires: 300  // OTP expires in 5 min
     }
})

const otpModel = mongoose.model('Otp', otpSchema)

module.exports = otpModel