const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');

router.get('/departments', departmentController.getAllDepartments);
router.post('/departments', departmentController.addDepartment);

module.exports = router;