const express = require("express");
const router = express.Router();
const hteController = require("../controller/hteController");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/create",
  authMiddleware.verifyToken,
  hteController.postInternship
);
router.get("/", authMiddleware.verifyToken, hteController.getListOfInternship);
router.patch("/:id", hteController.updateInternship);
router.delete("/:id", hteController.deleteInternship);

// Authentication
router.post("/hte/login", hteController.login);

module.exports = router;
