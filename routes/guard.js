const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose')
const Guard = require('../models/Guard');

const isUniqueCNIC = async (value, { req }) => {
  const existingGuard = await Guard.findOne({ cnic: value });
  if (existingGuard) {
    throw new Error('CNIC already exists');
  }
  return true;
};

// **Create (POST) - /guard**
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('cnic', 'CNIC is required').not().isEmpty().isLength({ min: 13, max: 13 }), // Assuming Pakistani CNIC format
  check('cnic', 'CNIC must be unique').custom(isUniqueCNIC),
  check('age', 'Age is required').isNumeric().isInt({ min: 18 }), // Assuming minimum guard age is 18
  check('supervisorID', 'Supervisor ID is required').custom(mongoose.Types.ObjectId.isValid()),
  check('locationID', 'Location ID is required').custom(mongoose.Types.ObjectId.isValid()),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, cnic, age, supervisorID, locationID, organizationID, ...otherData } = req.body;

  try {
    const guard = new Guard({ name, cnic, age, supervisorID, locationID, organizationID, ...otherData });
    await guard.save();
    res.json({ message: 'Guard created successfully!', guard });
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000 && err.message.includes('cnic')) {
      return res.status(400).json({ message: 'CNIC already exists' });
    }
    res.status(500).send('Server error');
  }
});

// **Read All (GET) - /guard**
router.get('/', async (req, res) => {
  try {
    const guards = await Guard.find().populate('supervisorID').populate('locationID').populate('organizationID');
    res.json(guards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// **Read One (GET) - /guard/:id**
router.get('/:id', async (req, res) => {
  try {
    const guard = await Guard.findById(req.params.id).populate('supervisorID').populate('locationID').populate('organizationID');
    if (!guard) {
      return res.status(404).json({ message: 'Guard not found' });
    }
    res.json(guard);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid guard ID' });
    }
    res.status(500).send('Server error');
  }
});

// **Update (PUT) - /guard/:id**
router.put('/:id', [
  check('name', 'Name is required').not().isEmpty(),
  check('cnic', 'CNIC is required').not().isEmpty().isLength({ min: 13, max: 13 }), // Assuming Pakistani CNIC format
  check('age', 'Age is required').isNumeric().isInt({ min: 18 }), // Assuming minimum guard age is 18
  check('supervisorID', 'Supervisor ID is required').custom(mongoose.Types.ObjectId.isValid()),
  check('locationID', 'Location ID is required').custom(mongoose.Types.ObjectId.isValid()),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, cnic, age, supervisorID, locationID, organizationID, ...otherData } = req.body;

  try {
    const updateData = { name, cnic, age, supervisorID, locationID, organizationID, ...otherData };
    const guard = await Guard.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!guard) {
      return res.status(404).json({ message: 'Guard not found' });
    }
    res.json({ message: 'Guard updated successfully!', guard });
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000 && err.message.includes('cnic')) {
      return res.status(400).json({ message: 'CNIC already exists' });
    }
    res.status(500).send('Server error');
  }
});

// **Delete (DELETE) - /guard/:id**
router.delete('/:id', async (req, res) => {
  try {
    const guard = await Guard.findByIdAndDelete(req.params.id);
    if (!guard) {
      return res.status(404).json({ message: 'Guard not found' });
    }
    res.json({ message: 'Guard deleted successfully!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router