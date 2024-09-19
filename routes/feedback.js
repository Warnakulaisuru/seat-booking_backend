// routes/feedbackRoutes.js
const express = require("express");
const { submitFeedback } = require("../controllers/feedbackController");
const router = express.Router();

// POST route for submitting feedback
router.post("/feedback", submitFeedback);

module.exports = router;
