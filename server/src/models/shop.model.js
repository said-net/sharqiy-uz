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
    count: Number,
    region: Number,
    phone: String,
    flow: Number,
    for_operator: Number,
    for_admin: Number,
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