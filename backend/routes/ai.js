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

// @route   POST api/ai/chat
// @desc    Generate chat response
// @access  Private
router.post('/chat', clerkAuth, aiController.generateChatResponse);

// @route   POST api/ai/suggest-tasks
// @desc    Suggest tasks based on context
// @access  Private
router.post('/suggest-tasks', clerkAuth, aiController.suggestTasks);

// @route   POST api/ai/analyze-productivity
// @desc    Analyze productivity data
// @access  Private
router.post('/analyze-productivity', clerkAuth, aiController.analyzeProductivity);

// @route   POST api/ai/summarize-emails
// @desc    Summarize emails
// @access  Private
router.post('/summarize-emails', clerkAuth, aiController.summarizeEmails);

// @route   POST api/ai/daily-summary
// @desc    Generate daily summary
// @access  Private
router.post('/daily-summary', clerkAuth, aiController.generateDailySummary);


module.exports = router;