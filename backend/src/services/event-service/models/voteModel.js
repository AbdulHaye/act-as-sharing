const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  storyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EventStory",
    required: true,
  },
  voterEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  voteValue: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
});

// Ensure one vote per email per event
voteSchema.index({ eventId: 1, voterEmail: 1 }, { unique: true });

module.exports = mongoose.model("Vote", voteSchema);
