const express = require("express");
const router = express.Router();
const resetController = require("../controller/resetController");

router.post(
  "/requestResetPassword",
  resetController.resetPasswordRequestController
);
router.post("/resetPassword", resetController.resetPasswordController);
module.exports = router;

module.exports = router;
