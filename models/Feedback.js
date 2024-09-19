// models/Feedback.js
const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
  trainerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model for trainers
    required: true,
  },
  seatNumber: {
    type: Number,
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Feedback", FeedbackSchema);
