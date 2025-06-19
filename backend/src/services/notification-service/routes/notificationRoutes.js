const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../../../middleware/authMiddleware");
const { createNotification } = require("../controller/notificationController");

router.post("/", auth, authorize(["host", "admin"]), createNotification);

module.exports = router;
