const { Types, Schema, model } = require('mongoose');
const schema = new Schema({
    product: {
        type: Types.ObjectId,
        ref: 'Product'
    },
    id: Number,
    name: String,
    month: Number,
    year: Number,
    day: Number,
    price: {
        type: Number,
        default: 0
    },
    count: {
        type: Number,
        default: 0
    },
    region: Number,
    phone: String,
    flow: {
        type: Number,
        default: 0
    },
    for_operator: {
        type: Number,
        default: 0
    },
    for_admin: {
        type: Number,
        default: 0
    },
    for_ref: {
        type: Number,
        default: 0
    },
    bonus: {
        type: Number,
        default: 0
    },
    created: Number,
    operator: {
        type: Types.ObjectId,
        ref: 'Operator'
    },
    comment: String,
    status: {
        type: String,
        default: 'pending'
    }// reject, pending, sended, recived,
})
module.exports = model('ShopHistory', schema)