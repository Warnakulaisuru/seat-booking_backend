const AdminModel = require('../models/Admin'); // Ensure correct path to the Admin model

exports.createAdmin = async (req, res) => {
  const { email, password, nic, adminId } = req.body;
  
  try {
    const existingAdmin = await AdminModel.findOne({ $or: [{ email }, { nic }, { adminId }] });
    
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin with this NIC, email, or Admin ID already exists!" });
    }

    const newAdmin = new AdminModel({ email, password, nic, adminId });
    await newAdmin.save();
    
    res.json(newAdmin);
  } catch (err) {
    res.status(500).json({ message: "Error creating admin", error: err });
  }
};
