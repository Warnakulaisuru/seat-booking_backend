const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  seatNumber: { type: Number, required: true },
  bookingDate: { type: String, required: true },
  trainerID: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }, // Reference to the user
});

const BookingModel = mongoose.model("bookings", BookingSchema);
module.exports = BookingModel;
