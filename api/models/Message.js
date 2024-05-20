const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    fromAddress: {
        type: String,
        required: true
    },
    tokenAddress: {
        type: String,
        required: true
    },
    textContent: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Message', MessageSchema);