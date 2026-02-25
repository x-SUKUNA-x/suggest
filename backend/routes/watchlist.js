const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Get User's Watchlist
router.get('/', protect, async (req, res, next) => {
    try {
        const watchlist = await Watchlist.findAll({ where: { userId: req.user.id } });
        res.json(watchlist);
    } catch (error) {
        res.status(500);
        next(error);
    }
});

// Add to Watchlist
router.post('/', protect, async (req, res, next) => {
    try {
        const { movieId, title, year, image } = req.body;

        if (!movieId || !title) {
            res.status(400);
            return next(new Error('Please provide movie ID and title'));
        }

        // Check if already in watchlist
        const existing = await Watchlist.findOne({ where: { userId: req.user.id, movieId } });
        if (existing) {
            res.status(400);
            return next(new Error('Movie is already in your watchlist'));
        }

        const newItem = await Watchlist.create({
            userId: req.user.id,
            movieId,
            title,
            year,
            image
        });

        res.status(201).json(newItem);
    } catch (error) {
        res.status(500);
        next(error);
    }
});

// Remove from Watchlist
router.delete('/:movieId', protect, async (req, res, next) => {
    try {
        const { movieId } = req.params;
        const result = await Watchlist.destroy({ where: { userId: req.user.id, movieId } });

        if (result === 0) {
            res.status(404);
            return next(new Error('Item not found in watchlist'));
        }
        res.json({ message: 'Removed from watchlist successfully' });
    } catch (error) {
        res.status(500);
        next(error);
    }
});

module.exports = router;
