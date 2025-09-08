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
// get user feed who is not connected and not requested
router.get("/user/feed", userAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        if (limit > 50) limit = 50; // Max limit to prevent abuse
        
        const skip = (page - 1) * limit;

        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const requests = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: user._id },
                { toUserId: user._id }
            ]
        });

        const hideTheUserFromFeed = new Set();
        requests.forEach(request => {
            hideTheUserFromFeed.add(request.fromUserId.toString());
            hideTheUserFromFeed.add(request.toUserId.toString());
        });

        hideTheUserFromFeed.add(user._id.toString());

        console.log("Users to hide from feed:", hideTheUserFromFeed);

        const feedUsers = await User.find({
            _id: { $nin: Array.from(hideTheUserFromFeed) }
        })
            .select("firstName lastName photoUrl about skills")
            .skip(skip)
            .limit(limit);

        if (feedUsers.length === 0) {
            return res.status(200).json({ message: "No users available in feed", data: [] });
        }

        res.status(200).json({ message: "User feed fetched successfully", data: feedUsers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong", error });
    }
});


module.exports = router;


