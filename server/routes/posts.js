

const express = require('express');
const router = express.Router();
const Post = require('../models/Post'); // Import the Post model
const auth = require('../middleware/authMiddleware'); // Import our auth middleware

// --- 1. CREATE A NEW POST ---
// @route   POST /api/posts
// @desc    Create a new post
// @access  Private (we use our 'auth' middleware)
// [cite: 12, 16]
router.post('/', auth, async (req, res) => {
    // 'auth' runs first. If the token is valid, req.user will be set.
    // We get the post's text and optional image (base64) from the request body
    const { text, image } = req.body;

    try {
        // Validate: require at least text or image
        if ((!text || text.trim() === '') && (!image || image.trim() === '')) {
            return res.status(400).json({ msg: 'Please provide text or an image' });
        }

        // We get the user's name and ID from the 'req.user' object
        // that our authMiddleware added.
        const userName = req.user.name;
        const userId = req.user.id;

        // Create a new Post instance
        const newPost = new Post({
            text: text || '',
            image: image || null,
            userName,
            userId,
        });

        // Save the post to the database
        const post = await newPost.save();

        // Send the newly created post back as a response
        res.status(201).json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- 2. GET ALL POSTS ---
// @route   GET /api/posts
// @desc    Get all posts from all users
// @access  Public (everyone can see the feed)
// [cite: 20]
router.get('/', async (req, res) => {
    try {
        // Find all posts in the 'posts' collection
        // .sort({ createdAt: -1 }) ensures the newest posts are first
        // This directly fulfills the "Show the latest posts first" requirement 
        const posts = await Post.find().sort({ createdAt: -1 });

        // Send the array of posts as a JSON response
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- 3. LIKE A POST ---
// @route   POST /api/posts/:id/like
// @desc    Add/remove like from a post
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // Check if user already liked the post
        const likeIndex = post.likes.findIndex(like => like.userId.toString() === req.user.id);

        if (likeIndex > -1) {
            // User already liked - remove the like
            post.likes.splice(likeIndex, 1);
        } else {
            // User hasn't liked - add the like
            post.likes.push({
                userId: req.user.id,
                userName: req.user.name,
            });
        }

        await post.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- 4. ADD COMMENT TO POST ---
// @route   POST /api/posts/:id/comment
// @desc    Add a comment to a post
// @access  Private
router.post('/:id/comment', auth, async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ msg: 'Comment text is required' });
        }

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // Add new comment
        const newComment = {
            _id: new (require('mongoose')).Types.ObjectId(),
            userId: req.user.id,
            userName: req.user.name,
            text,
            createdAt: new Date(),
        };

        post.comments.push(newComment);
        await post.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- 5. DELETE COMMENT FROM POST ---
// @route   DELETE /api/posts/:postId/comment/:commentId
// @desc    Delete a comment from a post
// @access  Private
router.delete('/:postId/comment/:commentId', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        const comment = post.comments.find(c => c._id.toString() === req.params.commentId);
        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }

        // Check if user is comment owner
        if (comment.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized to delete this comment' });
        }

        // Remove comment
        post.comments = post.comments.filter(c => c._id.toString() !== req.params.commentId);
        await post.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- 6. UPDATE/EDIT A POST ---
// @route   PUT /api/posts/:id
// @desc    Edit a post (update text)
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        const { text, image } = req.body;

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // Check if user is post owner
        if (post.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized to edit this post' });
        }

        // Update fields conditionally
        if (typeof text !== 'undefined') {
            post.text = text;
        }
        if (typeof image !== 'undefined') {
            // Send image: null (or empty string) to remove image
            post.image = image && image.trim() !== '' ? image : null;
        }

        // Ensure at least one of text/image remains
        if ((!post.text || post.text.trim() === '') && (!post.image || post.image.trim() === '')) {
            return res.status(400).json({ msg: 'Post cannot be empty. Provide text or image.' });
        }
        await post.save();

        res.json({
            msg: 'Post updated successfully',
            post,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- 7. DELETE A POST ---
// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // Check if user is post owner
        if (post.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized to delete this post' });
        }

        // Delete the post
        await Post.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Post deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;