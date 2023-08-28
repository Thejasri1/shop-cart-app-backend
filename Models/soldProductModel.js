/** @format */

const mongoose = require("mongoose");
const soldProdSchema = new mongoose.Schema({
  productname: {
    type: String,
    trim: true,
    require: true,
  },

  productprice: {
    type: Number,
    trim: true,
    require: true,
  },
  productrating: {
    type: Number,
    trim: true,
    require: true,
  },
  productdiscount: {
    type: Number,
    trim: true,
  },
  producttype: {
    type: String,
    trim: true,
  },
  productcolor: {
    type: String,
    trim: true,
  },
  productsoldcount: {
    type: Number,
    trim: true,
  },
  productimage: {
    type: String,
    trim: true,
    require: true,
  },
});
const productConnection = new mongoose.model(
  "soldProductsList",
  soldProdSchema
);
module.exports = productConnection;
