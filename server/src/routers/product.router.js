const productController = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/auth.middleware');

module.exports = require('express').Router()
    .post('/create', authMiddleware.boss, productController.create)
    .get('/getall-from-admin', authMiddleware.boss, productController.getAllProductsToAdmin)
    .get('/getone-from-admin/:id', authMiddleware.boss, productController.getOneToAdmin)
    .get('/get-one/:id', productController.getOne)
    .delete('/delete/:id', authMiddleware.boss, productController.delete)
    .put('/recovery/:id', authMiddleware.boss, productController.recovery)
    .post('/set-bonus/:id', authMiddleware.boss, productController.setBonus)
    .post('/remove-bonus/:id', authMiddleware.boss, productController.removeBonus)
    .put('/add-value/:id', authMiddleware.boss, productController.addValue)

    