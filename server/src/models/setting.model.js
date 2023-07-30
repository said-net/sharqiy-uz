const { Schema, model } = require('mongoose');
const schema = new Schema({
    for_operators: Number,
});
module.exports = model('Settings', schema)