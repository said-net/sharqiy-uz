module.exports = require('express').Router()
    .use('/boss', require('./routers/boss.router'))
    .use('/category', require('./routers/category.router'))
    .use('/product', require('./routers/product.router'))
    .use('/operator', require('./routers/operator.router'))
    .use('/shop', require('./routers/shop.router'))
    