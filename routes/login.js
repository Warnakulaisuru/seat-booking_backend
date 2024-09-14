const express = require("express");
const jwt = require("jsonwebtoken");
const UserModel = require("./models/Users"); 

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your_very_secure_random_secret_here';

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  UserModel.findOne({ email })
    .then(user => {
      if (user) {
        if (user.password === password) {
          const token = jwt.sign(
            { id: user._id, email: user.email },
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

app.listen(process.env.PORT || 4000, () => {
  console.log("Server listening on port", process.env.PORT || 4000);
});