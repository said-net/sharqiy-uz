const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

module.exports = require('express').Router()
    .post('/request-sms', userController.requestSMS)
    .post('/verify-code', userController.verifyCode)
    .post('/signin-with-pass', userController.signInWithPassword)
    // 
    .get('/verify-auth', authMiddleware.user, userController.verifyAuth)
    .post('/edit-informations', authMiddleware.user, userController.editInformations)
    // 
    .get('/get-shop-history', authMiddleware.user, userController.getShopHistory)
    .get('/set-like/:id', authMiddleware.user, userController.setLike)
    .get('/get-likes', authMiddleware.user, userController.getLikes)
    .get('/get-my-likes', authMiddleware.user, userController.getMyLikes)