const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minLength: 4, maxLength: 50 },
  lastName: { type: String, required: true },
  emailId: { type: String, required: true, unique: true, trim: true, lowercase: true },
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

const User = mongoose.model("User", userSchema);
module.exports = User;
