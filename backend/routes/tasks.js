const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

// @route   GET api/tasks
// @desc    Get all tasks for a user
// @access  Private
router.get('/', auth, taskController.getTasks);

// @route   GET api/tasks/:id
// @desc    Get a specific task
// @access  Private
router.get('/:id', auth, taskController.getTask);

// @route   POST api/tasks
// @desc    Create a task
// @access  Private
router.post('/', [
  auth,
  [
    check('title', 'Title is required').not().isEmpty()
  ]
], taskController.createTask);

// @route   PUT api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', auth, taskController.updateTask);

// @route   DELETE api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', auth, taskController.deleteTask);

// @route   POST api/tasks/prioritize
// @desc    Smart prioritize tasks
// @access  Private
router.post('/prioritize', auth, taskController.prioritizeTasks);

module.exports = router; 