const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { clerkAuth } = require('../middleware/auth');

// @route   POST api/ai/email/reply
// @desc    Generate email reply
// @access  Private
router.post('/email/reply', clerkAuth, aiController.generateEmailReply);

// @route   POST api/ai/linkedin/post
// @desc    Generate LinkedIn post
// @access  Private
router.post('/linkedin/post', clerkAuth, aiController.generateLinkedInPost);

// @route   POST api/ai/tasks/prioritize
// @desc    Prioritize tasks
// @access  Private
router.post('/tasks/prioritize', clerkAuth, aiController.prioritizeTasks);

// @route   POST api/ai/notes/summarize
// @desc    Summarize note
// @access  Private
router.post('/notes/summarize', clerkAuth, aiController.summarizeNote);

module.exports = router; 