const mongoose = require("mongoose");

const eventStorySchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  nominator: { type: String, required: true },
  recipient: {
    name: { type: String, required: true },
    categoryOfNeed: { type: String, required: true },
    story: { type: String, required: true },
    fundsUsage: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("EventStory", eventStorySchema);