const express = require("express");
const router = express.Router();
const hteController = require("../controller/hteController");

router.post("/create", hteController.postInternship);
router.get("/", hteController.getListOfInternship);
router.patch("/:id", hteController.updateInternship);
router.delete("/:id", hteController.deleteInternship);

module.exports = router;
