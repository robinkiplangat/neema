const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');

// @route   POST api/ai/email/reply
// @desc    Generate email reply
// @access  Private
router.post('/email/reply', auth, aiController.generateEmailReply);

// @route   POST api/ai/linkedin/post
// @desc    Generate LinkedIn post
// @access  Private
router.post('/linkedin/post', auth, aiController.generateLinkedInPost);

// @route   POST api/ai/tasks/prioritize
// @desc    Prioritize tasks
// @access  Private
router.post('/tasks/prioritize', auth, aiController.prioritizeTasks);

// @route   POST api/ai/notes/summarize
// @desc    Summarize note
// @access  Private
router.post('/notes/summarize', auth, aiController.summarizeNote);

module.exports = router; 