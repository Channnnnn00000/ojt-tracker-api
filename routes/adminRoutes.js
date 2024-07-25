const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");
const authMiddleware = require("../middleware/authMiddleware");

// Getting Route
router.get("/admin", authMiddleware.verifyToken, adminController.getAdminUsers);
router.get("/hte", adminController.getHteUsers);
router.get("/coor", adminController.getCoorUsers);
router.get("/intern", adminController.getInternUsers);

// Registration
router.post("/hte", adminController.hteRegistration);
router.post("/admin", adminController.adminRegistration);
router.post("/coor", adminController.coorRegistration);
router.post("/intern", adminController.internRegistration);

// Updating
router.patch("/hte/:id", adminController.updateHTE);
router.patch("/admin/:id", adminController.updateAdmin);
router.patch("/coor/:id", adminController.updateCoor);
router.patch("/intern/:id", adminController.updateIntern);

// Removing
router.delete("/admin/:id", adminController.removeAdmin);
router.delete("/hte/:id", adminController.removeHTE);
router.delete("/coor/:id", adminController.removeCoor);
router.delete("/intern/:id", adminController.removeIntern);

// Authentication
router.post("/admin/login", adminController.login);

module.exports = router;
