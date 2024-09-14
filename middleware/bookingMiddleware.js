const Booking = require('../models/SeatBooking');

// Middleware to check seat availability for a specific date
const checkSeatAvailability = async (req, res, next) => {
  const { seatNumber, bookingDate } = req.body;

  try {
    // Check if the seat is already booked for the selected date
    const existingBooking = await Booking.findOne({
      seatNumber,
      bookingDate,
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Seat is already booked for this date' });
    }

    next(); // Proceed with booking if seat is available
  } catch (error) {
    console.error('Error checking seat availability:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = checkSeatAvailability;