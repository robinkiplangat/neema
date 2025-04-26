const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');

// @route   GET api/events
// @desc    Get events within date range
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find({
      user: req.user.id,
      start: { $gte: new Date(req.query.start) },
      end: { $lte: new Date(req.query.end) }
    });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;