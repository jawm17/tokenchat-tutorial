const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    tokenAddress: {
        type: String,
        required: true   
    },
    tokenImage: {
        type: String,
    },
    tokenName: {
        type: String,
    },
    tokenSymbol: {
        type: String,
    },
    totalSupply: {
        type: String,
    },
    tokenType: {
        type: String
    },
    creatorAddress: {
        type: String
    },
    chain: {
        type: String,
        default: "base"
    },
    lastPrice: {
        type: String,
        default: "0.0000001"
    },
    holderCount: {
        type: Number,
        default: 0
    },
    fdv: {
        type: String,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
});

TokenSchema.statics.updateTokenPriceAndHolderCount = async function(tokenAddress, lastPrice, holderCount, fdv) {
    try {
        const token = await this.findOne({ tokenAddress });
        if (!token) {
            throw new Error("Token not found");
        }
        token.lastPrice = lastPrice;
        token.holderCount = holderCount;
        token.fdv = fdv;
        await token.save();
        return token;
    } catch (error) {
        throw error;
    }
};

module.exports = mongoose.model('Token', TokenSchema);

