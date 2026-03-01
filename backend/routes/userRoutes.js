const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/userController');

// POST /api/users/login
router.post('/login', login);
// POST /api/users/register
router.post('/register', register);

module.exports = router;
