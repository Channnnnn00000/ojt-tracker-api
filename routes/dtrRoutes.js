const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const dtrController = require("../controller/dtrController");

// Time in end point
router.post("/dtr", authMiddleware.verifyToken, dtrController.timeIn);

module.exports = router;
