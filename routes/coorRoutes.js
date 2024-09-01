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
router.get(
  "/hte/:id",
  authMiddleware.verifyToken,
  coorController.getHteItemList
);
router.post(
  "/request",
  authMiddleware.verifyToken,
  coorController.sendVisitationRequest
);
router.get(
  "/requests",
  authMiddleware.verifyToken,
  coorController.getVisitationRequest
);
router.patch(
  "/set/:id",
  authMiddleware.verifyToken,
  coorController.setRequiredHours
);


module.exports = router;
