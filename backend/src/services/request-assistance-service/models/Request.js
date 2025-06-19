const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  personName: {
    type: String,
    required: true,
    trim: true,
  },
  relationship: {
    type: String,
    required: true,
    trim: true,
  },
  immediateNeed: {
    type: String,
    required: true,
    trim: true,
  },
  preferredDate: {
    type: Date,
    required: false,
  },
  additionalInfo: {
    type: String,
    required: false,
    trim: true,
  },
  donatedAmount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "completed"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Request", requestSchema);
