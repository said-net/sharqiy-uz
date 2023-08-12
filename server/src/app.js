// require('dotenv').config();
const { APP_PORT, MONGO_URI } = require('./configs/env');
const express = require('express');
const file = require('express-fileupload');
const cors = require('cors');
const router = require('./router');
const app = express();
require('mongoose').connect(MONGO_URI);
require('./controllers/boss.controller').default();
require('./controllers/setting.controller').default();
require('./configs/folder.config')()
app.use(cors());
app.use(express.json());
app.use(file());
app.use('/public', express.static('public'));
app.use('/api', router);
app.listen(APP_PORT, () => {
    try {
        require('./bot/app').launch()
    } catch (error) {
        console.log(error);
    }
});