const productController = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/auth.middleware');

module.exports = require('express').Router()
    // -------------------------------------------------------------------
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

    // -------------------------------------------------------------------

    /* return [
        {
            title: String,
            about: String,
            images: String[],
            video: String,
            price: Number,
            value: Number,
            category: {
                id: String,
                title: String,
                background: String,
                image: String
            }
            // 
            solded: Number
            bonus?: Boolean
            bonus_about?: String
            bonus_duration?: String,
            bonus_count?: Number - Bonus berilishi uchun mahsulot qiymati DONA,
            bonus_given?: Number - nechta bonus beriladi
            // 
        }
    ]*/
    .get('/getall-from-admin', authMiddleware.boss, productController.getAllProductsToAdmin)

    // -------------------------------------------------------------------

    /*
    params: {id: String}
    return: {
        {
            title: String,
            about: String,
            images: String[],
            video: String,
            price: Number,
            value: Number,
            original_price: Number
            category: {
                id: String,
                title: String,
                background: String,
                image: String
            }
            // 
            solded: Number
            bonus?: Boolean
            bonus_about?: String
            bonus_duration?: String,
            bonus_count?: Number - Bonus berilishi uchun mahsulot qiymati DONA,
            bonus_given?: Number - nechta bonus beriladi
    }*/
    .get('/get-one/:id', productController.getOne)

    // -------------------------------------------------------------------

    /* 
        params: id: string
    */
    .delete('/delete/:id', authMiddleware.boss, productController.delete)

    // -------------------------------------------------------------------

    /* 
        params: {id: string}
    */
    .put('/recovery/:id', authMiddleware.boss, productController.recovery)

    // -------------------------------------------------------------------

    /*
        params:{id: string}
        body:{
            bonus_about: Stirng,
            bonus_count: Number - Bonus olish uchun nechta mahsulot olish kerakligi!,
            bonus_given: Number - Mahsulotni yetarlicha olganda nechta bonus berilishi,
            bonus_duration: Number - Bonus qancha muddat davom etishi - Secondlarda
        }
    */
    .post('/set-bonus/:id', authMiddleware.boss, productController.setBonus)

    // -------------------------------------------------------------------

    /*
        params: {id: string}
    */
    .post('/remove-bonus/:id', authMiddleware.boss, productController.removeBonus)

    // -------------------------------------------------------------------
    /*
        params: {id: string} - tovar id si
        body:{
            value: Number - bazaga qo'shilishi kerak bo'lgan tovar soni,
        }
    */
    .put('/add-value', authMiddleware.boss, productController.addValue)
