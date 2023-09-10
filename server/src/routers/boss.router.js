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
    .get('/get-sended-orders', authMiddleware.boss, bossController.getSendedOrders)
    .get('/get-searched-sended-orders/:search', authMiddleware.boss, bossController.getSearchedSendedOrders)
    .get('/get-history-orders', authMiddleware.boss, bossController.getHistoryOrders)
    .post('/set-status-by-date', authMiddleware.boss, bossController.setStatusByDate)
    .get('/get-wait-orders', authMiddleware.boss, bossController.getWaitOrders)
    .post('/set-status-to-new', authMiddleware.boss, bossController.setStatusToNew)
    // 
    .get('/get-operator-pays', authMiddleware.boss, bossController.getOperatorPays)
    .post('/set-operator-pay-status', authMiddleware.boss, bossController.setStatusOperatorPay)
    .get('/get-operator-stats/:id/:date', authMiddleware.boss, bossController.getOperatorStats)
    .get('/search-base/:search', authMiddleware.boss, bossController.searchBase)
    .get('/view-info-order/:id', authMiddleware.boss, bossController.getInfoOrder)
    .put('/edit-info-order/:id', authMiddleware.boss, bossController.setInfoOrder)
    .get('/get-users', authMiddleware.boss, bossController.getAllUsers)
    .get('/set-targetolog/:id', authMiddleware.boss, bossController.setTargetlolog)
    .get('/remove-targetolog/:id', authMiddleware.boss, bossController.removeTargetolog)
    .post('/add-money-to-operator/:id', authMiddleware.boss, bossController.addMoneyToOperator)
    .get('/get-admin-stats/:date', authMiddleware.boss, bossController.getStatAdmins)
    .get('/get-all-cheques', authMiddleware.boss, bossController.getAllCheques)
    .post('/set-status-by-id', authMiddleware.boss, bossController.setStatusById)