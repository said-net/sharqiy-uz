const shopController = require('../controllers/shop.controller');

module.exports = require('express').Router()
    .post('/create', shopController.create)