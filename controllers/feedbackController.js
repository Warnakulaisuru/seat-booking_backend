// controllers/feedbackController.js
const Feedback = require("../models/Feedback");

exports.submitFeedback = async (req, res) => {
  try {
    const { trainerID, seatNumber, feedback } = req.body;

    // Create a new feedback entry
    const newFeedback = new Feedback({
      trainerID,
      seatNumber,
      feedback,
    });

    // Save to the database
    await newFeedback.save();

    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error submitting feedback", error });
  }
};
