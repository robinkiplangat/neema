const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const noteController = require('../controllers/noteController');
const { clerkAuth } = require('../middleware/auth');

router.get('/', clerkAuth, noteController.getNotes);
router.get('/:id', clerkAuth, noteController.getNote);
router.post('/', [
  clerkAuth,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('content', 'Content is required').not().isEmpty()
  ]
], noteController.createNote);
router.put('/:id', clerkAuth, noteController.updateNote);
router.delete('/:id', clerkAuth, noteController.deleteNote);
router.delete('/:id/permanent', clerkAuth, noteController.permanentlyDeleteNote);

module.exports = router;