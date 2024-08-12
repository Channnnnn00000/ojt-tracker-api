const express = require("express");
const router = express.Router();
const internController = require("../controller/internController");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
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
router.get("/vacancy",  internController.getVacancy);
router.get(
  "/vacancy/:id",
  authMiddleware.verifyToken,
  internController.getSingleVacancy
);
router.post(
  "/apply/:id",
  authMiddleware.verifyToken,
  upload.array("files", 10),
  internController.applyInternShip
);
router.post(
  "/reset",
  authMiddleware.verifyToken,
  internController.setStateToFalse
);
// router.patch("/:id", internController.updateInternship);
// router.delete("/:id", internController.deleteInternship);

// Authentication
router.post("/login", internController.login);

module.exports = router;
