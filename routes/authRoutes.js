const express = require('express');
const AuthController = require('../controllers/authController');
const router = express.Router();

// Authentication routes
router.get('/login', AuthController.getLogin);
router.post('/login', AuthController.postLogin);
router.get('/register', AuthController.getRegister);
router.post('/register', AuthController.postRegister);
router.get('/logout', AuthController.logout);

module.exports = router; 