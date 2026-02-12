const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middlewares/auth.middleware');

router.get('/conversations', protect, chatController.getConversations);
router.get('/messages/:userId', protect, chatController.getMessages);
router.post('/send', protect, chatController.sendMessage);

module.exports = router;