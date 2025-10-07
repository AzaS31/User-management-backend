const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

// Important: This middleware protects all routes defined below
router.use(authMiddleware); 

router.get('/', userController.getAllUsers);
router.post('/block', userController.blockUsers);
router.post('/unblock', userController.unblockUsers);
router.delete('/', userController.deleteUsers);

module.exports = router;
