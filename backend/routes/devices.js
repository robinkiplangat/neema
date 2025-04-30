// backend/routes/devices.js
const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');

router.post('/register', deviceController.registerDevice);

module.exports = router;
