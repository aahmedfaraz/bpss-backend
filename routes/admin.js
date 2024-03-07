const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

const Admin = require('./models/Admin');

// **Create (POST) - /admin**
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Email is required').isEmail().normalizeEmail(),
  check('password', 'Password is required').isLength({ min: 6 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, organizationID } = req.body;

  try {
    const admin = new Admin({
      name,
      email,
      password,
      organizationID,
    });

    await admin.save();

    res.json({ message: 'Admin created successfully!', admin });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// **Read All (GET) - /admin**
router.get('/', async (req, res) => {
  try {
    const admins = await Admin.find().populate('organizationID'); // Populate organization details if needed
    res.json(admins);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// **Read One (GET) - /admin/:id**
router.get('/:id', async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).populate('organizationID'); // Populate organization details if needed
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid admin ID' });
    }
    res.status(500).send('Server error');
  }
});

// **Update (PUT) - /admin/:id**
router.put('/:id', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Email is required').isEmail().normalizeEmail(),
  check('password', 'Password is required').isLength({ min: 6 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, organizationID } = req.body;

  try {
    const admin = await Admin.findByIdAndUpdate(req.params.id, {
      name,
      email,
      password,
      organizationID,
    }, { new: true });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({ message: 'Admin updated successfully!', admin });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid admin ID' });
    }
    res.status(500).send('Server error');
  }
});

// **Delete (DELETE) - /admin/:id**
router.delete('/:id', async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json({ message: 'Admin deleted successfully!' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid admin ID' });
    }
    res.status(500).send('Server error');
  }
});
  
module.exports = router;
  