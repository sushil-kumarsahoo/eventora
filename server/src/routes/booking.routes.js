const express = require('express');
const bookingRouter = express.Router();

const {authUser, authAdmin} = require('../middlewares/auth.middleware')

const {bookEvent, sendBookingOTP, getMyBookings, confirmBooking, cancelBooking} = require('../controllers/booking.controller')

bookingRouter.post('/', authUser, bookEvent);
bookingRouter.post('/send-otp', authUser, sendBookingOTP);
bookingRouter.get('/my', authUser, getMyBookings);
bookingRouter.put('/:id/confirm', authUser, authAdmin, confirmBooking);
bookingRouter.delete('/:id', authUser, cancelBooking);


module.exports = bookingRouter;