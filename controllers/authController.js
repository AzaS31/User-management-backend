const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
require('dotenv').config();

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const userId = await User.create({ name, email, password });

        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
        const confirmLink = `${process.env.FRONTEND_URL}/confirm/${token}`;

        const htmlMessage = `
            <p>Hello ${name},</p>
            <p>Please confirm your email by clicking the link below:</p>
            <p><a href="${confirmLink}">Verify Email</a></p>
            <p>Thank you!</p>
        `;

        sendEmail(email, 'Confirm your account', htmlMessage);

        res.status(201).json({ message: 'User registered! Please check your email to verify.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Registration failed', error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByEmail(email);

        if (!user) return res.status(400).json({ message: 'Invalid email or password' });
        if (user.status === 'blocked') return res.status(403).json({ message: 'User is blocked' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: 'Invalid email or password' });

        await User.updateLastLogin(user.id);

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                status: user.status,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
};

exports.logout = (req, res) => {
    res.json({ message: 'Logged out successfully' });
};
