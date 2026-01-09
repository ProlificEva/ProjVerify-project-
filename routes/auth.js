const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.contollers'); // Import the logic

// Define the routes
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;