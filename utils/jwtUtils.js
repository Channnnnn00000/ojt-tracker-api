const jwt = require("jsonwebtoken");
const secretKey = process.env.ADMINSECRET;
require("dotenv").config();
const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.ADMINSECRET, { expiresIn: "1h" });

const verifyToken = (token) => jwt.verify(token, process.env.ADMINSECRET);

module.exports = { generateToken, verifyToken };
