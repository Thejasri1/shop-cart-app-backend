/** @format */
const mongoose = require("mongoose");
const userModel = require("./Models/UserModel");
const productsModel = require("./Models/ProductsModel");
const addressModel = require("./Models/AddressModel");
const cartModel = require("./Models/CartModel");
const soldProductsModel = require("./Models/soldProductModel");
const middleware = require("./middleware");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();

//midlewares
app.use(express.json());
app.use(cors());

//Mongoose connection
const env = process.env.NODE_ENV || "development";
const URL = env === "development" ? process.env.DB_URL : process.env.PROD_URL;
mongoose
  .connect(URL)
  .then((db, err) => {
    try {
      if (err) throw err;
      console.log("Connected with DB");
    } catch (e) {
      console.log(e);
    }
  })
  .catch((err) => console.log(err));

let regex = /[a-z0-9]+@[a-z]+\.[a-z]/;
//get Users API
app.get("/users", async (req, res) => {
  try {
    const usersRes = await userModel.find({});
    return res.status(200).send(usersRes);
  } catch (e) {
    console.log(e);
  }
});
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
    console.log(e);
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
    console.log(e);
    return res.status(400).json({ message: "Login Failed" });
  }
});
//Get API for displaying all the products
app.get("/products", middleware, async (req, res) => {
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
    console.log(e);
    return res.status(400).json({ message: "Produts are not added" });
  }
});
//Update Product
app.patch("/product/:id", async (req, res) => {
  try {
    await productsModel.findByIdAndUpdate(req.params.id, req.body);
    return res.status(200).json({ message: "Produt details updated" });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Produt details are not updated" });
  }
});
//Delete Product
app.delete("/:id", async (req, res) => {
  try {
    await productsModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Produt is deleted" });
  } catch (e) {
    console.log(e);
    return res.status(200).json({ message: "Produt is not deleted" });
  }
});
app.get("/cart", async (req, res) => {
  try {
    const cartProducts = await cartModel.find({});
    return res.status(200).send(cartProducts);
  } catch (e) {
    console.log(e);
  }
});
//Add Cart Post API
app.post("/cart", async (req, res) => {
  try {
    await cartModel.create(req.body);
    return res.status(200).json({ message: "Product added to the cart" });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Product not added to the cart" });
  }
});
//Delete from Cart API
app.delete("/cart/:id", async (req, res) => {
  try {
    await cartModel.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ message: "Product is removed from the cart" });
  } catch (e) {
    console.log(e);
    return res
      .status(200)
      .json({ message: "Product is not removed from the cart" });
  }
});

//search APIs
app.get("/searchbyproduct/:product", async (req, res) => {
  try {
    const price = Number(req.params.product);
    const searchList = await productsModel.aggregate([
      {
        $match: {
          $or: [
            { productprice: { $eq: price } },
            { productname: { $eq: req.params.product } },
            { productrating: { $eq: Number(req.params.product) } },
            { producttype: { $eq: req.params.product } },
            { productdiscount: { $eq: Number(req.params.product) } },
          ],
        },
      },
    ]);
    return res.status(200).send(searchList);
  } catch (e) {
    console.log(e);
  }
});
//get address API
app.get("/address", async (req, res) => {
  try {
    const addressRes = await addressModel.find({});
    return res.status(200).send(addressRes);
  } catch (e) {
    console.log(e);
  }
});
//post Address api
app.post("/address", async (req, res) => {
  try {
    await addressModel.create(req.body);
    return res.status(200).json({ message: "Address added" });
  } catch (e) {
    console.log(e);
  }
});
//Update address API
app.patch("/address/:id", async (req, res) => {
  try {
    await addressModel.findByIdAndUpdate(req.params.id, req.body);
    return res.status(200).json({ message: "address details updated" });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "address details are not updated" });
  }
});
//Delete address API
app.delete("/address/:id", async (req, res) => {
  try {
    await addressModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Adress removed" });
  } catch (e) {
    console.log(e);
    return res.status(200).json({ message: "Adress not removed" });
  }
});
//get sold products API
app.get("/soldproducts", async (req, res) => {
  try {
    const addressRes = await soldProductsModel.find({});
    return res.status(200).send(addressRes);
  } catch (e) {
    console.log(e);
  }
});
//post sold products api
app.post("/soldproduct", async (req, res) => {
  try {
    await soldProductsModel.create(req.body);
    return res.status(200).json({ message: "Address added" });
  } catch (e) {
    console.log(e);
  }
});
//connecting to the server
const port = process.env.PORT;
app.listen(port);
