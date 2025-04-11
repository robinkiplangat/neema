const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const noteController = require('../controllers/noteController');
const auth = require('../middleware/auth');

// @route   GET api/notes
// @desc    Get all notes for a user
// @access  Private
router.get('/', auth, noteController.getNotes);

// @route   GET api/notes/:id
// @desc    Get a specific note
// @access  Private
router.get('/:id', auth, noteController.getNote);

// @route   POST api/notes
// @desc    Create a note
// @access  Private
router.post('/', [
  auth,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('content', 'Content is required').not().isEmpty()
  ]
], noteController.createNote);

// @route   PUT api/notes/:id
// @desc    Update a note
// @access  Private
router.put('/:id', auth, noteController.updateNote);

// @route   DELETE api/notes/:id
// @desc    Delete a note (archive)
// @access  Private
router.delete('/:id', auth, noteController.deleteNote);

// @route   DELETE api/notes/:id/permanent
// @desc    Permanently delete a note
// @access  Private
router.delete('/:id/permanent', auth, noteController.permanentlyDeleteNote);

// @route   POST api/notes/:id/summarize
// @desc    Generate summary for a note
// @access  Private
router.post('/:id/summarize', auth, noteController.summarizeNote);

module.exports = router; 