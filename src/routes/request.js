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

const mongoose = require("mongoose");

router.post('/connection/respond/:status/:requestedId', userAuth, async (req, res) => {
    try {
        const { status, requestedId } = req.params;
        const loggedInUser = req.user;

        if (!loggedInUser) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        // ✅ Validate ID before querying
        if (!mongoose.Types.ObjectId.isValid(requestedId)) {
            return res.status(400).json({ message: 'Invalid request ID' });

        }
        console.log("Loggin user ID:", loggedInUser._id);

        const connectionRequest = await ConnectionRequestModel.findOne({
            _id: requestedId,
            toUserId: loggedInUser._id,
            status:  "interested"
        }).maxTimeMS(5000).exec();


        if (!connectionRequest) {
            return res.status(404).json({ message: 'Connection request not found or already responded to' });
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();

        return res.status(200).json({
            message: `Connection request ${status}`,
            data
        });
    } catch (error) {
        console.error("Error responding to connection request:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});



module.exports = router;