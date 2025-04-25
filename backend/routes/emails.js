const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Email = require('../models/Email');

// @route   GET api/emails
// @desc    Get user emails
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const emails = await Email.find({ user: req.user.id }).limit(req.query.limit || 20);
    res.json(emails);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;