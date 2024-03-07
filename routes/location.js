const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Location = require('../models/Location');

const isUniqueAddress = async (value, { req }) => {
  const existingGuard = await Guard.findOne({ address: value });
  if (existingGuard) {
    throw new Error('Location already exists for this address');
  }
  return true;
};

// **Create (POST) - /location**
router.post('/', [
  check('address', 'Address is required').not().isEmpty(),
  check('city', 'City is required').not().isEmpty(),
  check('address', 'Address must be unique').custom(isUniqueAddress),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { address, city, organizationID, ...otherData } = req.body;

  try {
    const location = new Location({ address, city, organizationID, ...otherData });
    await location.save();
    res.json({ message: 'Location created successfully!', location });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// **Read All (GET) - /location**
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find().populate('organizationID'); // Populate organization details if needed
    res.json(locations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// **Read One (GET) - /location/:id**
router.get('/:id', async (req, res) => {
  try {
    const location = await Location.findById(req.params.id).populate('organizationID'); // Populate organization details if needed
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json(location);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid location ID' });
    }
    res.status(500).send('Server error');
  }
});

// **Update (PUT) - /location/:id**
router.put('/:id', [
  check('address', 'Address is required').not().isEmpty(),
  check('city', 'City is required').not().isEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { address, city, organizationID, ...otherData } = req.body;

  try {
    const location = await Location.findByIdAndUpdate(req.params.id, {
      address,
      city,
      organizationID,
      ...otherData,
    }, { new: true });

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json({ message: 'Location updated successfully!', location });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid location ID' });
    }
    res.status(500).send('Server error');
  }
});

// **Delete (DELETE) - /location/:id**
router.delete('/:id', async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json({ message: 'Location deleted successfully!' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid location ID' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router
