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

// Ensure DB syncs without starting a server
await sequelize.sync({ alter: true })
    .then(() => console.log('Database connected and synced'))
    .catch(err => console.error('DB connection error:', err));

// Crucial: Export the app for Vercel serverless functions
module.exports = app;
