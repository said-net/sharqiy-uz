const { Schema, model, Types } = require('mongoose');
const schema = new Schema({
    product: {
        type: Types.ObjectId,
        ref: 'Product'
    },
    image: String,
    about: String,
});
module.exports= model('Ads', schema);