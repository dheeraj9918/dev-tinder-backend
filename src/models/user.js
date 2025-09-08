const mongoose = require("mongoose");
const validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minLength: 3, maxLength: 50 },
  lastName: { type: String, required: true },
  emailId: {
    type: String, required: true, unique: true, trim: true, lowercase: true, validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is not valid please enter the valid email address")
      }
    }
  },
  password: { type: String, required: true },
  age: { type: Number, min: 18 },
  gender: {
    type: String, validate(value) {
      if (!["male", "female", "others"].includes(value)) {
        throw new Error("Gender data is not valid");
      }
    }
  },
  photoUrl: { type: String },
  about: { type: String, default: "this is the about value of the user description" },
  skills: { type: [String] }

}, { timestamps: true });

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Pkrmrj@91", { expiresIn: '2h' });
  return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const hashPassword = user.password;
  const isPasswordMatch = await bcrypt.compare(passwordInputByUser, hashPassword);
  return isPasswordMatch;
}

const User = mongoose.model("User", userSchema);
module.exports = User;
