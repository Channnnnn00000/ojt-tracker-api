const express = require("express");
const path = require("path");
const router = express.Router();
const coorController = require("../controller/coorController");
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

router.patch(
  "/updateMOA/:id",
  authMiddleware.verifyToken,
  upload.single("file"),
  coorController.updateMoa
);

// User id will remove when we apply the authorization middleware
router.get(
  "/interns",
  authMiddleware.verifyToken,
  coorController.getInternUsers
);
router.get("/hte", authMiddleware.verifyToken, coorController.getHteList);
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
router.delete(
  "/requests/:id",
  authMiddleware.verifyToken,
  coorController.removeRequest
);
router.patch(
  "/requests/:id",
  authMiddleware.verifyToken,
  coorController.doneRequest
);
router.get(
  "/getCoorEvaluation",
  authMiddleware.verifyToken,
  coorController.getCoorEvaluation
)

module.exports = router;
