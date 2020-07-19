const { Router } = require('express');
const chatController = require('../controllers/chatController');

const router = Router();

router.route('/').get(chatController.getChats);
router.route('/messages/:room').get(chatController.getMessages);

module.exports = router;
