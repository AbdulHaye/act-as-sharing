function paymentConfirmationTemplate({
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
      <title>Payment Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333; background-color: #f7f7f7; line-height: 1.6;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <!-- Header -->
        <tr>
          <td style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">Payment Successful</h1>
          </td>
        </tr>
        
        <!-- Confirmation Message -->
        <tr>
          <td style="padding: 30px 30px 20px;">
            <p style="margin: 0 0 20px; font-size: 16px;">Thank you, <strong>${firstname}</strong>!</p>
            <p style="margin: 0 0 20px; font-size: 16px;">Your payment of <strong>$${formattedAmount}</strong> was successfully processed. This email serves as your receipt.</p>
          </td>
        </tr>
        
        <!-- Payment Details -->
        <tr>
          <td style="padding: 0 30px 30px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
                  <h3 style="font-size: 18px; color: #4F46E5; margin: 0 0 15px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb;">Payment Details</h3>
                  
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 15px;">
                    <tr>
                      <td width="150" style="padding: 8px 0; vertical-align: top;">
                        <p style="margin: 0; font-weight: bold; color: #4b5563;">Amount:</p>
                      </td>
                      <td style="padding: 8px 0; vertical-align: top;">
                        <p style="margin: 0;">$${formattedAmount}</p>
                      </td>
                    </tr>
                    <tr>
                      <td width="150" style="padding: 8px 0; vertical-align: top;">
                        <p style="margin: 0; font-weight: bold; color: #4b5563;">Date:</p>
                      </td>
                      <td style="padding: 8px 0; vertical-align: top;">
                        <p style="margin: 0;">${formattedDate}</p>
                      </td>
                    </tr>
                    <tr>
                      <td width="150" style="padding: 8px 0; vertical-align: top;">
                        <p style="margin: 0; font-weight: bold; color: #4b5563;">Time:</p>
                      </td>
                      <td style="padding: 8px 0; vertical-align: top;">
                        <p style="margin: 0;">${formattedTime}</p>
                      </td>
                    </tr>
                    <tr>
                      <td width="150" style="padding: 8px 0; vertical-align: top;">
                        <p style="margin: 0; font-weight: bold; color: #4b5563;">Transaction ID:</p>
                      </td>
                      <td style="padding: 8px 0; vertical-align: top;">
                        <p style="margin: 0;">${transactionId}</p>
                      </td>
                    </tr>
                    <tr>
                      <td width="150" style="padding: 8px 0; vertical-align: top;">
                        <p style="margin: 0; font-weight: bold; color: #4b5563;">Status:</p>
                      </td>
                      <td style="padding: 8px 0; vertical-align: top;">
                        <p style="margin: 0; color: #10B981; font-weight: bold;">Successful</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        
        <!-- Thank You Message -->
        <tr>
          <td style="padding: 0 30px 40px; text-align: center;">
            <p style="margin: 0; font-size: 16px;">Thank you for your contribution. Your support makes a difference!</p>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 10px; font-size: 14px; color: #6b7280;">© ${new Date().getFullYear()} Acts of Sharing. All rights reserved.</p>
            <p style="margin: 0; font-size: 14px; color: #6b7280;">
              <a href="${appUrl}/help" style="color: #6b7280; text-decoration: underline;">Help Center</a> | 
              <a href="${appUrl}/contact" style="color: #6b7280; text-decoration: underline;">Contact Us</a>
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

module.exports = paymentConfirmationTemplate;
