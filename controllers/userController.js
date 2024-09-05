const Users = require('../models/Users');

// Get all departments
exports.getAllUsers = (req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => res.status(500).json({ message: "An error occurred", error: err.message }));
};

// Add a new department
exports.addUsers = (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name  required" });
  }

  const newUsers = new Users({
    name,
  });

  newUsers.save()
    .then((users) => {
      res.status(201).json({ message: "Department added successfully", users });
    })
    .catch((err) => res.status(500).json({ message: "An error occurred", error: err.message }));
};
