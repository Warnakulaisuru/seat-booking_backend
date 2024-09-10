const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Refers to the user who booked the seat
});

const SeatModel = mongoose.model('Seat', seatSchema);

module.exports = SeatModel;
