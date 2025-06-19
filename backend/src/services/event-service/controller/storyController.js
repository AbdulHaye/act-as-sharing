const EventStory = require("../models/eventStoryModel");
const Event = require("../models/Event");

const addStory = async (req, res) => {
  const { eventId } = req.params;
  const { title, description, nominator, recipient } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // if (event.hostId.toString() !== req.user.id) {
    //   return res.status(403).json({ message: "Only the host can add stories" });
    // }

    const story = new EventStory({
      eventId,
      title,
      description,
      nominator,
      recipient,
    });

    await story.save();

    res.status(201).json({ message: "Story added successfully", story });
  } catch (error) {
    console.error("Add story error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getStories = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (
      event.hostId.toString() !== req.user.id &&
      !event.guests.includes(req.user.id)
    ) {
      return res.status(403).json({ message: "Not authorized to view stories" });
    }

    const stories = await EventStory.find({ eventId });
    res.status(200).json(stories);
  } catch (error) {
    console.error("Get stories error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addStory,
  getStories,
};