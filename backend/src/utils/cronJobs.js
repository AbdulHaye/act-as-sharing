const cron = require("node-cron");
const Event = require("../services/event-service/models/Event");
const User = require("../services/user-service/models/User");
const { sendEmail } = require("./mailer");

cron.schedule("0 * * * *", async () => {
  const now = new Date();
  try {
    await Event.updateMany(
      { date: { $lte: now }, status: "upcoming" },
      { status: "ongoing" }
    );
    await Event.updateMany(
      { date: { $lte: new Date(now - 3 * 60 * 60 * 1000) }, status: "ongoing" },
      { status: "completed" }
    );
    console.log("Event statuses updated");
  } catch (error) {
    console.error("Cron job error:", error.message);
  }
});

cron.schedule("0 0 * * *", async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  try {
    const events = await Event.find({
      date: {
        $gte: tomorrow,
        $lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000),
      },
      status: "upcoming",
    });

    for (const event of events) {
      for (const guestId of event.guests) {
        const guest = await User.findById(guestId);
        if (guest) {
          await sendEmail(
            guest.email,
            "Event Reminder",
            `
              <p>Dear ${guest.firstname},</p>
              <p>Reminder: <strong>${
                event.title
              }</strong> is tomorrow on ${event.date.toDateString()} at ${
              event.time
            }.</p>
              <p><strong>Location:</strong> ${event.location}</p>
              <p><strong>Description:</strong> ${event.description}</p>
              <p><strong>Cause:</strong> Supporting ${event.recipient.name} (${
              event.recipient.categoryOfNeed
            }) - ${event.recipient.story}</p>
              <p>We suggest a contribution of $25 to $100, but please give what you can to support ${
                event.recipient.name
              }.</p>
              <p>View details and contribute at: <a href="${
                process.env.FRONTEND_URL
              }${event.uniqueUrl}">View Event</a></p>
            `
          );
        }
      }
    }
    console.log("Reminders sent");
  } catch (error) {
    console.error("Reminder cron job error:", error.message);
  }
});
