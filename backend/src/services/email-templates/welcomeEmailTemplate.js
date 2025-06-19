function welcomeEmailTemplate({ user, frontendUrl, verificationToken }) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Acts of Sharing</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333; background-color: #f7f7f7; line-height: 1.6;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <!-- Header -->
        <tr>
          <td style="background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">Welcome to Acts of Sharing!</h1>
          </td>
        </tr>
        
        <!-- Intro -->
        <tr>
          <td style="padding: 30px 30px 20px;">
            <p style="margin: 0 0 15px; font-size: 16px;">Dear ${user.firstname},</p>
            <p style="margin: 0 0 20px; font-size: 16px;">We're thrilled to have you join the Acts of Sharing community! To get started, please verify your email address to activate your account.</p>
            <h2 style="color: #6366F1; font-size: 22px; margin: 0 0 25px; text-align: center; padding: 15px; border: 1px solid #e5e7eb; border-radius: 6px; background-color: #f9fafb;">Verify Your Email</h2>
          </td>
        </tr>
        
        <!-- Verification Details -->
        <tr>
          <td style="padding: 0 30px 20px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="padding-bottom: 25px;">
                  <h3 style="font-size: 18px; color: #6366F1; margin: 0 0 15px; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb;">Next Steps</h3>
                  <p style="margin: 0 0 15px; font-size: 16px;">Click the button below to verify your email address. This link will expire in 24 hours.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- CTA Button -->
        <tr>
          <td style="padding: 0 30px 30px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td align="center" style="padding: 25px 0;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td style="background-color: #6366F1; border-radius: 6px; text-align: center;">
                        <a href="${frontendUrl}/verify-email?token=${verificationToken}" target="_blank" style="display: inline-block; padding: 16px 30px; color: #ffffff; font-weight: bold; text-decoration: none; font-size: 16px;">Verify Email Now</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <p style="margin: 0; font-size: 16px; text-align: center;">We're excited to see you become part of our community!</p>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">This email was sent by Acts of Sharing</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

module.exports = welcomeEmailTemplate;
