const express = require("express");
const router = express.Router();
const coorController = require("../controller/coorController");
const authMiddleware = require("../middleware/authMiddleware");


// User id will remove when we apply the authorization middleware
router.get(
  "/interns",
  authMiddleware.verifyToken,
  coorController.getInternUsers
);
router.get(
  "/hte",
  authMiddleware.verifyToken,
  coorController.getHteList
);
router.post(
  "/interns",
  authMiddleware.verifyToken,
  coorController.sendVisitationRequest
);
router.get(
  "/requests",
  authMiddleware.verifyToken,
  coorController.getVisitationRequest
);


module.exports = router;
