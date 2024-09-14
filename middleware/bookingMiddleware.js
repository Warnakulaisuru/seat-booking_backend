const Booking = require('../models/SeatBooking');

const checkSeatAvailability = async (req, res, next) => {
  const { seatNumber, bookingDate } = req.body;

  try {

    const existingBooking = await Booking.findOne({
      seatNumber,
      bookingDate,
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Seat is already booked for this date' });
    }

    next();
  } catch (error) {
    console.error('Error checking seat availability:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = checkSeatAvailability;