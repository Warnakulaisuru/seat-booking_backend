const express = require("express");
const router = express.Router();
const BookingModel = require("../models/SeatBooking");
const authenticateToken = require("../middleware/authenticaticateTokwn"); // Corrected typo
const authenticateAdmin = require("../middleware/authenticateAdmin");

// Get bookings for a specific date
router.get("/bookings", authenticateToken, async (req, res) => {
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
    // Check if the user has already booked a seat for this date
    const existingUserBooking = await BookingModel.findOne({ bookingDate, trainerID });

    if (existingUserBooking) {
      return res.status(400).json({ message: "You have already booked a seat for this date" });
    }

    // Check if the seat is already booked for this date
    const existingSeatBooking = await BookingModel.findOne({ seatNumber, bookingDate });

    if (existingSeatBooking) {
      return res.status(400).json({ message: "Seat already booked for this date" });
    }

    const newBooking = new BookingModel({
      seatNumber,
      bookingDate,
      trainerID,
      userEmail: req.user.email // Add user email to booking
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking created", trainerID, userEmail: req.user.email });
  } catch (err) {
    res.status(500).json({ message: "Error creating booking", error: err });
  }
});

// Fetch bookings with optional date and search term filters
router.get("/bookings", authenticateAdmin, async (req, res) => {
  const { date, search } = req.query;
  const filter = {};

  if (date) filter.date = date;
  if (search) {
    filter.$or = [
      { userName: { $regex: search, $options: "i" } }, // case-insensitive search for userName
      { seatNumber: search }, // exact search for seatNumber
    ];
  }

  try {
    const bookings = await Booking.find(filter);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// Delete a booking by ID
router.delete("/bookings/:id", authenticateAdmin, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting booking" });
  }
});

module.exports = router;
