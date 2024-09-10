const Department = require('../models/Department');

exports.getAllDepartments = (req, res) => {
  Department.find()
    .then((departments) => {
      res.status(200).json(departments);
    })
    .catch((err) => res.status(500).json({ message: "An error occurred", error: err.message }));
};

exports.addDepartment = (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name  required" });
  }

  const newDepartment = new Department({
    name,
  });

  newDepartment.save()
    .then((department) => {
      res.status(201).json({ message: "Department added successfully", department });
    })
    .catch((err) => res.status(500).json({ message: "An error occurred", error: err.message }));
};
