const bossController = require('../controllers/boss.controller');
const authMiddleware = require('../middlewares/auth.middleware');

module.exports = require('express').Router()
    .post('/signin', bossController.signin)
    .get('/verify', authMiddleware.boss, bossController.verify)
    .get('/get-dashboard/:date', authMiddleware.boss, bossController.getDashboard)
    .get('/get-new-orders', authMiddleware.boss, bossController.getNewOrders)
    .get('/get-info-order/:id', authMiddleware.boss, bossController.getOrder)
    .get('/get-cheque-order/:id', authMiddleware.boss, bossController.getChequeOrder)
    .post('/set-status-order/:id', authMiddleware.boss, bossController.setStatusOrder)