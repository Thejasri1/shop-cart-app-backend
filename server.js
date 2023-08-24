/** @format */
const mongoose = require("mongoose");
const userModel = require("./Models/UserModel");
const productsModel = require("./Models/ProductsModel");
const middleware = require("./middleware");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();

//midlewares
app.use(express.json());

//Mongoose connection
const URL = process.env.DB_URL;
mongoose.connect(URL).then((db, err) => {
  try {
    if (err) throw err;
    console.log("Connected with DB");
  } catch (e) {
    console.log(e);
  }
});

let regex = /[a-z0-9]+@[a-z]+\.[a-z]/;

//register API
app.post("/register", async (req, res) => {
  try {
    const { username, email, password, confirmpassword } = req.body;
    let emailValid = regex.test(email);
    let emailExists = await userModel.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email is already existed" });
    } else if (username === "") {
      return res.status(400).json({ message: "User name is required" });
    } else if (email === "") {
      return res.status(400).json({ message: "Email is required" });
    } else if (!emailValid) {
      return res.status(400).json({ message: "Email is not valid" });
    } else if (password === "") {
      return res.status(400).json({ message: "Password is required" });
    } else if (confirmpassword === "") {
      return res.status(400).json({ message: "Confirm password is required" });
    } else if (password !== confirmpassword) {
      return res.status(400).json({ message: "Password not matched" });
    } else {
      await userModel.create(req.body);
      return res.status(200).json({ message: "Registered Successfully" });
    }
  } catch (e) {
    return res.status(400).json({ message: "Register Failed" });
  }
});

//Login API
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let emailExists = await userModel.findOne({ email });
    if (email === "") {
      return res.status(400).json({ message: "Email is required" });
    } else if (password === "") {
      return res.status(400).json({ message: "Password is required" });
    } else if (!emailExists) {
      return res.status(404).json({ message: "Email not existed" });
    } else if (emailExists.password !== password) {
      return res.status(404).json({ message: "Incorrect password" });
    }
    const payload = {
      user: {
        id: emailExists.id,
      },
    };
    jwt.sign(payload, "jwtSecret", { expiresIn: 3600000 }, (err, token) => {
      try {
        if (err) throw err;
        return res.json({ token });
      } catch (e) {
        console.log(e);
      }
    });
  } catch (e) {
    return res.status(400).json({ message: "Login Failed" });
  }
});
//Get API for displaying all the products
app.get("/products", async (req, res) => {
  try {
    let exists = userModel.findById(req.user.id);
    if (!exists) {
      return res.status(404).json({ message: "User not existed" });
    } else {
      const productsList = await productsModel.find({});
      return res.status(200).send(productsList);
    }
  } catch (e) {
    console.log(e);
  }
});
// Post product
app.post("/product", async (req, res) => {
  try {
    await productsModel.create(req.body);
    return res.status(200).json({ message: "Produt added" });
  } catch (e) {
    return res.status(400).json({ message: "Produts are not added" });
  }
});
//Update Product
app.patch("/product/:id", async (req, res) => {
  try {
    await productsModel.findByIdAndUpdate(req.param.id, req.body);
    return res.status(200).json({ message: "Produt details updated" });
  } catch (e) {
    return res.status(400).json({ message: "Produt details are not updated" });
  }
});
//Delete Product
app.delete("/:id", async (req, res) => {
  try {
    await productsModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Produt is deleted" });
  } catch (e) {
    return res.status(200).json({ message: "Produt is not deleted" });
  }
});
//Add Cart Post API
//Delete from Cart API

//Order Get API
//Order POST API
// update order data API
//Delete order data API

//connecting to the server
const port = process.env.PORT;
app.listen(port);
