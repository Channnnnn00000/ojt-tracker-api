// Import Express
const express = require("express");

// Assign Router from express
const router = express.Router();

const messageController = require("../controller/messageController");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/newMessage",
  authMiddleware.verifyToken,
  messageController.newMessage
);
router.get(
  "/getMessage/:conversationId",
  authMiddleware.verifyToken,
  messageController.getMessage
);

module.exports = router;
