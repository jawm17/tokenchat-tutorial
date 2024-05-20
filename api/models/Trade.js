const mongoose = require('mongoose');

const TradeSchema = new mongoose.Schema({
    tokenAddress: {
        type: String,
        required: true
    },
    buyerAddress: {
        type: String,
    },
    numTokens: {
        type: String,
    },
    totalValue: {
        type: Number,
    },
    lastPrice: {
        type: Number,
    },
    isBuy: {
        type: Boolean
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Trade', TradeSchema);

