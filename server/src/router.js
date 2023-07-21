module.exports = require('express').Router()
    .use('/boss', require('./routers/boss.router'))
    .use('/category', require('./routers/category.router'))
    .use('/product', require('./routers/product.router'))