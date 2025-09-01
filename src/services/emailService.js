const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendVerificationEmail(email, username, token) {
    try {
      const verificationUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/api/verify-email?token=${token}`;
      
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@movieapi.com',
        to: email,
                  subject: 'Verify Your Movie API Account',
        html: `
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; 
                          border-radius: 5px; font-weight: bold; display: inline-block;">
                  Verify Email Address
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-bottom: 0;">
                Or copy and paste this link into your browser:<br>
                <a href="${verificationUrl}" style="color: #007bff; word-break: break-all;">
                  ${verificationUrl}
                </a>
              </p>
            </div>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Verification email sent:', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error(`Failed to send verification email: ${error.message}`);
    }
  }

  async sendWelcomeEmail(email, username) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@movieapi.com',
        to: email,
        subject: 'Welcome to Movie API!'
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent:', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  }

  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('Email service connection verified');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error.message);
      return false;
    }
  }
}

module.exports = new EmailService();
