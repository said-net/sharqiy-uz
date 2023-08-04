const productController = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/auth.middleware');

module.exports = require('express').Router()
    .post('/create', authMiddleware.boss, productController.create)
    .get('/getall-from-admin', authMiddleware.boss, productController.getAllProductsToAdmin)
    .put('/edit/:id', authMiddleware.boss, productController.edit)
    .get('/getone-from-admin/:id', authMiddleware.boss, productController.getOneToAdmin)
    .get('/get-one/:id', productController.getOne)
    .delete('/delete/:id', authMiddleware.boss, productController.delete)
    .put('/recovery/:id', authMiddleware.boss, productController.recovery)
    .post('/set-bonus/:id', authMiddleware.boss, productController.setBonus)
    .post('/remove-bonus/:id', authMiddleware.boss, productController.removeBonus)
    .put('/add-value/:id', authMiddleware.boss, productController.addValue)
    .post('/set-new-prices/:id', authMiddleware.boss, productController.setNewPrices)
    .post('/set-ads/:id', authMiddleware.boss, productController.setAds)
    // 
    .get('/get-by-category/:id', productController.getProductsByCategory)
    .get('/get-videos', productController.getVideos)
    .get('/get-search/:prefix', productController.getSearch)