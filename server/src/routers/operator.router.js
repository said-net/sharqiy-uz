const operatorController = require('../controllers/operator.controller');
const authMiddleware = require('../middlewares/auth.middleware');

module.exports = require('express').Router()
    .post('/create', authMiddleware.boss, operatorController.create)
    .get('/getall', authMiddleware.boss, operatorController.getAll)
    .put('/edit/:id', authMiddleware.boss, operatorController.edit)
    .put('/set-ban/:id', authMiddleware.boss, operatorController.setBan)
    .put('/remove-ban/:id', authMiddleware.boss, operatorController.removeBan)


    // 
    .post('/sign-in', operatorController.signIn)
    .get('/verify-session', authMiddleware.operator, operatorController.verifySession)
    // 
    .get('/get-new-orders', authMiddleware.operator, operatorController.getNewOrders)
    .post('/take-new-order/:id', authMiddleware.operator, operatorController.takeOrder)
    .get('/get-my-orders', authMiddleware.operator, operatorController.getMyOrders)
    .get('/get-info-order/:id', authMiddleware.operator, operatorController.getInfoOrder)
    .post('/set-status/:id', authMiddleware.operator, operatorController.setStatus)