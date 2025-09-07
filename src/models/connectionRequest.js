const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ['accepted', 'rejected', "interested", "ignored"],
            message: '{VALUE} is not a valid status'
        },
    }
}, { timestamps: true });
// Ensure a user cannot send multiple requests to the same user
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });
// Prevent sending request to oneself
// connectionRequestSchema.pre('save', function (next) {
//     if (this.fromUserId.toString() === this.toUserId.toString()) {
//         return next(new Error('You cannot send a connection request to yourself'));
//     }
// })
const ConnectionRequestModel = mongoose.model('ConnectionRequestModel', connectionRequestSchema);
module.exports = ConnectionRequestModel;