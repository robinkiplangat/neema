const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');

// @route   GET api/projects
// @desc    Get all projects for a user
// @access  Private
router.get('/', auth, projectController.getProjects);

// @route   GET api/projects/:id
// @desc    Get a specific project
// @access  Private
router.get('/:id', auth, projectController.getProject);

// @route   POST api/projects
// @desc    Create a project
// @access  Private
router.post('/', [
  auth,
  [
    check('name', 'Project name is required').not().isEmpty()
  ]
], projectController.createProject);

// @route   PUT api/projects/:id
// @desc    Update a project
// @access  Private
router.put('/:id', auth, projectController.updateProject);

// @route   DELETE api/projects/:id
// @desc    Delete a project
// @access  Private
router.delete('/:id', auth, projectController.deleteProject);

// @route   GET api/projects/:id/tasks
// @desc    Get tasks for a project
// @access  Private
router.get('/:id/tasks', auth, projectController.getProjectTasks);

module.exports = router; 