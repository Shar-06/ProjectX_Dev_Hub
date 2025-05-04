const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const emailTemplates = {
  welcome: (userName) => ({
    subject: 'Welcome to SportX!',
    html: `
      <main style="font-family: Arial, sans-serif; max-width: 600px;">
        <header>
          <h2>Welcome to SportX, ${userName}!</h2>
        </header>
        <section>
          <p>Thank you for joining us. We're excited to have you on board.</p>
          <p>Your role has been successfully assigned.</p>
          <p>If you have any questions, please don't hesitate to <a href="mailto:boxfor78@gmail.com">contact our support team</a>.</p>
        </section>
        <footer>
          <p>Best regards,<br>The SportX Team</p>
        </footer>
      </main>
    `,
    text: `Welcome to SportX, ${userName}!\n\nThank you for joining us. We're excited to have you on board.\nYour role has been successfully assigned.\n\nBest regards,\nThe SportX Team`,
  }),
};

async function sendWelcomeEmail(to, userName) {
  try {
    const template = emailTemplates.welcome(userName);

    const mailOptions = {
      from: `"SportX" <${process.env.EMAIL_USERNAME}>`,
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendWelcomeEmail,
};
