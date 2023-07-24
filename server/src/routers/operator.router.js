const operatorController = require('../controllers/operator.controller');
const authMiddleware = require('../middlewares/auth.middleware');

module.exports = require('express').Router()
.post('/create', authMiddleware.boss, operatorController.create)
.get('/getall', authMiddleware.boss, operatorController.getAll)
.put('/edit/:id', authMiddleware.boss, operatorController.edit)
.put('/set-ban/:id', authMiddleware.boss, operatorController.setBan)
.put('/remove-ban/:id', authMiddleware.boss, operatorController.removeBan)  