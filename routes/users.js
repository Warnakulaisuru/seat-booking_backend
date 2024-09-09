const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticaticateTokwn'); // JWT authentication middleware

// Get all users (existing route)
router.get('/users', userController.getAllUsers);

// Add a new user (existing route)
router.post('/users', userController.addUsers);

// Get logged-in user's data (new route)
router.get('/users/me', authenticateToken, userController.getLoggedInUser);

module.exports = router;
