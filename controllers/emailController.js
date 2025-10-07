const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

exports.confirmEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) return res.status(400).json({ success: false, message: 'User not found' });

        await User.updateStatus(user.id, 'active');

        res.json({ success: true, message: 'Email confirmed' });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }
};
