const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
require('dotenv').config();

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });
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

        // Note: JWT token is stored in HTTP-only cookie for security
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, {
            httpOnly: true,
            // Note: use secure cookies only in production (HTTPS), otherwise they won't work on localhost
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({
            message: 'Login successful',
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

