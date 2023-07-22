const productController = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/auth.middleware');

module.exports = require('express').Router()
    /* 
    * body: {
        title: string,
        about: string,
        images: [min-2, max: 5],
        video: string(yt video link),
        price:number,
        original_price:number,
        catgeory: string,
        value: number
    }*/
    .post('/create', authMiddleware.boss, productController.create)

    /*------------*/

    /* return [
        {
            title: String,
            about: String,
            images: String[],
            video: String,
            price: Number,
            value: Number,
            // 
            solded: Number
            bonus: Boolean
            about_bonus: String
            // 
        }
    ]*/

    .get('/getall', authMiddleware.boss, productController.getAllProducts)

    /*-----------*/

    /* 
        params: id: string
    */
    .delete('/delete/:id', authMiddleware.boss, productController.delete)

    /*------------*/

    /* 
        params: id: string
    */
    .put('/recovery/:id', authMiddleware.boss, productController.recovery)
    /*------------*/
