const mongoose = require("mongoose");

const seatBookingSchema = new mongoose.Schema({
  seatNumber: {
    type: Number,
    required: true,
    unique: true // Ensure each seat can only be booked once
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingDate: {
    type: Date,
    required: true
  },
  isBooked: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const SeatBooking = mongoose.model("SeatBooking", seatBookingSchema);

module.exports = SeatBooking;
