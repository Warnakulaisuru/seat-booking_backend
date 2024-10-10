const express = require('express');
const Admin = require('../models/Admin'); // Ensure the correct path to the Admin model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Admin Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const admin = await Admin.findOne({ email });
  
      if (!admin) {
        return res.status(404).json({ message: 'Admin not registered' });
      }
  
      const isMatch = await bcrypt.compare(password, admin.password);
  
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect password' });
      }
  
      const token = jwt.sign({ adminId: admin._id, isAdmin: admin.isAdmin }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
  
      res.json({
        message: 'Admin login successful!',
        token,
        admin: { email: admin.email, isAdmin: admin.isAdmin },
      });
    } catch (error) {
      console.error('Admin login error', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

// Admin Creation Route
router.post('/createAdmin', async (req, res) => {
  const { email, password, nic, adminId } = req.body;

  try {
    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ $or: [{ email }, { nic }, { adminId }] });

    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this NIC, email, or Admin ID already exists!' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = new Admin({
      email,
      password: hashedPassword, // Store the hashed password
      nic,
      adminId,
      isAdmin: true, // Ensuring that the created user is an admin
    });

    await newAdmin.save();

    res.json({
      message: 'Admin created successfully!',
      admin: { email: newAdmin.email, adminId: newAdmin.adminId },
    });
  } catch (error) {
    console.error('Admin creation error', error);
    res.status(500).json({ message: 'Error creating admin', error });
  }
});

// Get all admins
router.get('/getAllAdmins', async (req, res) => {
    try {
      const admins = await Admin.find({});
      res.json(admins);
    } catch (error) {
      console.error('Error fetching admins', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

module.exports = router;
