const express = require("express");
const router = express.Router();
const announcementController = require("../controller/announcementContoller");
const authMiddleware = require("../middleware/authMiddleware");

// User id will remove when we apply the authorization middleware
router.post(
  "/add",
  authMiddleware.verifyToken,
  announcementController.addAnnouncement
);
router.patch(
  "/announcement/update/:id",
  authMiddleware.verifyToken,
  announcementController.updateAnnouncement
);
router.get(
  "/view",
  authMiddleware.verifyToken,
  announcementController.getAnnouncement
);


module.exports = router;