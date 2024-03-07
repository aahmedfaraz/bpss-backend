const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Supervisor = require('../models/Supervisor');

// **Create (POST) - /supervisor**
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Email is required').isEmail().normalizeEmail(),
  // Password validation removed (assuming separate password handling)
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, locationID, organizationID, ...otherData } = req.body;

  try {
    // Implement your preferred password handling logic here (e.g., storing plain text passwords is not recommended)
    const supervisor = new Supervisor({
      name,
      email,
      // Password field removed (assuming separate handling)
      locationID,
      organizationID,
      ...otherData,
    });

    await supervisor.save();
    res.json({ message: 'Supervisor created successfully!', supervisor });
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000 && err.message.includes('email')) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).send('Server error');
  }
});

// **Read All (GET) - /supervisor**
router.get('/', async (req, res) => {
  try {
    const supervisors = await Supervisor.find().populate('locationID').populate('organizationID');
    res.json(supervisors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// **Read One (GET) - /supervisor/:id**
router.get('/:id', async (req, res) => {
  try {
    const supervisor = await Supervisor.findById(req.params.id).populate('locationID').populate('organizationID');
    if (!supervisor) {
      return res.status(404).json({ message: 'Supervisor not found' });
    }
    res.json(supervisor);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid supervisor ID' });
    }
    res.status(500).send('Server error');
  }
});

// **Update (PUT) - /supervisor/:id**
router.put('/:id', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Email is required').isEmail().normalizeEmail(),
  // Password validation removed (assuming separate handling)
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, locationID, organizationID, ...otherData } = req.body;

  try {
    let updateData = { name, locationID, organizationID, ...otherData };
    // Implement logic to update password if provided (separate from this route)

    const supervisor = await Supervisor.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!supervisor) {
      return res.status(404).json({ message: 'Supervisor not found' });
    }

    res.json({ message: 'Supervisor updated successfully!', supervisor });
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000 && err.message.includes('email')) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
