const emailService = require('../services/emailService');

exports.sendWelcomeEmail = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email and name are required',
      });
    }

    const result = await emailService.sendWelcomeEmail(email, name);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Email sent successfully',
        data: result,
      });
    } else {
      throw new Error(result.error);
    }

  } catch (error) {
    console.error('Error sending welcome email:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message,
    });
  }
};
