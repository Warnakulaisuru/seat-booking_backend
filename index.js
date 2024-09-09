require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const departmentRoutes = require('./routes/department');
const userRoutes = require('./routes/users'); 
const bookingRoutes = require("./routes/bookings");

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000;

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB database connected");
  } catch (err) {
    console.error("MongoDB database connection failed", err);
  }
};

// User-related routes
const UserModel = require("./models/Users");

app.post("/checkUser", async (req, res) => {
  const { email, nic, trainerId } = req.body;
  try {
    const user = await UserModel.findOne({ $or: [{ email }, { nic }, { trainerId }] });
    res.json({ exists: !!user });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err });
  }
});

app.get("/", async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err });
  }
});

app.get("/getUser/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserModel.findById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error", error: err });
  }
});

app.put("/updateUser/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error", error: err });
  }
});

app.delete("/deleteUser/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserModel.findByIdAndDelete(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error", error: err });
  }
});

app.post("/createUser", async (req, res) => {
  const { email, password, nic, trainerId } = req.body;
  try {
    const user = await UserModel.findOne({ $or: [{ email }, { nic }, { trainerId }] });
    if (user) {
      res.status(400).json({ message: "User with this NIC, email, or Trainer ID already exists!" });
    } else {
      // Store password as plaintext
      const newUser = await UserModel.create(req.body);
      res.json(newUser);
    }
  } catch (err) {
    res.status(500).json({ message: "Error", error: err });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      // Compare plaintext password
      if (user.password === password) {
        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: '12h' }
        );
        res.json({ message: "Success", token });
      } else {
        res.status(401).json({ message: "Incorrect password" });
      }
    } else {
      res.status(404).json({ message: "User not registered" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error", error: err });
  }
});

app.use('/api', departmentRoutes);
app.use('/api', userRoutes);
app.use("/api", bookingRoutes);

app.listen(port, () => {
  connect();
  console.log("Server listening on port", port);
});
