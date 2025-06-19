const Mailgun = require("mailgun.js");
const formData = require("form-data");
const dotenv = require("dotenv");

dotenv.config();

// Initialize Mailgun client
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
  url: process.env.MAILGUN_API_URL || "https://api.mailgun.net",
});

// Send email using Mailgun API
const sendEmail = async (to, subject, html, options = {}) => {
  try {
    console.log(`Email HTML content: ${html}`);
    const data = {
      from: `Common Change <postmaster@${process.env.MAILGUN_DOMAIN}>`,
      to,
      subject,
      html,
    };

    // Disable click tracking if specified in options
    if (options.disableTracking) {
      data["o:tracking-clicks"] = "no";
    }

    const result = await mg.messages.create(process.env.MAILGUN_DOMAIN, data);
    console.log(`Email sent to ${to}`, result);
    return { success: true, message: `Email sent to ${to}`, id: result.id };
  } catch (error) {
    console.error("Mailgun API sending error:", error.message);
    throw new Error("Failed to send email via API");
  }
};

module.exports = { sendEmail };
