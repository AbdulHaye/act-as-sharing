function eventInvitationTemplate({ event, host, frontendUrl }) {
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Event Invitation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333333; background-color: #f7f7f7; line-height: 1.6;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <!-- Header -->
        <tr>
          <td style="background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">You're Invited!</h1>
          </td>
        </tr>
        
        <!-- Intro -->
        <tr>
          <td style="padding: 30px 30px 20px;">
            <p style="margin: 0 0 15px; font-size: 16px;">Dear Guest,</p>
            <p style="margin: 0 0 20px; font-size: 16px;">You've been invited by <strong>${host.firstname}</strong> to join a special event:</p>
            <h2 style="color: #6366F1; font-size: 22px; margin: 0 0 25px; text-align: center; padding: 15px; border: 1px solid #e5e7eb; border-radius: 6px; background-color: #f9fafb;">${event.title}</h2>
          </td>
        </tr>
        
        <!-- Event Details -->
        <tr>
          <td style="padding: 0 30px 20px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="padding-bottom: 25px;">
                  <h3 style="font-size: 18px; color: #6366F1; margin: 0 0 15px; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb;">Event Details</h3>
                  
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td width="100" style="padding: 8px 0; vertical-align: top;">
                        <p style="margin: 0; font-weight: bold; color: #4b5563;">Date:</p>
                      </td>
                      <td style="padding: 8px 0; vertical-align: top;">
                        <p style="margin: 0;">${formattedDate}</p>
                      </td>
                    </tr>
                    <tr>
                      <td width="100" style="padding: 8px 0; vertical-align: top;">
                        <p style="margin: 0; font-weight: bold; color: #4b5563;">Time:</p>
                      </td>
                      <td style="padding: 8px 0; vertical-align: top;">
                        <p style="margin: 0;">${event.time}</p>
                      </td>
                    </tr>
                    <tr>
                      <td width="100" style="padding: 8px 0; vertical-align: top;">
                        <p style="margin: 0; font-weight: bold; color: #4b5563;">Location:</p>
                      </td>
                      <td style="padding: 8px 0; vertical-align: top;">
                        <p style="margin: 0;">${event.location}</p>
                      </td>
                    </tr>
                    <tr>
                      <td width="100" style="padding: 8px 0; vertical-align: top;">
                        <p style="margin: 0; font-weight: bold; color: #4b5563;">Description:</p>
                      </td>
                      <td style="padding: 8px 0; vertical-align: top;">
                        <p style="margin: 0;">${event.description}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- About the Cause -->
        <tr>
          <td style="padding: 0 30px 20px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="background-color: #f9fafb; padding: 20px; border-radius: 6px;">
                  <h3 style="font-size: 18px; color: #6366F1; margin: 0 0 15px; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb;">About the Cause</h3>
                  
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td width="140" style="padding: 8px 0; vertical-align: top;">
                        <p style="margin: 0; font-weight: bold; color: #4b5563;">Recipient:</p>
                      </td>
                      <td style="padding: 8px 0; vertical-align: top;">
                        <p style="margin: 0;">${event.recipient.name}</p>
                      </td>
                    </tr>
                    <tr>
                      <td width="140" style="padding: 8px 0; vertical-align: top;">
                        <p style="margin: 0; font-weight: bold; color: #4b5563;">Category of Need:</p>
                      </td>
                      <td style="padding: 8px 0; vertical-align: top;">
                        <p style="margin: 0;">${event.recipient.categoryOfNeed}</p>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 15px 0 0; font-weight: bold; color: #4b5563;">Story:</p>
                  <p style="margin: 5px 0 0;">${event.recipient.story}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <!-- Support the Cause -->
        <tr>
          <td style="padding: 0 30px 30px;">
            <h3 style="font-size: 18px; color: #6366F1; margin: 0 0 15px; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb;">Support the Cause</h3>
            <p style="margin: 0 0 20px; font-size: 16px;">We suggest a contribution of <strong>$25 to $500</strong> to help support ${event.recipient.name}, but please give what you can to make this event a success.</p>
            
            <!-- CTA Button -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td align="center" style="padding: 25px 0;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td style="background-color: #6366F1; border-radius: 6px; text-align: center;">
                        <a href="${frontendUrl}/payment/${event._id}" target="_blank" style="display: inline-block; padding: 16px 30px; color: #ffffff; font-weight: bold; text-decoration: none; font-size: 16px;">RSVP & Contribute Now</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            
            <p style="margin: 0; font-size: 16px; text-align: center;">We look forward to seeing you there!</p>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">This invitation was sent by ${host.firstname} via Support Circle</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

module.exports = eventInvitationTemplate;
