const express = require('express');

const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const mongoose = require('mongoose');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/User');

// we don't use app, we use router.

// @route GET api/users
// @desc Register User
// @access public

router.post('/', [
  // Validation
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Enter a valid email').isEmail(),
  check('password', 'Please enter a password. Min length : 6').isLength({ min: 6 }),
],
// eslint-disable-next-line consistent-return
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // if there are errors return them
    return res.status(400).json({ errors: errors.array() });
  }
  // destructure these value from req.body to improve readability
  const { name, email, password } = req.body;

  try {
    // Check if user exists already
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User Already Taken' }] });
    }
    // Get user gravatar, if available
    const avatar = gravatar.url(email, {
      s: '200', // img size
      r: 'pg', // img rating
      d: 'mm', // default
    });

    // encrypt password using bcrypt, and return the jwt.
    // new User from UserSchema
    user = new User({
      name,
      email,
      avatar,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    // user finally saved after hash.

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
    res.status(500);
    return res.send('server error');
  }
});

module.exports = router;
