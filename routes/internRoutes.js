const express = require("express");
const router = express.Router();
const internController = require("../controller/internController");
const authMiddleware = require("../middleware/authMiddleware");

// router.post(
//   "/create",
//   authMiddleware.verifyToken,
//   internController.postInternship
// );
router.get(
  "/profile",
  authMiddleware.verifyToken,
  internController.getProfileInformation
);

// Getting list of your application submitted
router.get(
  "/applications",
  authMiddleware.verifyToken,
  internController.getApplicationList
);
router.get("/vacancy", authMiddleware.verifyToken, internController.getVacancy);
router.get(
  "/vacancy/:id",
  authMiddleware.verifyToken,
  internController.getSingleVacancy
);
router.post(
  "/apply/:id",
  authMiddleware.verifyToken,
  internController.applyInternShip
);
// router.patch("/:id", internController.updateInternship);
// router.delete("/:id", internController.deleteInternship);

// Authentication
router.post("/login", internController.login);

module.exports = router;
