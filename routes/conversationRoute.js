// Import Express
const express = require("express");

// Assign Router from express
const router = express.Router();

const conversationController = require("../controller/conversationController");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/newConversation",
  authMiddleware.verifyToken,
  conversationController.newConversation
);
router.get(
  "/getConversation",
  authMiddleware.verifyToken,
  conversationController.getConversation
);
router.get(
  "/getFriendConversation/:id",
  authMiddleware.verifyToken,
  conversationController.getFriendConversation
);

module.exports = router;
