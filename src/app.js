const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const User = require("./models/user");


dotenv.config();
const app = express();
app.use(express.json());


app.post("/signup", async (req, res) => {
    try {
        const user = new User(req.body);
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

app.get('/user', async (req, res) => {
    const { emailId } = req.body;
    try {
        const users = await User.findOne({ emailId: emailId })
        res.send(users)
    } catch (error) {
        console.log(error.message)
    }
})
app.get('/get-all-users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        console.log(error.message)
    }
})
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
        const user = await User.findByIdAndUpdate({ _id: userId }, data, { returnDocument: "after" });
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
