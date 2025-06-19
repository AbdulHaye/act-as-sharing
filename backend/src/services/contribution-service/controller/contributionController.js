const Contribution = require("../models/Contribution");
const Event = require("../../event-service/models/Event");
const User = require("../../user-service/models/User");
const { createPaymentIntent } = require("../../../utils/payment");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../../../utils/mailer");

const getContributionById = async (req, res) => {
  const { id } = req.params;
  try {
    console.log("Contribution ID:", id);
    const contribution = await Contribution.findById(id);
    if (!contribution)
      return res.status(404).json({ message: "Contribution not found" });
    res.status(200).json(contribution);
  } catch (error) {
    console.error("Get contribution error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const processDonation = async (req, res) => {
  const { eventId, firstname, lastname, email, mobile, amount } = req.body;

  if (!eventId || !firstname || !lastname || !email || !mobile || !amount) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: "Invalid event ID" });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      const hashedPassword = await bcrypt.hash("default" + mobile, 10); // Temporary password
      user = new User({
        firstname,
        lastname,
        email,
        mobile,
        password: hashedPassword,
        role: "guest",
      });
      await user.save();
      isNewUser = true;

      // await sendEmail(
      //   email,
      //   "Welcome to CommonChange",
      //   `<p>Welcome, ${firstname}! Your account has been created. Use your email and mobile number to log in.</p>`
      // );
    }

    // Convert amount from dollars to cents
    const amountInCents = amount;
    const paymentIntent = await createPaymentIntent(amountInCents);
    const contribution = new Contribution({
      eventId,
      userId: user._id,
      amount: amount, // Store the amount in cents
      paymentIntentId: paymentIntent.id,
      status: "pending",
    });
    await contribution.save();

    event.contributions.push(contribution._id);
    event.currentAmount += amountInCents; // Update event amount in cents
    await event.save();

    await User.findByIdAndUpdate(user._id, {
      $push: { contributions: contribution._id },
    });

    res.status(201).json({
      message: isNewUser
        ? "User created and donation processed"
        : "Donation processed",
      contribution,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Process donation error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllContributions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Extract pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Default to 10 contributions per page
    const skip = (page - 1) * limit;

    let contributions;
    let totalContributions;

    if (user.role === "admin") {
      // Admins get all contributions
      contributions = await Contribution.find()
        .populate("userId", "firstname lastname email")
        .populate("eventId", "title")
        .skip(skip)
        .limit(limit);

      // Get total count for pagination metadata
      totalContributions = await Contribution.countDocuments();
    } else if (user.role === "host") {
      // Hosts get contributions for their events only
      const events = await Event.find({ hostId: user._id });
      const eventIds = events.map((event) => event._id);
      contributions = await Contribution.find({ eventId: { $in: eventIds } })
        .populate("userId", "firstname lastname email")
        .populate("eventId", "title")
        .skip(skip)
        .limit(limit);

      // Get total count for pagination metadata
      totalContributions = await Contribution.countDocuments({
        eventId: { $in: eventIds },
      });
    } else {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Calculate total pages
    const totalPages = Math.ceil(totalContributions / limit);

    res.status(200).json({
      contributions,
      pagination: {
        currentPage: page,
        totalPages,
        totalContributions,
        limit,
      },
    });
  } catch (error) {
    console.error("Get all contributions error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getTotalFundsRaised = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    let totalFunds = 0;

    if (user.role === "admin") {
      // Admins get total of all succeeded contributions
      const contributions = await Contribution.find({ status: "success" });
      totalFunds = contributions.reduce(
        (sum, contribution) => sum + contribution.amount,
        0
      );
    } else if (user.role === "host") {
      // Hosts get total of succeeded contributions for their events
      const events = await Event.find({ hostId: user._id });
      const eventIds = events.map((event) => event._id);
      const contributions = await Contribution.find({
        eventId: { $in: eventIds },
        status: "success",
      });
      totalFunds = contributions.reduce(
        (sum, contribution) => sum + contribution.amount,
        0
      );
    } else {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.status(200).json({ totalFunds });
  } catch (error) {
    console.error("Get total funds raised error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const updateContribution = async (req, res) => {
  const { id } = req.params;
  const { amount, status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid contribution ID" });
  }

  try {
    const contribution = await Contribution.findById(id);
    if (!contribution) {
      return res.status(404).json({ message: "Contribution not found" });
    }

    // Update only provided fields
    if (amount !== undefined) {
      const event = await Event.findById(contribution.eventId);
      if (!event) {
        return res.status(404).json({ message: "Associated event not found" });
      }
      // Adjust event's currentAmount
      event.currentAmount = event.currentAmount - contribution.amount + amount;
      contribution.amount = amount;
      await event.save();
    }
    if (status !== undefined) {
      contribution.status = status;
    }

    await contribution.save();
    res.status(200).json({ message: "Contribution updated", contribution });
  } catch (error) {
    console.error("Update contribution error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteContribution = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid contribution ID" });
  }

  try {
    const contribution = await Contribution.findById(id);
    if (!contribution) {
      return res.status(404).json({ message: "Contribution not found" });
    }

    // Update related event
    const event = await Event.findById(contribution.eventId);
    if (event) {
      event.contributions = event.contributions.filter(
        (contribId) => contribId.toString() !== id
      );
      event.currentAmount -= contribution.amount;
      await event.save();
    }

    // Update related user
    await User.findByIdAndUpdate(contribution.userId, {
      $pull: { contributions: id },
    });

    await Contribution.deleteOne({ _id: id });
    res.status(200).json({ message: "Contribution deleted" });
  } catch (error) {
    console.error("Delete contribution error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getContributionById,
  getAllContributions,
  getTotalFundsRaised,
  processDonation,
  updateContribution,
  deleteContribution,
};
