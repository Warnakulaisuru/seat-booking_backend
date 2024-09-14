const express = require("express");
const router = express.Router();
const BookingModel = require("../models/SeatBooking");
const authenticateToken = require("../middleware/authenticaticateTokwn"); // Assuming you have authentication

// Get bookings for a specific date
router.get("/bookings", async (req, res) => {
  const { date } = req.query;

  try {
    const bookings = await BookingModel.find({ bookingDate: date });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings", error: err });
  }
});

// Create a new booking
router.post("/bookings", authenticateToken, async (req, res) => {
  const { seatNumber, bookingDate } = req.body;
  const trainerID = req.user.id; // Extract trainerID from the authenticated user

  try {
    const existingBooking = await BookingModel.findOne({ seatNumber, bookingDate });

    if (existingBooking) {
      return res.status(400).json({ message: "Seat already booked for this date" });
    }

    const newBooking = new BookingModel({ seatNumber, bookingDate, trainerID });
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(500).json({ message: "Error creating booking", error: err });
  }
});

module.exports = router;
