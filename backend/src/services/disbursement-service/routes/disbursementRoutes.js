const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../../../middleware/authMiddleware");
const {
  createDisbursement,
  approveDisbursement,
} = require("../controller/disbursementController");

router.post("/", auth, authorize(["host", "admin"]), createDisbursement);
router.put("/:id/approve", auth, authorize(["admin"]), approveDisbursement);

module.exports = router;
