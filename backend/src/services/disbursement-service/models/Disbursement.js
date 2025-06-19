const mongoose = require("mongoose");
const { DISBURSEMENT_STATUSES } = require("../../../common/constant");

const disbursementSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  recipientName: { type: String, required: true },
  recipientAccount: { type: String, required: true }, // Encrypted
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: Object.values(DISBURSEMENT_STATUSES),
    default: DISBURSEMENT_STATUSES.PENDING,
  },
  disbursedAt: { type: Date },
});

module.exports = mongoose.model("Disbursement", disbursementSchema);
