const Message = require("../models/Message");
const Event = require("../../event-service/models/Event");

const createMessage = async (req, res) => {
  const { eventId, content } = req.body;
  const userId = req.user.id;
  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    const message = new Message({ eventId, userId, content });
    await message.save();
    event.messages.push(message._id);
    await event.save();
    res.status(201).json(message);
  } catch (error) {
    console.error("Create message error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getEventMessages = async (req, res) => {
  const { eventId } = req.params;
  try {
    // Extract pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Default to 10 messages per page
    const skip = (page - 1) * limit;

    // Query messages for the event with pagination
    const messages = await Message.find({ eventId })
      .populate("userId", "firstname lastname")
      .skip(skip)
      .limit(limit);

    // Get total count for pagination metadata
    const totalMessages = await Message.countDocuments({ eventId });

    // Calculate total pages
    const totalPages = Math.ceil(totalMessages / limit);

    res.status(200).json({
      messages,
      pagination: {
        currentPage: page,
        totalPages,
        totalMessages,
        limit,
      },
    });
  } catch (error) {
    console.error("Get messages error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const updateMessage = async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  try {
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    // Check if user is the message creator or an admin
    if (
      message.userId.toString() !== userId &&
      !req.user.roles.includes("admin")
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this message" });
    }

    message.content = content || message.content;
    message.updatedAt = Date.now();
    await message.save();

    res.status(200).json(message);
  } catch (error) {
    console.error("Update message error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteMessage = async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user.id;

  try {
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    // Check if user is the message creator or an admin
    if (
      message.userId.toString() !== userId &&
      !req.user.roles.includes("admin")
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this message" });
    }

    // Remove message from Event's messages array
    await Event.findByIdAndUpdate(message.eventId, {
      $pull: { messages: messageId },
    });

    // Delete the message
    await Message.findByIdAndDelete(messageId);

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Delete message error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createMessage,
  getEventMessages,
  updateMessage,
  deleteMessage,
};
