const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const emailController = require('../controllers/emailController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/confirm/:token', emailController.confirmEmail);

// note: this route is used by frontend to verify if user is still authenticated
router.get('/check', authMiddleware, (req, res) => {
    res.json({ authenticated: true });
});

router.post('/logout', (req, res) => {
    res.clearCookie('token', { httpOnly: true, sameSite: 'Strict' });
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
