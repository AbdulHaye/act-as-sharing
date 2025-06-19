// models/story.js
const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  quote: { type: String, required: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  image: { type: String, required: false }, // URL or path to the image
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Story", storySchema);
