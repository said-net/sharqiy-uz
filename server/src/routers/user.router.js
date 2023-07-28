const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

module.exports = require('express').Router()
    .post('/request-sms', userController.requestSMS)
    .post('/verify-code', userController.verifyCode)
    .post('/signin-with-pass', userController.signInWithPassword)
    // 
    .get('/verify-auth', authMiddleware.user, userController.verifyAuth)
    .post('/edit-informations', authMiddleware.user, userController.editInformations)