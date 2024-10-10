const express = require("express");
const jwt = require("jsonwebtoken");
const UserModel = require("./models/Users"); 

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your_very_secure_random_secret_here';

// User login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  UserModel.findOne({ email })
    .then(user => {
      if (user) {
        if (user.password === password) {
          const token = jwt.sign(
            { id: user._id, email: user.email, isAdmin: user.isAdmin },
            JWT_SECRET,
            { expiresIn: '12h' }
          );
          return res.json({ message: "Success", token });
        } else {
          return res.status(401).json({ message: "Incorrect password" });
        }
      } else {
        return res.status(404).json({ message: "User not registered" });
      }
    })
    .catch(err => res.status(500).json({ message: "Error finding user", error: err }));
});

// Admin login route
app.post("/admin/login", (req, res) => {
  const { email, password } = req.body;

  UserModel.findOne({ email, isAdmin: true }) // Ensure the user is an admin
    .then(admin => {
      if (admin) {
        if (admin.password === password) {
          const token = jwt.sign(
            { id: admin._id, email: admin.email, isAdmin: admin.isAdmin },
            JWT_SECRET,
            { expiresIn: '12h' }
          );
          return res.json({ message: "Admin Success", token });
        } else {
          return res.status(401).json({ message: "Incorrect password" });
        }
      } else {
        return res.status(404).json({ message: "Admin not registered" });
      }
    })
    .catch(err => res.status(500).json({ message: "Error finding admin", error: err }));
});


app.post("/googleLogin", async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await UserModel.findOne({ email });
    if (!user) {
      console.log("User does not exist, additional information required.");
      return res.status(400).json({ message: "User needs to register with additional information" });
    }

    const jwtToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });

    res.json({ message: "Login successful", token: jwtToken });
  } catch (error) {
    console.error("Error during Google login:", error);
    res.status(500).json({ message: "Google login failed", error });
  }
});






app.listen(process.env.PORT || 4000, () => {
  console.log("Server listening on port", process.env.PORT || 4000);
});
