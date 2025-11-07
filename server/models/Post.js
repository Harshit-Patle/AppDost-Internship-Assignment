
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Post text is required'],
    },
    // Optional base64 encoded image (data URL). We keep as String.
    // Expect format: data:<mime>;base64,<data>
    image: {
        type: String,
        default: null,
    },
    // We save the user's name directly for easy display
    userName: {
        type: String,
        required: true,
    },
    // We save a reference to the User model
    // This lets us do more advanced things later if needed
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // We use `default: Date.now` so MongoDB automatically sets
    // the creation time when a new post is made.
    createdAt: {
        type: Date,
        default: Date.now,
    },
    // Array to store likes with userId and userName
    likes: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            userName: String,
        }
    ],
    // Array to store comments
    comments: [
        {
            _id: mongoose.Schema.Types.ObjectId,
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            userName: String,
            text: String,
            createdAt: {
                type: Date,
                default: Date.now,
            },
        }
    ],
});

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;