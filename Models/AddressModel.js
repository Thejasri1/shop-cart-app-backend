/** @format */

const mongoose = require("mongoose");
const userAddressSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  contact: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  landmark: {
    type: String,
    trim: true,
  },
  pincode: {
    type: String,
    trim: true,
  },
});
const addressConnection = new mongoose.model("addressList", userAddressSchema);
module.exports = addressConnection;
