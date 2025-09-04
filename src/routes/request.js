const express = require('express');
const userAuth = require('../middlewares/auth');
const router = express.Router();

router.post('/connection-request', userAuth, async (req, res) => {
    const senderId = req.user._id;
    const user = await User.findById(senderId);
    res.send(user.firstName + " " + user.lastName + " sent you a connection request");
});

module.exports = router;