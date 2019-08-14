/* eslint-disable no-console */
const express = require('express');

const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const request = require('request');
const config = require('config');
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');


// we don't use app, we use router.

// @route GET api/profile/me
// @desc Get Current User profile
// @access private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile connected to this user.' });
    }
    return res.json(profile);
  } catch (e) {
    console.error(e.message);
    return res.status(500).send('Server Error');
  }
});

// @route POST api/profile
// @desc  Create or update user profile
// @access private
router.post('/', auth, [
  check('status', 'Status is required').not().isEmpty(),
  check('skills', 'Skills are required').not().isEmpty(),

], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const
    {
      company, website, location,
      bio, status, githubusername,
      skills, youtube, facebook,
      twitter, instagram, linkedin,
    } = req.body;
  // now build profile object.
  const profileFields = {};
  profileFields.user = req.user.id;
  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status;
  if (githubusername) profileFields.githubusername = githubusername;
  if (skills) {
    profileFields.skills = skills.split(',').map(skill => skill.trim().toUpperCase());
  }
  // build the social object
  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (facebook) profileFields.social.facebook = facebook;
  if (twitter) profileFields.social.twitter = twitter;
  if (instagram) profileFields.social.instagram = instagram;
  if (linkedin) profileFields.social.linkedin = linkedin;

  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (profile) {
      // update profile if found
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true },
      );
      return res.json(profile); // return the entire profile.
    }
    // if not found, create profile

    profile = new Profile(profileFields);
    await profile.save(); // save profile
    return res.json(profile); // render json data
  } catch (e) {
    console.error(e.message);
    return res.status(500).send('Server Errror');
  }
});

// @route GET api/profile
// @desc  Get all profiles
// @access publice
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    return res.json(profiles);
  } catch (e) {
    console.error(e.message);
    return res.status(500).send('Server Error.');
  }
});

// @route GET api/profile/user/:user_id
// @desc  Get profile by user_id
// @access public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);


    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    return res.json(profile);
  } catch (e) {
    console.error(e.message);
    if (e.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
  }
  return res.status(500).send('Server Error.');
});

// @route Delete api/profile/user/:user_id
// @desc  Delete User, Profile, and post
// @access private
router.delete('/', auth, async (req, res) => {
  try {
    await Post.deleteMany({ user: req.user.id });
    await Profile.findOneAndRemove({ user: req.user.id }); // Remove profile
    await User.findOneAndRemove({ _id: req.user.id }); // Remove User
    return res.json({ msg: 'deletion completed.' });
  } catch (e) {
    console.error(e.message);
    return res.status(500).send('Server Error.');
  }
});

// @route PUT api/profile/experience
// @desc  Add experience to Profile
// @access private
router.put('/experience', [
  auth,
  [
    check('title', 'Title is required!').not().isEmpty(),
    check('company', 'Company is required!').not().isEmpty(),
    check('from', 'From data is required!').not().isEmpty(),
  ]],
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { // As usual check for errors
    return res.status(400).json({ errors: errors.array() });
  }
  const {
    title, company, location, from, to, current, description,
  } = req.body;

  const exp = {
    title, company, location, from, to, current, description,
  };

  try {
    const profile = await Profile.findOne({ user: req.user.id });
    profile.experience.unshift(exp);
    await profile.save();
    return res.json(profile);
  } catch (e) {
    console.error(e.message);
    return res.status(500).send('Server Error');
  }
});

// @route DELETE  api/profile/experience/:exp_id
// @desc  Delete experience entry from Profile
// @access private

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }); // Get User Id

    // Get index of remove
    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1); // remove at index number
    profile.save();
    console.log('Experience Deleted.');

    return res.json(profile);
  } catch (e) {
    console.error(e.message);
    return res.status(500).send('Server Error');
  }
});

// @route PUT api/profile/education
// @desc  Add education to Profile
// @access private
router.put('/education', [
  auth,
  [
    check('school', 'Company is required!').not().isEmpty(),
    check('degree', 'From data is required!').not().isEmpty(),
    check('fieldofstudy', 'From data is required!').not().isEmpty(),
    check('from', 'From data is required!').not().isEmpty(),

  ]],
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { // As usual check for errors
    return res.status(400).json({ errors: errors.array() });
  }
  const {
    school, degree, fieldofstudy, from, to, current, description,
  } = req.body;

  const newEducation = {
    school, degree, fieldofstudy, from, to, current, description,
  };

  try {
    const profile = await Profile.findOne({ user: req.user.id });
    profile.education.unshift(newEducation);
    await profile.save();
    return res.json(profile);
  } catch (e) {
    console.error(e.message);
    return res.status(500).send('Server Error');
  }
});

// @route DELETE  api/profile/education/:edu_id
// @desc  Delete education entry from Profile
// @access private

router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }); // Get User Id

    // Get index of remove
    const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1); // remove at index number
    profile.save();

    return res.json(profile);
  } catch (e) {
    console.error(e.message);
    return res.status(500).send('Server Error');
  }
});

// @route get  api/profile/github/:username
// @desc  get user repos from Github
// @access public

router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };

    request(options, (error, response, body) => {
      if (error) {
        console.error(error.message);
      }

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No Github Profile Found' });
      }

      return res.json(JSON.parse(body));
    });
  } catch (e) {
    console.error(e.message);
    return res.status(500).send('Server Error');
  }
  return null;
});

module.exports = router;
