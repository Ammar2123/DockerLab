const express = require('express');
const router = express.Router();
const Semester = require('../models/Semester');
const { isAdmin } = require('../middleware/auth');

// CRUD for semesters (admin)
router.post('/', isAdmin, async (req, res) => {
  const { name } = req.body;
  const sem = await Semester.create({ name });
  res.json(sem);
});
router.get('/', async (req, res) => {
  const semesters = await Semester.find().sort({ name: 1 });
  res.json(semesters);
});
router.put('/:id', isAdmin, async (req, res) => {
  const sem = await Semester.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
  res.json(sem);
});
router.delete('/:id', isAdmin, async (req, res) => {
  await Semester.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});
module.exports = router;