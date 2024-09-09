require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateToken = (userId, username, sessionCode) =>
  jwt.sign({ userId, username }, process.env.ADMINSECRET, { expiresIn: "5h" });

const verifyToken = (token) => jwt.verify(token, process.env.ADMINSECRET);

module.exports = { generateToken, verifyToken };
