const { Types, Schema, model } = require('mongoose');
const schema = new Schema({
    product: {
        type: Types.ObjectId,
        ref: 'Product'
    },
    id: Number,
    from: String,
    name: String,
    about: String,
    month: Number,
    year: Number,
    day: Number,
    competition: {
        type: Types.ObjectId,
        ref: 'Competition'
    },
    price: {
        type: Number,
        default: 0
    },
    count: {
        type: Number,
        default: 0
    },
    region: Number,
    city: Number,
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
    ref_id: {
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
    }//archive, reject, wait, pending,success, sended, delivered,
})
module.exports = model('ShopHistory', schema)