const { default: mongoose, Schema } = require('mongoose');
const schema = new Schema({
    title: {
        type: String,
        unique: true,
    },
    image: String,
    background: {
        type: String,
        default: '#000'
    }
});
module.exports = mongoose.model('Category', schema);