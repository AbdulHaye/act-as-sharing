const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../../../middleware/authMiddleware");
const {
  addStory,
  getAllStories,
  getStoryById,
  updateStory,
  deleteStory,
} = require("../controller/storyController");

router.post("/", auth, authorize(["admin"]), addStory);
router.get("/", getAllStories);
router.get("/:id", auth, authorize(["admin"]), getStoryById);
router.put("/:id", auth, authorize(["admin"]), updateStory);
router.delete("/:id", auth, authorize(["admin"]), deleteStory);

module.exports = router;
