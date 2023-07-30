const { model, Schema, Types } = require('mongoose');
const schema = new Schema({
    from: {
        type: Types.ObjectId,
        ref: 'User'
    },
    lastUpdate: Number
});

module.exports = model('Chat', schema)