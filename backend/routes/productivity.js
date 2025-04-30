// backend/routes/productivity.js
const express = require('express');
const router = express.Router();
const productivityController = require('../controllers/productivityController');

router.get('/stats', productivityController.getStats);
router.get('/time-distribution', productivityController.getTimeDistribution);

module.exports = router;
