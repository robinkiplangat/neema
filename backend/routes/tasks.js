const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const controller = require('../controllers/taskController').default || require('../controllers/taskController');

const { clerkAuth } = require('../middleware/auth');

// @route   GET api/tasks
// @desc    Get all tasks for a user
// @access  Private
router.get('/', clerkAuth, controller.getTasks);

// @route   GET api/tasks/:id
// @desc    Get a specific task
// @access  Private
router.get('/:id', clerkAuth, controller.getTask);

// @route   POST api/tasks
// @desc    Create a task
// @access  Private
router.post('/', [
  clerkAuth,
  [
    check('title', 'Title is required').not().isEmpty()
  ]
], controller.createTask);

// @route   PUT api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', clerkAuth, controller.updateTask);

// @route   DELETE api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', clerkAuth, controller.deleteTask);

// @route   POST api/tasks/prioritize
// @desc    Smart prioritize tasks
// @access  Private
router.post('/prioritize', clerkAuth, controller.prioritizeTasks);

module.exports = router;