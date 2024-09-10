const Users = require('../models/Users');

exports.getAllUsers = (req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => res.status(500).json({ message: "An error occurred", error: err.message }));
};

exports.addUsers = (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const newUser = new Users({ name });
  newUser.save()
    .then((user) => {
      res.status(201).json({ message: "User added successfully", user });
    })
    .catch((err) => res.status(500).json({ message: "An error occurred", error: err.message }));
};

exports.getLoggedInUser = (req, res) => {
  const userId = req.user.id; 

  Users.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    })
    .catch(err => res.status(500).json({ message: "An error occurred", error: err.message }));
};
