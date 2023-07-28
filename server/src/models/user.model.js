const {Types, Schema, model} = require('mongoose');

const schema = new Schema({
    name: String,
    phone: String,
    location: Number,
    verify_code: String,
    created: Number,
    telegram: Number,
    role: String,
    balance: Number,
    password: String,
    ref_id:String,
    access: String
});

module.exports = model('User', schema);