const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { clerkAuth } = require('../middleware/auth');

// @route   GET api/users/me
// @desc    Get current user
// @access  Private
router.get('/me', clerkAuth, userController.getCurrentUser);

// @route   PUT api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', clerkAuth, userController.updatePreferences);

// @route   POST api/users/integrations
// @desc    Connect an integration
// @access  Private
router.post('/integrations', clerkAuth, userController.connectIntegration);

// @route   DELETE api/users/integrations/:service
// @desc    Disconnect an integration
// @access  Private
router.delete('/integrations/:service', clerkAuth, userController.disconnectIntegration);

// @route   GET api/users/stats
// @desc    Get user stats
// @access  Private
router.get('/stats', clerkAuth, userController.getUserStats);

module.exports = router; 