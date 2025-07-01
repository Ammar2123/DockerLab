const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');
const Lab = require('../models/Lab');
const { isAdmin } = require('../middleware/auth');

// Get top labs by access count (admin)
router.get('/top-labs', isAdmin, async (req, res) => {
  const topLabs = await Lab.find().sort({ 'analytics.accessed': -1 }).limit(10);
  res.json(topLabs);
});

// Get analytics timeline (admin)
router.get('/timeline', isAdmin, async (req, res) => {
  // Returns [{labId, accessedAt}]
  const data = await Analytics.find().populate('labId', 'name');
  res.json(data);
});

module.exports = router;