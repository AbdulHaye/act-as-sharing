const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");

    // Add indexes (ensure these models exist)
    if (mongoose.models.Event) {
      mongoose.model("Event").schema.index({ hostId: 1, date: 1, status: 1 });
    }
    if (mongoose.models.User) {
      mongoose.model("User").schema.index({ email: 1 });
    }
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    // Don't exit; let the app handle the error
    throw new Error(`MongoDB connection failed: ${error.message}`);
  }
};

module.exports = connectDB;
