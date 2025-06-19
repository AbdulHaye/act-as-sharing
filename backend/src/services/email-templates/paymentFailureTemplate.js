function paymentFailureTemplate({
  firstname,
  amount,
  appUrl,
  transactionId,
  date,
}) {
  appUrl = appUrl || process.env.FRONTEND_URL || "https://actsofsharing.co.za";
  transactionId =
    transactionId ||
    "TXN" + Math.random().toString(36).substring(2, 10).toUpperCase();
  date = date ? new Date(date) : new Date();

  const formattedAmount = Number(amount).toFixed(2);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Failed</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333; background-color: #f7f7f7; line-height: 1.6;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <tr>
          <td style="background: linear-gradient(135deg, #ef4444 0%, #f87171 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">Payment Failed</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 30px 30px 20px;">
            <p style="margin: 0 0 20px; font-size: 16px;">Hello, <strong>${firstname}</strong>,</p>
            <p style="margin: 0 0 20px; font-size: 16px;">Unfortunately, your payment of <strong>$${formattedAmount}</strong> could not be processed.</p>
            <p style="margin: 0 0 20px; font-size: 16px;">Transaction ID: <strong>${transactionId}</strong></p>
            <p style="margin: 0 0 20px; font-size: 16px;">Date: <strong>${formattedDate}</strong> at <strong>${formattedTime}</strong></p>
            <p style="margin: 0 0 20px; font-size: 16px;">Please try again or contact support if you need assistance.</p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">
              <a href="${appUrl}/help" style="color: #ef4444; text-decoration: underline;">Help Center</a> | 
              <a href="${appUrl}/contact" style="color: #ef4444; text-decoration: underline;">Contact Us</a>
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

module.exports = paymentFailureTemplate;
