const { Types, Schema, model } = require('mongoose');
const schema = new Schema({
    product: {
        type: Types.ObjectId,
        ref: 'Product'
    },
    name: String,
    count: Number,
    region: Number,
    phone: String,
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