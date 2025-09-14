const express = require('express');
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

// Create a new user
router.post('/register', userController.createUser);

// Login user
router.post('/login', userController.loginUser);

// Get all users
router.get('/', authenticateToken, userController.getAllUsers);

// Get a single user by ID
router.get('/:id', authenticateToken, userController.getUserById);

module.exports = router;