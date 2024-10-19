// import path from 'path';
// import { IEmailLocals, winstonLogger } from '@theshreyashguy/coffee-shared';
// import { Logger } from 'winston';
// import { config } from '@notifications/config';
// import nodemailer, { Transporter } from 'nodemailer';
// import Email from 'email-templates';
// import { google } from 'googleapis';

// // Initialize logger
// const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'mailTransportHelper', 'debug');

// // Google OAuth2 configuration
// const OAuth2 = google.auth.OAuth2;

// // Create OAuth2 client
// const oauth2Client = new OAuth2(
//   config.CLIENT_ID,           // Client ID from Google Cloud
//   config.CLIENT_SECRET,       // Client Secret from Google Cloud
//   'https://developers.google.com/oauthplayground' // Redirect URL
// );

// // Set OAuth2 refresh token
// oauth2Client.setCredentials({
//   refresh_token: config.REFRESH_TOKEN // Refresh token from Google OAuth2
// });

// // Define email template sending function
// async function emailTemplates(template: string, receiver: string, locals: IEmailLocals): Promise<void> {
//   try {
//     // Generate access token for Gmail
//     const accessToken = await oauth2Client.getAccessToken();
//     // Create nodemailer transporter using OAuth2 for Gmail
//     const smtpTransport: Transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com", 
//       port: 465,                // Secure port for SMTP
//       secure: true,             // Use SSL (true for port 465)
//       auth: {
//         type: 'OAuth2',
//         user: config.SENDER_EMAIL,          // Your Gmail address
//         clientId: config.CLIENT_ID,         // Google Cloud Client ID
//         clientSecret: config.CLIENT_SECRET, // Google Cloud Client Secret
//         refreshToken: config.REFRESH_TOKEN, // Refresh token
//         accessToken: accessToken.token      // Access token from OAuth2
//       }
//     });

//     // Create and configure email
//     const email: Email = new Email({
//       message: {
//         from: `Jobber App <${config.SENDER_EMAIL}>` // Set sender's name and email
//       },
//       send: true,
//       preview: false,
//       transport: smtpTransport, // Use OAuth2 transporter
//       views: {
//         options: {
//           extension: 'ejs' // Email template extension
//         }
//       },
//       juice: true,
//       juiceResources: {
//         preserveImportant: true,
//         webResources: {
//           relativeTo: path.join(__dirname, '../build') // Path to email resources
//         }
//       }
//     });

//     // Send email
//     await email.send({
//       template: path.join(__dirname, '..', 'src/emails', template), // Email template path
//       message: { to: receiver }, // Recipient's email
//       locals // Email data to be used in the template
//     });

//     log.info(`Email sent to ${receiver}`);
//   } catch (error: any) {
//     log.error(`Error sending email: ${error.message}`);
//   }
// }

// export { emailTemplates };


import path from 'path';

import { IEmailLocals, winstonLogger } from '@theshreyashguy/coffee-shared';
import { Logger } from 'winston';
import { config } from '@notifications/config';
import nodemailer, { Transporter } from 'nodemailer';
import Email from 'email-templates';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'mailTransportHelper', 'debug');

async function emailTemplates(template: string, receiver: string, locals: IEmailLocals): Promise<void> {
  try {
    const smtpTransport: Transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: "jadhaoshreyash31@gmail.com",
        pass: "krhockgdaxmunhhn"
      }
    });
    const email: Email = new Email({
      message: {
        from: `Jobber App <${config.SENDER_EMAIL}>`
      },
      send: true,
      preview: false,
      transport: smtpTransport,
      views: {
        options: {
          extension: 'ejs'
        }
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, '../build')
        }
      }
    });

    await email.send({
      template: path.join(__dirname, '..', 'src/emails', template),
      message: { to: receiver },
      locals
    });
  } catch (error) {
    log.error(error);
  }
}

export { emailTemplates };