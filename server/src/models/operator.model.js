const { default: mongoose, Schema } = require('mongoose');
const schema = new Schema({
    name: String,
    phone: {
        type: String,
        unique: true,
    },
    password: String,
    access: String,
    telegram: String,
    balance: {
        type: Number,
        default: 0
    },
    banned: {
        type: Boolean,
        default: false
    }
});
module.exports = mongoose.model('Operator', schema);