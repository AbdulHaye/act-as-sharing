const Event = require("../models/Event");
const User = require("../../user-service/models/User");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const { sendEmail } = require("../../../utils/mailer");
const { v4: uuidv4 } = require("uuid");
const eventInvitationTemplate = require("../../email-templates/eventInvitationTemplate");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, filename);
  },
});
const upload = multer({ storage }).single("eventImage");

const createEvent = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      console.error("Multer error:", err.message);
      return res.status(400).json({ message: "File upload error" });
    }

    try {
      const {
        title,
        description,
        date,
        time,
        location,
        guestCount,
        suggestedDonation,
        isPublic,
      } = req.body;

      const hostId = req.user.id;

      let eventImageUrl = null;
      if (req.file) {
        eventImageUrl = `/uploads/${req.file.filename}`;
      }

      const eventId = new mongoose.Types.ObjectId();

      const event = new Event({
        _id: eventId,
        hostId,
        title,
        description,
        date,
        time,
        location,
        guestCount,
        suggestedDonation,
        imageUrl: eventImageUrl,
        isPublic: isPublic || false,
        uniqueUrl: `/events/${eventId}`,
      });

      await event.save();

      await User.findByIdAndUpdate(hostId, {
        $push: { hostedEvents: event._id },
      });

      res.status(201).json({
        message: "Event created successfully",
        event,
      });
    } catch (error) {
      console.error("Create event error:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  });
};

const updateEvent = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid event ID" });
  }

  upload(req, res, async function (err) {
    if (err) {
      console.error("Multer error:", err.message);
      return res.status(400).json({ message: "File upload error" });
    }

    try {
      const updates = {};

      if (req.body.title) updates.title = req.body.title;
      if (req.body.description) updates.description = req.body.description;
      if (req.body.date) updates.date = req.body.date;
      if (req.body.time) updates.time = req.body.time;
      if (req.body.location) updates.location = req.body.location;
      if (req.body.guestCount)
        updates.guestCount = parseInt(req.body.guestCount);
      if (req.body.suggestedDonation)
        updates.suggestedDonation = parseFloat(req.body.suggestedDonation);
      if (req.body.isPublic !== undefined)
        updates.isPublic = req.body.isPublic === "true";

      if (req.file) {
        updates.imageUrl = `/uploads/${req.file.filename}`;
      }

      const event = await Event.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.status(200).json(event);
    } catch (error) {
      console.error("Update event error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
};

const updateEventStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid event ID" });
  }

  try {
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.hostId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only the host can update status" });
    }

    if (!["upcoming", "story_capture", "voting", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    event.status = status;
    await event.save();

    res.status(200).json({ message: "Event status updated", event });
  } catch (error) {
    console.error("Update event status error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const events = await Event.find()
      .populate("hostId", "firstname lastname")
      .skip(skip)
      .limit(limit);

    const totalEvents = await Event.countDocuments();
    const totalPages = Math.ceil(totalEvents / limit);

    res.status(200).json({
      events,
      pagination: {
        currentPage: page,
        totalPages,
        totalEvents,
        limit,
      },
    });
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getEventById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid event ID" });
  }
  try {
    const event = await Event.findById(id)
      .populate("hostId", "firstname lastname")
      .populate("guests", "firstname lastname email");
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (error) {
    console.error("Get event by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllEventsPublic = async (req, res) => {
  try {
    const currentDate = new Date();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    const events = await Event.find({
      status: "upcoming",
      isPublic: true,
      date: { $gte: currentDate },
    })
      .populate("hostId", "firstname lastname")
      .select("title description date location imageUrl suggestedDonation")
      .skip(skip)
      .limit(limit);

    const totalEvents = await Event.countDocuments({
      status: "upcoming",
      isPublic: true,
      date: { $gte: currentDate },
    });

    const totalPages = Math.ceil(totalEvents / limit);

    res.status(200).json({
      events,
      pagination: {
        currentPage: page,
        totalPages,
        totalEvents,
        limit,
      },
    });
  } catch (error) {
    console.error("Get all public events error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserEvents = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentDate = new Date();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const events = await Event.find({
      $or: [{ hostId: userId }, { guests: userId }],
      date: { $gte: currentDate },
    })
      .populate("hostId", "firstname lastname")
      .populate("guests", "firstname lastname email")
      .skip(skip)
      .limit(limit);

    const totalEvents = await Event.countDocuments({
      $or: [{ hostId: userId }, { guests: userId }],
      date: { $gte: currentDate },
    });

    const totalPages = Math.ceil(totalEvents / limit);

    res.status(200).json({
      events,
      pagination: {
        currentPage: page,
        totalPages,
        totalEvents,
        limit,
      },
    });
  } catch (error) {
    console.error("Get user events error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteEvent = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid event ID" });
  }
  try {
    const event = await Event.findByIdAndDelete(id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    await User.findByIdAndUpdate(event.hostId, { $pull: { hostedEvents: id } });
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const inviteGuest = async (req, res) => {
  const { eventId, guestEmail } = req.body;

  if (!guestEmail || !guestEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(400).json({ message: "Valid guest email is required" });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.hostId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only the host can invite guests" });
    }

    const guest = await User.findOne({ email: guestEmail });
    if (guest && !event.guests.includes(guest._id)) {
      event.guests.push(guest._id);
    }

    // Add email to invitedEmails if not already present
    if (!event.invitedEmails.includes(guestEmail.toLowerCase())) {
      event.invitedEmails.push(guestEmail.toLowerCase());
      await event.save();

      // Send invitation email with voting link
      const votingUrl = `${process.env.FRONTEND_URL}/events/${eventId}/vote`;
      await sendEmail(
        guestEmail,
        "You're Invited to an Acts of Sharing Event!",
        `<p>Dear Guest,</p><p>You've been invited to ${event.title} on ${event.date}. RSVP at ${process.env.FRONTEND_URL}/events/${eventId}</p><p>Vote for a cause at: <a href="${votingUrl}">${votingUrl}</a></p>`
      );
    }

    res.status(200).json({ message: "Guest invited successfully" });
  } catch (error) {
    console.error("Invite guest error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getEventByUniqueUrl = async (req, res) => {
  const { url } = req.params;
  try {
    const event = await Event.findOne({ uniqueUrl: `${url}` })
      .populate("hostId", "firstname lastname")
      .populate("guests", "firstname lastname email");
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (!event.isPublic && !req.user) {
      return res.status(403).json({ message: "Authentication required for private event" });
    }
    if (!event.isPublic && req.user) {
      const userId = req.user.id;
      if (event.hostId.toString() !== userId && !event.guests.includes(userId)) {
        return res.status(403).json({ message: "Not authorized to view this private event" });
      }
    }
    res.status(200).json(event);
  } catch (error) {
    console.error("Get event by unique URL error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const inviteByEmail = async (req, res) => {
  const { from, to, eventId } = req.body;

  if (!from || !to || !eventId) {
    return res.status(400).json({ message: "Missing required fields: from, to, or eventId" });
  }

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: "Invalid event ID" });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    const host = await User.findOne({ email: from });
    if (!host) return res.status(404).json({ message: "Host not found" });

    const userId = req.user.id;
    if (event.hostId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to invite guests to this event" });
    }

    // Add email to invitedEmails if not already present
    if (!event.invitedEmails.includes(to.toLowerCase())) {
      event.invitedEmails.push(to.toLowerCase());
      await event.save();

      const emailHtml = eventInvitationTemplate({
        event,
        host,
        frontendUrl: process.env.FRONTEND_URL,
      });

      // Include voting link in the email
      const votingUrl = `${process.env.FRONTEND_URL}/events/${eventId}/vote`;
      const enhancedEmailHtml = emailHtml.replace(
        "</p>",
        `</p><p>Vote for a cause at: <a href="${votingUrl}">${votingUrl}</a></p>`
      );

      await sendEmail(to, `Invitation to ${event.title} - Acts of Sharing`, enhancedEmailHtml, {
        disableTracking: true,
      });
    }

    res.status(200).json({ message: "Invitation sent successfully" });
  } catch (error) {
    console.error("Invite by email error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
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
};