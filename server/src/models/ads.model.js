const { Schema, model, Types } = require('mongoose');
const schema = new Schema({
    product: {
        type: Types.ObjectId,
        ref: 'Product'
    },
    link: String,
    about: String,
});
module.exports= model('Ads', schema);