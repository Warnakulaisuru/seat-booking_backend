const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticaticateTokwn');

router.get('/users', userController.getAllUsers);

router.post('/users', userController.addUsers);

router.get('/users/me', authenticateToken, userController.getLoggedInUser);

module.exports = router;
