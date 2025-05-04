const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

router.post('/send-welcome-email', emailController.sendWelcomeEmail);

module.exports = router;
