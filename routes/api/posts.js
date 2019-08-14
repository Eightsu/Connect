/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const express = require('express');

const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');
const User = require('../../models/User');
// we don't use app, we use router.


// @route POST api/post
// @desc Create a post
// @access private

router.post('/', [auth, [
  check('text', 'Text is required.').not().isEmpty(),
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id).select('-password');
    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id,
    });
    const post = await newPost.save();
    return res.json(post);
  } catch (e) {
    console.error(e.message);
    return res.status(500).send('Server Error');
  }
});

// @route GET api/post
// @desc Get all posts
// @access private

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    return res.json(posts);
  } catch (e) {
    console.error(e.message);
    return res.status(500).send('Server Error');
  }
});

// @route GET api/post/:id
// @desc Get post by id
// @access private

router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send('Post not found');
    }
    return res.json(post);
  } catch (e) {
    if (e.kind === 'ObjectId') {
      return res.status(404).json('Post not found');
    }
    console.error(e.message);
    return res.status(500).send('Server Error');
  }
});

// @route GET api/post/:id
// @desc Delete post by id
// @access private

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found.' });
    }

    if (post.user.toString() !== req.user.id) { // no explicit this
      res.status(401).json({ msg: 'user not authorized.' });
    } else {
      console.log(post);
      await post.remove(); // REMOVE POST
      return res.json('post removed');
    }
  } catch (e) {
    if (e.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found.' });
    }
    console.error(e.message);
    return res.status(500).send('Server Error');
  }
  return null;
});

// @route GET api/post/like/:id
// @desc Like a post
// @access public

router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({ msg: 'Post already liked.' });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    return res.json(post.likes);
  } catch (e) {
    console.error(e.message);
    return res.status(500).send('Server Error');
  }
});

// @route GET api/post/unlike/:id
// @desc unLike a post
// @access public
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
      return res.status(400).json({ msg: 'post hasn\'t been liked.' });
    }
    const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);

    await post.save();
    return res.json(post.likes);
  } catch (e) {
    console.error(e.message);
    return res.status(500).send('Server Error');
  }
});

// @route POST api/posts/comments
// @desc Comment on a post
// @access private

router.post('/comment/:id', [auth, [
  check('text', 'Text is required.').not().isEmpty(),
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id).select('-password');
    const post = await Post.findById(req.params.id);

    const newComment = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id,
    };

    post.comments.unshift(newComment);
    await post.save();

    return res.json(post.comments);
  } catch (e) {
    console.error(e.message);
    return res.status(500).send('Server Error');
  }
});

// @route DELETE  api/posts/comment/:id/:comment_id
// @desc  Delete comment from post
// @access public

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    // get post
    const post = await Post.findById(req.params.id);

    // grab comment
    const comment = post.comments.find(comment => comment.id === req.params.comment_id);

    if (!comment) {
      return res.status(404).json({ msg: 'comment does not exist.' });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'user is not authorized.' });
    }


    const removeIndex = post.comments
      .map(comment => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save();
    return res.json(post.comments);
  } catch (e) {
    console.error(e.message);
    return res.status(500).send('Server Error');
  }
});

module.exports = router;
