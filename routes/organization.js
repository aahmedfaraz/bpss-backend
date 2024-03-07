const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Organization = require('../models/Organization');

const isUniqueName = async (value, { req }) => {
  const existingOrganization = await Organization.findOne({ name: value }); 
  if (existingOrganization) {
    throw new Error('Organization name already exists');
  }
  return true;
};


// **Create (POST) - /organization**
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('name', 'Name must be unique').custom(isUniqueName),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, ...otherData } = req.body;

  try {
    const organization = new Organization({ name, ...otherData });
    await organization.save();
    res.json({ message: 'Organization created successfully!', organization });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// **Read All (GET) - /organization**
router.get('/', async (req, res) => {
  try {
    const organizations = await Organization.find();
    res.json(organizations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// **Read One (GET) - /organization/:id**
router.get('/:id', async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    res.json(organization);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid organization ID' });
    }
    res.status(500).send('Server error');
  }
});

// **Update (PUT) - /organization/:id** (Optional)
// Add this route if you need to update organization details

// **Delete (DELETE) - /organization/:id** (Optional with Caution)
// Add this route if you need to delete organizations, but consider "soft delete"

module.exports = router;
