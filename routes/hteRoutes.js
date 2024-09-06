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
router.patch(
  "/application/:applicationId/reject",
  authMiddleware.verifyToken,
  hteController.rejectApplicant
);
router.get("/profile", hteController.getProfile);
// User id will remove when we apply the authorization middleware
router.get(
  "/list",
  authMiddleware.verifyToken,
  hteController.getListOfInternship
);
router.get(
  "/list/:id",
  authMiddleware.verifyToken,
  hteController.getListingItem
);
router.patch(
  "/list/:id",
  authMiddleware.verifyToken,
  hteController.updateListingItem
);
router.get(
  "/applicants/accepted",
  authMiddleware.verifyToken,
  hteController.getlistOfAcceptedInterns
);
router.get(
  "/list/applicants/:jobId",
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
router.get(
  "/internship/online",
  authMiddleware.verifyToken,
  hteController.getOnlineInterns
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

// Request

router.get(
  "/requests",
  authMiddleware.verifyToken,
  hteController.fetchVisitRequest
);
router.patch(
  "/requests/:id",
  authMiddleware.verifyToken,
  hteController.acceptVisitRequest
);
router.patch(
  "/requests/reject/:id",
  authMiddleware.verifyToken,
  hteController.rejectVisitRequest
);

// Evaluation

router.post(
  "/evaluation/:id",
  authMiddleware.verifyToken,
  hteController.postEvaluation
);
router.get(
  "/getHteEvaluation",
  authMiddleware.verifyToken,
  hteController.getHteEvaluation
)

router.patch(
  "/update/information",
  authMiddleware.verifyToken,
  hteController.updateHteInformation
);
router.patch(
  "/password/change",
  authMiddleware.verifyToken,
  hteController.changePassword
);

module.exports = router;
