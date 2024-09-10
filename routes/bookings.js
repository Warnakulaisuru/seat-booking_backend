const express = require("express");
const router = express.Router();
const BookingModel = require("../models/SeatBooking"); // Assuming you have a Booking model

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
router.post("/bookings", async (req, res) => {
  const { seatNumber, bookingDate } = req.body;

  try {
    const existingBooking = await BookingModel.findOne({ seatNumber, bookingDate });
    
    if (existingBooking) {
      return res.status(400).json({ message: "Seat already booked for this date" });
    }
    
    const newBooking = new BookingModel({ seatNumber, bookingDate });
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(500).json({ message: "Error creating booking", error: err });
  }
});

module.exports = router;
