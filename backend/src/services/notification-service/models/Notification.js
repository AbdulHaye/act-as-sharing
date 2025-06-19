const mongoose = require("mongoose");
const { EMAIL_TEMPLATES } = require("../../../common/constant");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  type: {
    type: String,
    enum: Object.values(EMAIL_TEMPLATES),
    required: true,
  },
  message: { type: String, required: true },
  isSent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
