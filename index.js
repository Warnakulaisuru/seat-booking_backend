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

const UserModel = require("./models/Users");
const SeatModel = require("./models/SeatModel"); // Import the seat model

// Check if user exists
app.post("/checkUser", async (req, res) => {
  const { email, nic, trainerId } = req.body;
  try {
    const user = await UserModel.findOne({ $or: [{ email }, { nic }, { trainerId }] });
    res.json({ exists: !!user });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err });
  }
});

// Get all users
app.get("/", async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err });
  }
});

// Get a single user by ID
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

// Update a user by ID
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

// Delete a user by ID
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

// Create a new user
app.post("/createUser", async (req, res) => {
  const { email, password, nic, trainerId } = req.body;
  try {
    const user = await UserModel.findOne({ $or: [{ email }, { nic }, { trainerId }] });
    if (user) {
      res.status(400).json({ message: "User with this NIC, email, or Trainer ID already exists!" });
    } else {
      const newUser = await UserModel.create(req.body);
      res.json(newUser);
    }
  } catch (err) {
    res.status(500).json({ message: "Error", error: err });
  }
});

// Login user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
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

// Seat booking logic
app.get("/getSeats", async (req, res) => {
  try {
    const seats = await SeatModel.find({});
    res.json(seats);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving seats", error: err });
  }
});

app.post("/bookSeat", async (req, res) => {
  const { seatNumber, userId } = req.body;
  try {
    const seat = await SeatModel.findOne({ seatNumber });
    if (seat) {
      if (seat.isBooked) {
        res.status(400).json({ message: "Seat already booked" });
      } else {
        seat.isBooked = true;
        seat.bookedBy = userId;
        await seat.save();
        res.json({ message: "Seat booked successfully", seat });
      }
    } else {
      res.status(404).json({ message: "Seat not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error booking seat", error: err });
  }
});

// Routes for department, user, and booking
app.use('/api', departmentRoutes);
app.use('/api', userRoutes);
app.use("/api", bookingRoutes);

app.listen(port, () => {
  connect();
  console.log("Server listening on port", port);
});