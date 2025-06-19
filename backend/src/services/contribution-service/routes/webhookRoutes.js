const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Contribution = require("../models/Contribution");
const User = require("../../user-service/models/User");
const { sendEmail } = require("../../../utils/mailer");
const paymentConfirmationTemplate = require("../../email-templates/paymentConfirmationTemplate");
const paymentFailureTemplate = require("../../email-templates/paymentFailureTemplate");

router.post("/", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  // Log for debugging
  console.log("Headers:", req.headers);
  console.log("Raw body:", req.body.toString());

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // Must be raw body (Buffer)
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log(
      "Webhook event constructed successfully:",
      event.type,
      event.id
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "charge.updated") {
      const charge = event.data.object;
      console.log("Charge was updated!", charge.id);

      const contribution = await Contribution.findOne({
        paymentIntentId: charge.payment_intent,
      });
      if (contribution) {
        if (charge.status === "succeeded") {
          contribution.status = "success";
          await contribution.save();
          console.log(
            `Contribution status updated to success for paymentIntentId: ${charge.payment_intent}`
          );

          const user = await User.findById(contribution.userId);

          const chargeamount = charge.amount / 100; // Convert to dollars
          console.log("Charge amount in dollars:", chargeamount);
          if (user) {
            const emailHtml = paymentConfirmationTemplate({
              firstname: user.firstname,
              amount: chargeamount,
              transactionId: charge.id,
              date: new Date(charge.created * 1000), // Stripe gives timestamp in seconds
              appUrl: process.env.FRONTEND_URL,
            });
            await sendEmail(user.email, "Payment Confirmation", emailHtml, {
              disableTracking: true,
            });
          }
        } else if (charge.status === "failed") {
          contribution.status = "failed";
          await contribution.save();
          if (user) {
            const emailHtml = paymentFailureTemplate({
              firstname: user.firstname,
              amount: charge.amount / 100,
              transactionId: charge.id,
              date: new Date(charge.created * 1000),
              appUrl: process.env.FRONTEND_URL,
            });
            await sendEmail(user.email, "Payment Failed", emailHtml);
          }
        }
        if (charge.metadata) {
          contribution.metadata = charge.metadata;
          await contribution.save();
        }
      }
    } else {
      console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error("Error processing webhook event:", err.message);
    return res.status(500).send(`Processing Error: ${err.message}`);
  }

  res.status(200).json({ received: true }); // Always return 200 for successful receipt
});

module.exports = router;
