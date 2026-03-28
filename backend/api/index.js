require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('../config/database');
const authRoutes = require('../routes/auth');
const watchlistRoutes = require('../routes/watchlist');
const Watchlist = require('../models/Watchlist'); // Import model to ensure it gets synced
const User = require('../models/User'); // Ensure order before Watchlist
const { errorHandler } = require('../middleware/errorMiddleware');

const app = express();

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (origin.includes('vercel.app') || origin.includes('localhost')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options('*', cors());

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/watchlist', watchlistRoutes);

// Error Handler Middleware
app.use(errorHandler);

// Sync DB and start server (for Render / local dev)
// On serverless (Vercel), this block is skipped since module.exports handles it
const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV === 'production') {
    // Render: sync DB then start listening
    sequelize.sync({ alter: true })
        .then(() => {
            console.log('Database connected and synced');
            app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        })
        .catch(err => console.error('DB connection error:', err));
} else {
    // Local dev
    sequelize.sync({ alter: true })
        .then(() => {
            console.log('Database connected and synced');
            app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        })
        .catch(err => console.error('DB connection error:', err));
}

// Export the app (for testing or future Vercel use)
module.exports = app;
