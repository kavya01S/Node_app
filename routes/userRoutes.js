const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// ✅ SIGN UP (Register new user)
router.post('/signup', userController.signup);

// ✅ LOGIN (Authenticate user)
router.post('/login', userController.login);

// ✅ READ all users (excluding password)
router.get('/', userController.getUsers);

// ✅ READ single user by ID
router.get('/:id', userController.getUser);

// ✅ UPDATE user by ID
router.put('/:id', userController.updateUser);

// ✅ DELETE user by ID
router.delete('/:id', userController.deleteUser);

module.exports = router;
