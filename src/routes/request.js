const express = require('express');
const userAuth = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const User = require('../models/user');
const router = express.Router();

router.post('/connection/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const fromUserId = req.user._id;
        const { status, toUserId } = req.params;

        // Prevent sending request to oneself
        if (fromUserId.toString() === toUserId) {
            return res.status(400).json({ message: 'You cannot send a connection request to yourself' });
        }
        // Check if toUserId exists
        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: 'Recipient user not found' });
        }

        // Validate status
        const allowedStatus = ["interested", "ignored"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }
        // Check for existing connection request
        const eexistingRequest = await ConnectionRequestModel.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if (eexistingRequest) {
            return res.status(400).json({ message: 'Connection request already sent' });
        }

        const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status
        });
        const data = await connectionRequest.save();
        res.status(201).json({
            message: `${user.firstName} is  ${status} to the connection`,
            data
        });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

module.exports = router;