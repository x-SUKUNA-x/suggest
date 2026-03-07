require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const watchlistRoutes = require('./routes/watchlist');
const Watchlist = require('./models/Watchlist'); // Import model to ensure it gets synced
const User = require('./models/User'); // Ensure order before Watchlist
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (
            origin.includes("vercel.app") ||
            origin.includes("localhost")
        ) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.options('*', cors());

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/watchlist', watchlistRoutes);

// Error Handler Middleware
app.use(errorHandler);
// Handle Production Serverless (Vercel) vs Local Execution
if (process.env.NODE_ENV !== 'production') {
    sequelize.sync({ alter: true }).then(() => {
        console.log('Database connected and synced');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    }).catch(err => console.error('Database connection error:', err));
} else {
    // In production Vercel Serverless, we do not call app.listen()
    // It's handled by Vercel automatically. We just ensure DB syncs
    sequelize.sync({ alter: true }).catch(err => console.error('DB connection error:', err));
}

// Crucial: Export the app for Vercel serverless functions
module.exports = app;
