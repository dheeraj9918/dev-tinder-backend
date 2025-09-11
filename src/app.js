const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const requestRoutes = require("./routes/request");
const userRoutes = require("./routes/user");

dotenv.config();
const app = express();

// CORS configuration - this should be the FIRST middleware
app.use(
    cors({
        origin: "http://localhost:5173", // Allow both common React ports
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
        exposedHeaders: ["Set-Cookie"],
    })
);



app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/", profileRoutes);
app.use("/", requestRoutes);
app.use("/", userRoutes);



connectDB().then(() => {
    const PORT = process.env.PORT || 7777; // Make sure this matches your frontend calls
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port: ${PORT}`);
    });
});