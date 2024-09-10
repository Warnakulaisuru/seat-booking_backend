const SeatBooking = require('../models/SeatBooking');
const jwt = require('jsonwebtoken');

// Fetch all bookings
exports.getAllBookings = (req, res) => {
  SeatBooking.find()
    .then((bookings) => {
      res.status(200).json(bookings);
    })
    .catch((err) => res.status(500).json({ message: "An error occurred", error: err.message }));
};

// Add a booking
exports.addBooking = async (req, res) => {
  const { seatNumber, bookingDate } = req.body;
  const userId = req.user.id; // Get userId from token

  if (!seatNumber) {
    return res.status(400).json({ message: "Seat number required" });
  }

  try {
    // Check if the seat is already booked
    const existingBooking = await SeatBooking.findOne({ seatNumber });
    if (existingBooking) {
      return res.status(400).json({ message: "Seat is already booked" });
    }

    const newBooking = new SeatBooking({
      seatNumber,
      userId,
      bookingDate,
    });

    await newBooking.save();
    res.status(201).json({ message: "Seat booked successfully", booking: newBooking });
  } catch (err) {
    res.status(500).json({ message: "An error occurred", error: err.message });
  }
};
