const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/user", authMiddleware.verifyToken, userController.userProfile);

module.exports = router;
