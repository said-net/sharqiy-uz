const categoryController = require('../controllers/category.controller');
const authMiddleware = require('../middlewares/auth.middleware');

module.exports = require('express').Router()
    .post('/create', authMiddleware.boss, categoryController.create)
    .get('/getall', categoryController.getAll)