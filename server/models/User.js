const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true, // No two users can have the same email
        match: [
            // Regex to validate email format
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6, // Enforce a minimum password length
    },
    bio: {
        type: String,
        default: '', // Optional bio field
        maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
});

// This "middleware" function runs *before* a new user is saved
UserSchema.pre('save', async function (next) {
    // If the password wasn't modified, skip hashing (e.g., on profile update)
    if (!this.isModified('password')) {
        next();
    }

    // Generate a "salt" to make the hash unique
    const salt = await bcrypt.genSalt(10);
    // Hash the user's password
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Helper method to compare passwords during login
UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Create and export the model
const User = mongoose.model('User', UserSchema);
module.exports = User;