const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const User = require("./models/user");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const requestRoutes = require("./routes/request");
const userRoutes = require("./routes/user");
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use("/", authRoutes);
app.use("/", profileRoutes);
app.use("/", requestRoutes);
app.use("/", userRoutes);


app.get('/user', async (req, res) => {
    const { emailId } = req.body;
    try {
        const users = await User.findOne({ emailId: emailId })
        res.send(users)
    } catch (error) {
        console.log(error.message)
    }
})

//get all user
app.get('/get-all-users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        console.log(error.message)
    }
})

//delete user
app.delete('/user', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        console.log(error.message)
    }
})

app.patch('/user', async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;

    try {
        const ALLOWED_UPDATES = ["userId", "photoUrl", "about", "gender", "age"];

        const isUpadateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
        if (!isUpadateAllowed) {
            res.status(400).send("update is not allowed ")
        }
        const user = await User.findByIdAndUpdate({ _id: userId }, data, { returnDocument: "after", runValidators: true });
        console.log(user);
        res.send("User updated successfully")
    } catch (error) {
        res.status(400).send("Somethings wents wrongs")
    }
})


connectDB().then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`🚀 Server running on port: ${process.env.PORT || 5000}`);
    });
});
