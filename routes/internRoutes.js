const express = require("express");
const path = require("path");
const router = express.Router();
const internController = require("../controller/internController");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});
const upload = multer({ storage: storage });

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
router.get("/vacancy", internController.getVacancy);
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
router.patch(
  "/acceptoffer/:id",
  authMiddleware.verifyToken,
  internController.acceptHteOffer
);
// router.patch("/:id", internController.updateInternship);
// router.delete("/:id", internController.deleteInternship);

// Authentication
router.post("/login", internController.login);

router.get("/totalhours", internController.getTotalHoursRequired);
router.post(
  "/timein",
  authMiddleware.verifyToken,
  internController.timeInHandler
);
router.put(
  "/timeout",
  authMiddleware.verifyToken,
  internController.timeOutHandler
);
router.get(
  "/attendance",
  authMiddleware.verifyToken,
  internController.getAttendance
);
router.delete(
  "/remove/:id",
  authMiddleware.verifyToken,
  internController.removeApplicationData
);

router.put(
  "/currentlocation",
  authMiddleware.verifyToken,
  internController.getCurrentLocationHandler
);
router.get(
  "/getInternEvaluation",
  authMiddleware.verifyToken,
  internController.getInternEvaluation
);
router.get(
  "/application/:id",
  authMiddleware.verifyToken,
  internController.getApplicationInfo
);
router.patch(
  "/update/information",
  authMiddleware.verifyToken,
  internController.updateInternInformation
);
router.patch(
  "/password/change",
  authMiddleware.verifyToken,
  internController.changePassword
);
router.get(
  "/hte/information/:id",
  authMiddleware.verifyToken,
  internController.getHteInformation
);
router.get(
  "/results/evaluation",
  authMiddleware.verifyToken,
  internController.getEvaluationResults
);
router.patch(
  "/check/status",
  authMiddleware.verifyToken,
  internController.checkTimeOutStatus
);
router.patch(
  "/update/evaluationstatus/:id",
  internController.updateInternEval
);

module.exports = router;
