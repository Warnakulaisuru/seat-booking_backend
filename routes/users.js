const express = require('express');
const router = express.Router();
const passport = require("passport");

const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticaticateTokwn');

router.get('/users', userController.getAllUsers);

router.post('/users', userController.addUsers);

router.get('/users/me', authenticateToken, userController.getLoggedInUser);

// Initiate Google Authentication
router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  
  // Google Callback URL
  router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      // Successful authentication, redirect to homepage or dashboard
      res.redirect("/dashboard");
    }
  );


module.exports = router;