require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateToken = (userId, username, sessionCode) =>
  jwt.sign({ userId, username }, process.env.ADMINSECRET, { expiresIn: "30d" });

const verifyToken = (token) => jwt.verify(token, process.env.ADMINSECRET);

module.exports = { generateToken, verifyToken };
