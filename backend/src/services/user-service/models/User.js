const mongoose = require("mongoose");
const { ROLES } = require("../../../common/constant");

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(ROLES), default: ROLES.GUEST },
  isVerified: { type: Boolean, default: false }, // Changed to false for email verification
  verificationToken: { type: String }, // Token for email verification
  hostedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
  contributions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Contribution" },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
