const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
// Signup
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });

        // Return a secure token immediately upon signup
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ message: 'User created successfully', token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(400);
            return next(new Error('Email or username already exists'));
        }
        res.status(400);
        next(error);
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400);
            return next(new Error('Please provide an email and password'));
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            res.status(401);
            return next(new Error('Invalid email or password'));
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401);
            return next(new Error('Invalid email or password'));
        }

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500);
        next(error);
    }
});

// Profile (Protected)
router.get('/profile', protect, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
        if (!user) {
            res.status(404);
            return next(new Error('User not found'));
        }
        res.json(user);
    } catch (error) {
        res.status(500);
        next(error);
    }
});

module.exports = router;
