const categoryController = require('../controllers/category.controller');
const authMiddleware = require('../middlewares/auth.middleware');

module.exports = require('express').Router()
    //  title, image, background
    .post('/create', authMiddleware.boss, categoryController.create)
    // return data[{id, title, image, background}]
    .get('/getall', categoryController.getAll)
    // param: id; body: title, background, image?
    .put('/edit/:id', authMiddleware.boss, categoryController.edit)
    // param: id;
    .delete('/delete/:id', authMiddleware.boss, categoryController.delete)
    // param: id;
    .put('/recovery/:id', authMiddleware.boss, categoryController.recovery)
