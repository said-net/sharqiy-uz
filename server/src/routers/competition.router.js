const competitionController = require('../controllers/competition.controller');
const authMiddleware = require('../middlewares/auth.middleware');

module.exports = require('express').Router()
    .post('/create', authMiddleware.boss, competitionController.createCompetition)
    .get('/get-all', authMiddleware.boss, competitionController.getAll)