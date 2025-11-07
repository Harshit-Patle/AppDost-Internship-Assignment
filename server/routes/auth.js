const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import your User model

// --- 1. SIGNUP ROUTE ---
// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
    // Get name, email, and password from the request body
    const { name, email, password } = req.body;

    try {
        // Check if the user already exists in the database
        let user = await User.findOne({ email });
        if (user) {
            // 400 = Bad Request
            return res.status(400).json({ msg: 'User already exists' });
        }

        // If user doesn't exist, create a new User instance
        user = new User({
            name,
            email,
            password,
            // Note: The password hashing is handled by the "pre-save" hook
            // in your User.js model file!
        });

        // Save the new user to the database
        await user.save();

        // --- Create and send a JSON Web Token (JWT) ---
        const payload = {
            user: {
                id: user.id, // The user's unique _id from MongoDB
                name: user.name, // Include user's name
            },
        };

        // Sign the token
        jwt.sign(
            payload,
            process.env.JWT_SECRET, // Your secret key from .env
            { expiresIn: '1d' }, // Token expires in 1 day
            (err, token) => {
                if (err) throw err;
                // Send the token, user's name, and user ID back to the client
                res.status(201).json({
                    token,
                    name: user.name,
                    _id: user.id,
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// --- 2. LOGIN ROUTE ---
// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Compare the entered password with the hashed password in the database
        // We use the "comparePassword" method we defined in the User.js model
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // If password is correct, create and send a JWT (just like in signup)
        const payload = {
            user: {
                id: user.id,
                name: user.name,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                // Send the token, user's name, and user ID
                res.json({
                    token,
                    name: user.name,
                    _id: user.id,
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// --- 3. GET PROFILE ROUTE ---
// @route   GET /api/auth/profile
// @desc    Get user profile data
// @access  Private (requires token)
router.get('/profile', require('../middleware/authMiddleware'), async (req, res) => {
    try {
        // Get user from the request (added by middleware)
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// --- 4. UPDATE PROFILE ROUTE ---
// @route   PUT /api/auth/profile
// @desc    Update user profile (name and bio)
// @access  Private (requires token)
router.put('/profile', require('../middleware/authMiddleware'), async (req, res) => {
    try {
        const { name, bio } = req.body;

        // Find the user
        let user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Update name if provided
        if (name) {
            user.name = name;
        } else {
            return res.status(400).json({ msg: 'Name is required' });
        }

        // Update bio if provided
        if (bio !== undefined) {
            user.bio = bio;
        }

        // Save the updated user
        await user.save();

        res.json({
            msg: 'Profile updated successfully',
            user,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router; // Export the router