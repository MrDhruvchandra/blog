import express from 'express';
import { Post } from '../models/Post.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Middleware for authorization
const authorize = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.authorId !== req.body.authorId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    req.post = post; // Attach post for subsequent handlers
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all posts with pagination
router.get('/', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create post with validation
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('authorId').notEmpty().withMessage('Author ID is required'),
    body('authorName').notEmpty().withMessage('Author name is required'),
    body('authorAvatar').notEmpty().withMessage('Author avatar is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      authorId: req.body.authorId,
      authorName: req.body.authorName,
      authorAvatar: req.body.authorAvatar,
    });

    try {
      const newPost = await post.save();
      res.status(201).json(newPost);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Update post with authorization
router.patch('/:id', authorize, async (req, res) => {
  try {
    Object.assign(req.post, req.body);
    const updatedPost = await req.post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete post with authorization
router.delete('/:id', authorize, async (req, res) => {
  try {
    await req.post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add highlight to a post
router.post('/:id/highlights', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.highlights.push(req.body);
    const updatedPost = await post.save();
    res.status(201).json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export { router as postRoutes };
