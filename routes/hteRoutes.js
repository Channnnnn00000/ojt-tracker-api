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
  "/application/:applicationId/accept",
  authMiddleware.verifyToken,
  hteController.approvedApplicant
);
router.get("/profile", hteController.getProfile);
// User id will remove when we apply the authorization middleware
router.get(
  "/list",
  authMiddleware.verifyToken,
  hteController.getListOfInternship
);
router.get(
  "/list/accepted",
  authMiddleware.verifyToken,
  hteController.getlistOfAcceptedInterns
);
router.get(
  "/list/:jobId",
  authMiddleware.verifyToken,
  hteController.getSingleInternship
);
router.get(
  "/applicants/:jobId/intern/:internId",
  authMiddleware.verifyToken,
  hteController.getSingleApplication
);
// router.get(
//   "/applicants/pending",
//   authMiddleware.verifyToken,
//   hteController.getListOfPendingApplicant
// );
router.get(
  "/applicants/list",
  authMiddleware.verifyToken,
  hteController.getListOfApplicant
);
// router.get(
//   "/applicants/approved",
//   authMiddleware.verifyToken,
//   hteController.getApprovedInterns
// );
router.patch("/:id", hteController.updateInternship);
router.delete("/delete/:id", hteController.deleteInternship);

// Authentication
router.post("/login", hteController.login);

module.exports = router;
