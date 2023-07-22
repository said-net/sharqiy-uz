const {Types, Schema, model} = require('mongoose');
const schema = new Schema({
    title: String,
    about: String,
    images: Array,
    video: String,
    price: Number,
    category: {
        type: Types.ObjectId,
        ref: 'Catgeory'
    },
    original_price: Number,
    bonus: {
        type: Boolean,
        default: false,
    },
    about_bonus: String,
    bonus_duration: Number,
    created: Number,
    solded: {
        type: Number,
        default: 0,
    },
    hidden: {
        type: Boolean,
        default: false,
    },
});
module.exports = model('Product', schema);