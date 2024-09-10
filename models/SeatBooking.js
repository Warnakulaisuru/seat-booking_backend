const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  seatNumber: { type: Number, required: true },
  bookingDate: { type: String, required: true }, // Store date as string (YYYY-MM-DD)
});

module.exports = mongoose.model("Booking", BookingSchema);
