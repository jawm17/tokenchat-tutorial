const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    privyId: {
      type: String
    },
    username: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    profileImg: {
        type: String,
        default: "https://firebasestorage.googleapis.com/v0/b/ethresources-1ed10.appspot.com/o/Screen%20Shot%202023-05-26%20at%201.43.56%20AM.png?alt=media&token=3bf94c27-d9e4-420e-860e-c35cdd8cac9d"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tokenArray: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Token' }],
});

module.exports = mongoose.model('User', UserSchema);