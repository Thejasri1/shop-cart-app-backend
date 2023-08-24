/** @format */

const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    require: true,
  },
  email: {
    type: String,
    trim: true,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    trim: true,
    require: true,
  },
  confirmpassword: {
    type: String,
    trim: true,
    require: true,
  },
});
const userConnection = new mongoose.model("usersList", userSchema);
module.exports = userConnection;
