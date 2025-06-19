const mongoose = require("mongoose");
const { CONTRIBUTION_STATUSES } = require("../../../common/constant");

const contributionSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  paymentIntentId: { type: String, required: true },
  status: {
    type: String,
    enum: Object.values(CONTRIBUTION_STATUSES),
    default: CONTRIBUTION_STATUSES.PENDING,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Contribution", contributionSchema);
