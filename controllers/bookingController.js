// // routes/bookings.js
// const express = require("express");
// const router = express.Router();
// const SeatBooking = require("../models/SeatBooking");

// // POST /api/bookings
// // Route to create a new booking
// router.post("/", async (req, res) => {
//   const { seatNumber, userId, bookingDate } = req.body;

//   try {
//     // Check if the seat is already booked
//     const existingBooking = await SeatBooking.findOne({ seatNumber });
//     if (existingBooking) {
//       return res.status(400).json({ message: "Seat is already booked." });
//     }

//     // Create a new booking
//     const newBooking = new SeatBooking({
//       seatNumber,
//       userId,
//       bookingDate,
//     });

//     await newBooking.save();
//     return res.status(201).json({ message: "Seat booked successfully", booking: newBooking });
//   } catch (error) {
//     return res.status(500).json({ message: "Server error", error });
//   }
// });

// module.exports = router;


const SeatBooking = require('../models/SeatBooking');


exports.getAllBookings = (req, res) => {
  SeatBooking.find()
    .then((bookings) => {
      res.status(200).json(bookings);
    })
    .catch((err) => res.status(500).json({ message: "An error occurred", error: err.message }));
};


exports.addBooking = (req, res) => {
  const { seatNumber } = req.body;

  if (!seatNumber) {
    return res.status(400).json({ message: "Name  required" });
  }

  const newBooking = new SeatBooking({
    seatNumber,
  });

  newBooking.save()
    .then((booking) => {
      res.status(201).json({ message: "Seat booked successfully", booking });
    })
    .catch((err) => res.status(500).json({ message: "An error occurred", error: err.message }));
};