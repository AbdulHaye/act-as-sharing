const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../../../middleware/authMiddleware");
const {
  createMessage,
  getEventMessages,
  updateMessage,
  deleteMessage,
} = require("../controller/messageController");

router.post("/", auth, authorize(["guest", "host"]), createMessage);
router.get("/event/:eventId", auth, getEventMessages);
router.put(
  "/:messageId",
  auth,
  authorize(["guest", "host", "admin"]),
  updateMessage
);
router.delete(
  "/:messageId",
  auth,
  authorize(["guest", "host", "admin"]),
  deleteMessage
);

module.exports = router;
