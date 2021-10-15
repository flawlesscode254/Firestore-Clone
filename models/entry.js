const mongoose = require('mongoose');

const { Schema } = mongoose;

const messageSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    }
},
    {
        timestamps: true,
    }
);

const messagesEntry = mongoose.model('messagesSchema', messageSchema);

module.exports = messagesEntry;