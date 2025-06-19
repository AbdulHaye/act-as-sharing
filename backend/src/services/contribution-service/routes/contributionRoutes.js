const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../../../middleware/authMiddleware");
const {
  getContributionById,
  getAllContributions,
  getTotalFundsRaised,
  processDonation,
  updateContribution,
  deleteContribution,
} = require("../controller/contributionController");

// Specific routes first
router.get(
  "/total-funds",
  auth,
  authorize(["admin", "host"]),
  getTotalFundsRaised
);
router.get("/", auth, authorize(["admin", "host"]), getAllContributions);
router.post("/donate", processDonation);

// Generic routes last
router.get("/:id", auth, getContributionById);
router.put("/:id", auth, authorize(["admin"]), updateContribution);
router.delete("/:id", auth, authorize(["admin"]), deleteContribution);

module.exports = router;
