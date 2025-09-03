const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const User = require("./models/user");
const validationSignup = require("./utils/validation");
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");


dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


app.post("/signup", async (req, res) => {

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

app.post("/login", async (req, res) => {
    const { emailId, password } = req.body;

    try {
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error('invlaid user');
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
            const token = await jwt.sign({ _id: user._id }, "Pkrmrj@91");
            console.log(token)
            res.cookie("token", token)
            res.send("User login successfully")
        } else {
            throw new Error("Invalid Credientails");
        }



    } catch (error) {

    }
})

app.get('/user', async (req, res) => {
    const { emailId } = req.body;
    try {
        const users = await User.findOne({ emailId: emailId })
        res.send(users)
    } catch (error) {
        console.log(error.message)
    }
})

//get user profile
app.get("/profile", async (req, res) => {
    const cookies = req.cookies;

    const { token } = cookies;

    const decodedMessage = await jwt.verify(token, "Pkrmrj@91");
    console.log(decodedMessage);

    const user = await User.findById({ _id: decodedMessage._id })

    res.send(user)
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
