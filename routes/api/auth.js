const express = require('express');

const router = express.Router();

const { check, validationResult } = require('express-validator/check');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const auth = require('../../middleware/auth');


// we don't use app, we use router.

// @route GET api/auth
// @desc Authentica User & Get Token
// @access public

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error.');
  }
});

router.post('/', [
  // Validation
  check('email', 'Enter a valid email').isEmail(),
  check('password', 'Password is required.').exists(),
],
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // if there are errors return them
    return res.status(400).json({ errors: errors.array() });
  }
  // destructure these value from req.body to improve readability
  const { email, password } = req.body;

  try {
    // Check if user exists already
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    // create payload
    const payload = {
      user: {
        id: user.id,
      },
    };
    // return the jwt so user can be auto logged in after registering.
    jwt.sign(payload, config.get('jwtSecret'),
      { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        return res.json({ token });
      });
    // 3600 would give you an hour.
  } catch (e) {
    console.error(e.message);
    res.status(500);
    return res.send('server error');
  }
});

module.exports = router;
