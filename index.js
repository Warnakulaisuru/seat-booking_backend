require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const departmentRoutes = require('./routes/department'); // Import department routes
const userRoutes = require('./routes/users'); 

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000;

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB database connected");
  } catch (err) {
    console.log("MongoDB database connection failed");
  }
};

// User-related routes
const UserModel = require("./models/Users");

// Check for existing user by NIC, email, or Trainer ID
app.post("/checkUser", (req, res) => {
  const { email, nic, trainerId } = req.body;
  UserModel.findOne({ $or: [{ email }, { nic }, { trainerId }] })
    .then((user) => {
      res.json({ exists: !!user });
    })
    .catch((err) => res.status(500).json(err));
});

app.get("/", (req, res) => {
  UserModel.find({})
    .then((users) => res.json(users))
    .catch((err) => res.status(500).json(err));
});

app.get("/getUser/:id", (req, res) => {
  const id = req.params.id;
  UserModel.findById(id)
    .then((user) => res.json(user))
    .catch((err) => res.status(500).json(err));
});

app.put("/updateUser/:id", (req, res) => {
  const id = req.params.id;
  UserModel.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
      nic: req.body.nic,
      gender: req.body.gender,
      department: req.body.department,
      trainerId: req.body.trainerId, 
    },
    { new: true }
  )
    .then((user) => res.json(user))
    .catch((err) => res.status(500).json(err));
});

app.delete("/deleteUser/:id", (req, res) => {
  const id = req.params.id;
  UserModel.findByIdAndDelete(id)
    .then((user) => res.json(user))
    .catch((err) => res.status(500).json(err));
});

app.post("/createUser", (req, res) => {
  const { email, nic, trainerId } = req.body;
  UserModel.findOne({ $or: [{ email }, { nic }, { trainerId }] })
    .then((user) => {
      if (user) {
        res.status(400).json({ message: "User with this NIC, email, or Trainer ID already exists!" });
      } else {
        UserModel.create(req.body)
          .then((newUser) => res.json(newUser))
          .catch((err) => res.status(500).json(err));
      }
    })
    .catch((err) => res.status(500).json(err));
});

app.post("/login", (req, res) => {
  const {email, password} = req.body;
  UserModel.findOne({email:email})
  .then(user => {
      if (user) {
          if(user.password === password){
              res.json("Success") // Changed to "Success"
          } else {
              res.json("Incorrect") // Changed to "Incorrect"
          } 
      } else {
          res.json("Not Registered") // Changed to "Not Registered"
      }
  })
  .catch(err => res.status(500).json("Error: " + err)); // Added catch for any errors
});

// Use department routes
app.use('/api', departmentRoutes);
app.use('/api', userRoutes);

app.listen(port, () => {
  connect();
  console.log("Server listening on port", port);
});