const { model, Schema, Types } = require('mongoose');
const schema = new Schema({
    chat: {
        type: Types.ObjectId,
        ref: 'Chat'
    },
    message: String,
    created: Number,
    from: String,
    viewed: {
        type: Boolean,
        default: false
    }
});

module.exports = model('Message', schema)