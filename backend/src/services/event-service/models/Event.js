const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    guestCount: { type: Number, required: true },
    suggestedDonation: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["upcoming", "story_capture", "voting", "completed", "cancelled"],
      default: "upcoming",
    },
    guests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    invitedEmails: [{ type: String, lowercase: true, trim: true }],
    contributions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Contribution" },
    ],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    disbursement: { type: mongoose.Schema.Types.ObjectId, ref: "Disbursement" },
    imageUrl: { type: String },
    isPublic: { type: Boolean, default: false },
    uniqueUrl: { type: String, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
