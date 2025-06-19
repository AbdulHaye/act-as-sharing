const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../../../middleware/authMiddleware");
const {
  createTemplate,
  getTemplatesByHost,
} = require("../controller/templateController");

router.post("/", auth, authorize(["host"]), createTemplate);
router.get("/", auth, authorize(["host"]), getTemplatesByHost);

module.exports = router;
