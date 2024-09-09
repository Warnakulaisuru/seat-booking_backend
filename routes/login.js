const express = require("express");
const jwt = require("jsonwebtoken");
const UserModel = require("./models/Users"); // Adjust the path as needed

const app = express();
app.use(express.json());

// Your JWT secret (should be stored securely, e.g., in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your_very_secure_random_secret_here';

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  UserModel.findOne({ email })
    .then(user => {
      if (user) {
        // Compare the provided password with the stored password (plain text)
        if (user.password === password) {
          // Generate JWT token
          const token = jwt.sign(
            { id: user._id, email: user.email }, // Payload
            JWT_SECRET, // Secret key
            { expiresIn: '12h' } // Token expiration time
          );
          // Return the JWT token upon successful login
          return res.json({ message: "Success", token });
        } else {
          // Password does not match
          return res.status(401).json({ message: "Incorrect password" });
        }
      } else {
        // Email not found
        return res.status(404).json({ message: "User not registered" });
      }
    })
    .catch(err => res.status(500).json({ message: "Error finding user", error: err }));
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Server listening on port", process.env.PORT || 4000);
});
