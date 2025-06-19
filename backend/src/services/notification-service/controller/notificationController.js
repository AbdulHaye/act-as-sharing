const Notification = require("../models/Notification");
const User = require("../../user-service/models/User");
const Event = require("../../event-service/models/Event");
const { sendEmail } = require("../../../utils/mailer");

const createNotification = async (req, res) => {
  const { userId, eventId, type, message } = req.body;
  try {
    const notification = new Notification({ userId, eventId, type, message });
    await notification.save();
    const user = await User.findById(userId);
    const event = eventId ? await Event.findById(eventId) : null;
    let emailContent = "";
    switch (type) {
      case "invite":
        emailContent = `<p>Dear ${user.firstname},</p><p>${message}</p>`;
        break;
      case "reminder":
        emailContent = `<p>Dear ${user.firstname},</p><p>Reminder: ${event.title} on ${event.date}. ${message}</p>`;
        break;
      case "contribution":
        emailContent = `<p>Dear ${user.firstname},</p><p>${message}</p>`;
        break;
      case "disbursement":
        emailContent = `<p>Dear ${user.firstname},</p><p>${message}</p>`;
        break;
      default:
        throw new Error("Invalid notification type");
    }
    await sendEmail(
      user.email,
      `${type.charAt(0).toUpperCase() + type.slice(1)} Notification`,
      emailContent,
      {
        disableTracking: true,
      }
    );
    notification.isSent = true;
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    console.error("Create notification error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createNotification };
