const {default: mongoose, Schema} = require('mongoose');
const schema = new Schema({
    name: String,
    phone: {
        type: String,
        unique: true,
    },
    password: String,
    access: String,
    banned: {
        type: Boolean,
        default: false
    }
});
module.exports = mongoose.model('Operator', schema);