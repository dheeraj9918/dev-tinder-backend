const express = require('express');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const { validationSignup } = require('../utils/validation');

router.post("/signup", async (req, res) => {
    try {
        validationSignup(req);
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
    try {
        const { emailId, password } = req.body;

        // Basic validation
        if (!emailId || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const isPasswordMatch = await user.validatePassword(password);
        if (isPasswordMatch) {
            const token = await user.getJWT();
            console.log(token);
            
            res.cookie("token", token, { 
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                sameSite: 'lax'
            });
            
            res.json({
                message: "User login successfully",
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    emailId: user.emailId
                }
            });
        } else {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
});

router.post("/logout", async (req, res) => {
    try {
        res.clearCookie("token");
        res.json({
            message: "User logged out successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Logout failed",
            error: error.message
        });
    }
});

module.exports = router;