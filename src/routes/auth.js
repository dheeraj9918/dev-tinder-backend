const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const validationSignup = require("../utils/validation");

router.post("/signup", async (req, res) => {

    try {
        validationSignup(req)
        const { firstName, lastName, emailId, password } = req.body;

        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashPassword
        });
        await user.save();
        res.status(201).json({
            message: "User created successfully",
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
});

router.post("/login", async (req, res) => {
    const { emailId, password } = req.body;

    try {
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error('invlaid user');
        }
        const isPasswordMatch = await user.validatePassword(password);
        if (isPasswordMatch) {
            const token = await user.getJWT();
            console.log(token)
            res.cookie("token", token, { expires: new Date(Date.now() + 900000), httpOnly: true });
            res.send("User login successfully")
        } else {
            throw new Error("Invalid Credientails");
        }



    } catch (error) {

    }
})

module.exports = router;