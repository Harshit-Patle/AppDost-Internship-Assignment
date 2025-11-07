
// 1. IMPORT PACKAGES
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// 2. CONFIGURE ENVIRONMENT
dotenv.config(); // Loads variables from .env file into process.env
const app = express(); // Initialize our Express server
const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000

// 3. APPLY MIDDLEWARE
app.use(cors()); // Allows cross-origin requests (from your React app)
// Increase JSON limit to support base64 encoded images (~ up to several MB)
app.use(express.json({ limit: '5mb' })); // Allows server to accept and parse JSON in request bodies (with images)

// 4. DEFINE A SIMPLE TEST ROUTE
app.get('/', (req, res) => {
    res.send('LinkedIn Clone API is running!');
});

// 5. IMPORT AND USE API ROUTES
// We will create these files next
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// 6. CONNECT TO MONGODB AND START SERVER
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Successfully connected to MongoDB');
        // Only start the server if the database connection is successful
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Database connection error:', err);
        process.exit(1); // Exit the process with an error
    });