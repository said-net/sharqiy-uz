const chatController = require('../controllers/chat.controller');
const authMiddleware = require('../middlewares/auth.middleware');

module.exports = require('express').Router()
    .get('/get-my-messages', authMiddleware.user, chatController.getMessages)
    .post('/new-user-message', authMiddleware.user, chatController.newMessage)
    .post('/new-boss-message/:id', authMiddleware.boss, chatController.newMessageFromAdmin)
    .get('/get-chats', authMiddleware.boss, chatController.getChats)
    .get('/select-chat/:id', authMiddleware.boss, chatController.selectChat)