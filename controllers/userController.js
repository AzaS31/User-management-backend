const User = require('../models/userModel');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.getAll();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch users', error: err.message });
    }
};

exports.blockUsers = async (req, res) => {
    try {
        const { userIds } = req.body; 
        if (!Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({ message: 'No users selected' });
        }

        for (const id of userIds) {
            await User.updateStatus(id, 'blocked');
        }

        res.json({ message: 'Selected users blocked successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to block users', error: err.message });
    }
};

exports.unblockUsers = async (req, res) => {
    try {
        const { userIds } = req.body;
        if (!Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({ message: 'No users selected' });
        }

        for (const id of userIds) {
            await User.updateStatus(id, 'active');
        }

        res.json({ message: 'Selected users unblocked successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to unblock users', error: err.message });
    }
};

exports.deleteUsers = async (req, res) => {
    try {
        const { userIds } = req.body;
        if (!Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({ message: 'No users selected' });
        }

        for (const id of userIds) {
            await User.delete(id);
        }

        res.json({ message: 'Selected users deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete users', error: err.message });
    }
};
