const bossController = require('../controllers/boss.controller');
const authMiddleware = require('../middlewares/auth.middleware');

module.exports = require('express').Router()
    .post('/signin', bossController.signin)
    .get('/verify', authMiddleware.boss, bossController.verify)
    .get('/get-dashboard/:date', authMiddleware.boss, bossController.getDashboard)
    .get('/get-new-orders/', authMiddleware.boss, bossController.getNewOrders)