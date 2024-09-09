const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.get('/bookings', bookingController.getAllBookings);
router.post('/bookings', bookingController.addBooking);

module.exports = router;
