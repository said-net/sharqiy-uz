module.exports = require('express').Router()
    .use('/boss', require('./routers/boss.router'))
    .use('/category', require('./routers/category.router'))