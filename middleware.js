/** @format */

const jwt = require("jsonwebtoken");
module.exports = async (req, res, next) => {
  try {
    let token = await req.header("x-token");
    if (!token) {
      return res.status(404).json({ message: "Token not existed" });
    } else {
      const decode = jwt.verify(token, "jwtSecret");
      console.log("decode", decode.user);
      req.user = decode.user;
      next();
    }
  } catch (e) {
    console.log(e);
  }
};
