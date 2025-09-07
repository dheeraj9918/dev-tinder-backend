const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");


router.get("/user/requests", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        if (!loggedInUser) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const requests = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate('fromUserId', 'firstName lastName photoUrl ');

        if (requests.length === 0) {
            return res.status(200).json({ message: "No connection requests found", data: [] });
        }
        res.status(200).json({ message: "Connection requests fetched successfully", data: requests });

    } catch (error) {
        res.status(400).send({ error: error.message });
    }
})

router.get("/user/connections", userAuth, async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const requests = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: user._id },
                { toUserId: user._id }
            ],
            status: "accepted"
        }).populate('fromUserId toUserId', 'firstName lastName photoUrl');
        if (requests.length === 0) {
            return res.status(200).json({ message: "No accepted connections found", data: [] });
        }
        res.status(200).json({ message: "Accepted connections fetched successfully", data: requests });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});


module.exports = router;


