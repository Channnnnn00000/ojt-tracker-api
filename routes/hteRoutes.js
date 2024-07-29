const express = require("express");
const router = express.Router();
const hteController = require("../controller/hteController");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/create",
  authMiddleware.verifyToken,
  hteController.postInternship
);
router.put(
  "/applicantion/:applicationId/accept",
  authMiddleware.verifyToken,
  hteController.acceptApplicant
);
router.get("/", authMiddleware.verifyToken, hteController.getListOfInternship);
router.get(
  "/applicants",
  authMiddleware.verifyToken,
  hteController.getListOfApplicant
);
router.patch("/:id", hteController.updateInternship);
router.delete("/:id", hteController.deleteInternship);

// Authentication
router.post("/login", hteController.login);

module.exports = router;
