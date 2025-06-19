const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (amount, currency = "usd") => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects cents
      currency,
    });
    return paymentIntent;
  } catch (error) {
    console.error("Stripe error:", error.message);
    throw new Error("Payment intent creation failed");
  }
};

module.exports = { createPaymentIntent };
