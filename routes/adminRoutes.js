const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");
const authMiddleware = require("../middleware/authMiddleware");

// Getting info of current users
router.get(
  "/active",
  authMiddleware.verifyToken,
  adminController.checkUserLoggedIn
);
// Getting Route
router.get("/admin", authMiddleware.verifyToken, adminController.getAdminUsers);
router.get("/hte", adminController.getHteUsers);
router.get("/coor", authMiddleware.verifyToken, adminController.getCoorUsers);
router.get(
  "/intern",
  authMiddleware.verifyToken,
  adminController.getInternUsers
);
// Fetching the users
router.get("/users", authMiddleware.verifyToken, adminController.getAllUsers);

// Registration
router.post("/user", adminController.userRegistration);
router.post("/hte", adminController.hteRegistration);
// router.post("/admin", adminController.adminRegistration);
router.post("/coor", adminController.coorRegistration);
router.post("/intern", adminController.internRegistration);

// Updating
router.patch("/hte/:id", adminController.updateHTE);
router.patch("/admin/:id", adminController.updateAdmin);
router.patch("/coor/:id", adminController.updateCoor);
router.patch("/intern/:id", adminController.updateIntern);

// Removing
router.delete("/accounts/:id", adminController.removeAccount);
router.get("/accounts/:id", adminController.getAccountInfo);
router.patch("/accounts/:id", adminController.updateAccountInfo);

// Authentication
router.post("/admin/login", adminController.login);
router.post("/admin/logout", adminController.logout);

// Fetching department list to frontend CRUD
router.get(
  "/admin/departmentlist",
  authMiddleware.verifyToken,
  adminController.fetchDepartmentList
);
router.post(
  "/admin/departmentlist",
  authMiddleware.verifyToken,
  adminController.addDepartment
);
router.put(
  "/admin/departmentlist/:id",
  authMiddleware.verifyToken,
  adminController.updateDepartment
);
router.delete(
  "/admin/departmentlist/:id",
  authMiddleware.verifyToken,
  adminController.deleteDepartment
);

// Fetching Inters list to frontend
router.get(
  "/admin/internlist",
  authMiddleware.verifyToken,
  adminController.getInternsList
);
router.get(
  "/admin/dtrlogs/:id",
  authMiddleware.verifyToken,
  adminController.getDTRLogs
);
router.patch(
  "/admin/resetdevice/:id",
  authMiddleware.verifyToken,
  adminController.reseDeviceRestriction
);

module.exports = router;
