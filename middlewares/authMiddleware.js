const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: 'Unauthorized: no token provided' });

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ message: 'Unauthorized: user not found' });
        if (user.status === 'blocked') return res.status(403).json({ message: 'Forbidden: user is blocked' });

        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Unauthorized: invalid token' });
    }
};

module.exports = authMiddleware;
