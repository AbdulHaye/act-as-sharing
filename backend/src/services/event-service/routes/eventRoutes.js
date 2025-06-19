const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../../../middleware/authMiddleware");
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  inviteGuest,
  getAllEventsPublic,
  getUserEvents,
  getEventByUniqueUrl,
  inviteByEmail,
  updateEventStatus,
} = require("../controller/eventController");
const { addStory, getStories } = require("../controller/storyController");
const { submitVote, getResults } = require("../controller/voteController");

router.get("/public", getAllEventsPublic);
router.get("/url/:url", getEventByUniqueUrl);
router.get("/my-events", auth, getUserEvents);
router.post(
  "/invite-by-email",
  auth,
  authorize(["host", "admin"]),
  inviteByEmail
);

router.post("/", auth, authorize(["host", "admin"]), createEvent);
router.get("/", auth, getEvents);
router.get("/:id", getEventById);
router.put("/:id", auth, authorize(["host", "admin"]), updateEvent);
router.delete("/:id", auth, authorize(["host", "admin"]), deleteEvent);
router.post("/invite", auth, authorize(["host", "admin"]), inviteGuest);

router.post("/:eventId/stories", addStory);
router.get("/:eventId/stories", auth, getStories);
router.post("/:eventId/votes", submitVote); // Removed auth middleware
router.get("/:eventId/results", auth, getResults);

router.patch("/:id/status", auth, updateEventStatus);

module.exports = router;
