const { Types, Schema, model } = require('mongoose');
const schema = new Schema({
    title: String,
    about: String,
    images: Array,
    video: String,
    price: Number,
    value: Number,
    category: {
        type: Types.ObjectId,
        ref: 'Category'
    },
    original_price: Number,
    old_price: Number,
    bonus: {
        type: Boolean,
        default: false,
    },
    bonus_about: String,
    bonus_count: Number,
    bonus_given: Number,
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