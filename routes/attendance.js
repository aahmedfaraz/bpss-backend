const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Attendance = require('../models/Attendance'); // Require the Attendance model

// **Create Attendance (POST) - /attendance**
router.post('/', [
  check('date', 'Date is required').isNumeric(),
  check('month', 'Month is required').isNumeric().isInt({ min: 1, max: 12 }),
  check('year', 'Year is required').isNumeric(),
  check('status', 'Attendance status is required').isBoolean(),
  check('guardID', 'Guard ID is required').isMongoId(), // Use isMongoId for ObjectID validation
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { date, month, year, status, guardID, supervisorID } = req.body;

  try {
    const attendance = new Attendance({ date, month, year, status, guardID, supervisorID });
    await attendance.save();
    res.json({ message: 'Attendance created successfully!', attendance });
  } catch (err) {
    console.error(err.message);
    // Handle duplicate key errors and other potential errors more specifically
    if (err.code === 11000 && err.message.includes('guardID_1_date_1_month_1_year_1')) {
      return res.status(400).json({ message: 'Duplicate attendance entry for this guard on the same date' });
    } else {
      res.status(500).send('Server error');
    }
  }
});

// **Read All Attendance (GET) - /attendance**
router.get('/', async (req, res) => {
  try {
    const attendances = await Attendance.find().populate('guardID').populate('supervisorID'); // Populate related data
    res.json(attendances);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// **Read One Attendance (GET) - /attendance/:id**
router.get('/:id', async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id).populate('guardID').populate('supervisorID');
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance not found' });
    }
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid attendance ID' });
    }
    res.status(500).send('Server error');
  }
});


module.exports = router

// **Update Attendance (PUT) - /attendance/:id** (to be implemented)

// **Delete Attendance (DELETE) - /attendance/:id** (to
