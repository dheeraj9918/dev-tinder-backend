const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const User = require("./models/user");

dotenv.config();
const app = express();
app.use(express.json());


app.post("/signup", async (req, res) => {
    try {
        console.log("👉 Incoming Data:", req.body);

        const user = new User(req.body);
        await user.save();

        res.status(201).json({
            message: "User created successfully",
            data: user,
        });
    } catch (error) {
        console.error("❌ Error: " + error.message);
        res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
});


connectDB().then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`🚀 Server running on port: ${process.env.PORT || 5000}`);
    });
});
