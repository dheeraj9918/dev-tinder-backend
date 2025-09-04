const express = require('express');
const userAuth = require('../middlewares/auth');
const User = require('../models/user');

const router = express.Router();


router.get("/profile", userAuth, async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    res.send(user)
})

module.exports = router;