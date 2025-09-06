const express = require('express');
const userAuth = require('../middlewares/auth');
const User = require('../models/user');
const { validateEditsFields } = require('../utils/validation');

const router = express.Router();


router.get("/profile/view", userAuth, async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    res.send(user)
});

router.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        validateEditsFields(req);
        if (!validateEditsFields(req)) {
            res.status(400).send({ error: "Invalid updates!" });
        }
        const userId = req.user._id;
        const user = await User.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true });
        res.send(user);
    } catch (error) {
        throw new Error(error)
    }

})

module.exports = router;