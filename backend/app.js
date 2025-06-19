const express = require("express");
const connectDB = require("./src/config/db");
const cors = require("cors");
const userRoutes = require("./src/services/user-service/routes/userRoutes");
const eventRoutes = require("./src/services/event-service/routes/eventRoutes");
const contributionRoutes = require("./src/services/contribution-service/routes/contributionRoutes");
const disbursementRoutes = require("./src/services/disbursement-service/routes/disbursementRoutes");
const messageRoutes = require("./src/services/message-service/routes/messageRoutes");
const notificationRoutes = require("./src/services/notification-service/routes/notificationRoutes");
const templateRoutes = require("./src/services/template-service/routes/templateRoutes");
const requestRoutes = require("./src/services/request-assistance-service/routes/requestRoutes");
const contactRoutes = require("./src/services/contact-service/routes/contactRoutes");
const storyRoutes = require("./src/services/story-service/routes/storyRoutes");
const webhookRoutes = require("./src/services/contribution-service/routes/webhookRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
// app.use(cors({ origin: process.env.FRONTEND_URL || "*htt:", credentials: true }));

const allowedOrigins = [
  "https://actsofsharing.co.za",
  "https://9768-2407-aa80-126-f2dc-25ab-19e-be94-f7dd.ngrok-free.app",
  "https://commonchange-frontend.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., same-origin or non-browser requests)
      if (!origin) return callback(null, true);
      // Check if the origin is allowed
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // Deny other origins
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // Allow credentials (cookies, etc.)
  })
);
// app.use(cors({ credentials: true }));

// Stripe Webhook (raw body parsing for signature verification)
app.use(
  "/api/webhook/stripe", // Specific route for Stripe webhook
  express.raw({ type: "*/*" }), // Use */* to capture all content types
  (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  },
  webhookRoutes
);
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded images

// Routes
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/contributions", contributionRoutes);
app.use("/api/disbursements", disbursementRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/request", requestRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/stories", storyRoutes);
// Default route to check if the backend is live
// app.get("/", async (req, res) => {
//   try {
//     const mongoose = require("mongoose");
//     const db = mongoose.connection;

//     if (!dbConnected || db.readyState !== 1) {
//       throw new Error("Database is not connected");
//     }

//     await db.db.admin().ping();

//     res.status(200).json({
//       message: "Backend is live and running! / Database is connected!",
//     });
//   } catch (error) {
//     console.error("Error in health check route:", error.message, error.stack);
//     res.status(500).json({
//       message: "Backend is live and running! / Database connection failed!",
//       error: error.message,
//     });
//   }
// });

module.exports = app;
