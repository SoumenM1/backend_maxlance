const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user');
const resetTokens = {};

const transporter = nodemailer.createTransport({
  // Configure your email service provider here
  service: 'Gmail',
  auth: {
    user: 'wishtofamily@gmail.com',
    pass: 'mewq qqnd mxtv jqew'
}
});

const emailService = {
  async sendVerificationEmail(email) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
         console.log('User not found');
      }

      const verificationToken = uuidv4();
      await user.update({ verificationToken });

      const mailOptions = {
        from: 'wishtofamily@gmail.com',
        to: email,
        subject: 'Email Verification',
        html: `<p>Please click <a href="https://backend-maxlance.onrender.com/verify-email/${verificationToken}/?email=${email}">here</a> to verify your email address.</p>`
      };
      

      await transporter.sendMail(mailOptions);
      return true;
    //   console.log('Verification email sent successfully');
    } catch (error) {
    //   console.error('Error sending verification email:', error);
    console.log('Error sending verification email');
      return false;
    }
  },

  async verifyEmailVerificationToken(email, token) {
    try {
      const user = await User.findOne({ where: { email, verificationToken: token } });
      if (!user) {
         console.log('Invalid verification token');
        
      }

      // Update user's email verification status
      await user.update({ emailVerified: true, verificationToken: null });

      console.log('Email verified successfully');
      return true;
    } catch (error) {
        console.log('Error verifying email');
        return false;
    //   console.error('Error verifying email:', error);
    }
  },
  generatePasswordResetToken(email) {
    try {
      // Generate a random token string
      const token = crypto.randomBytes(32).toString('hex');
        resetTokens[email] = token;
      // You might want to store this token in a database or cache for later verification
      // For simplicity, we'll just return the token here
      return token;
    } catch (error) {
      return false;
    }
   },
 async sendPasswordResetEmail(email, resetToken) {
   try {
     // Email content
     const mailOptions = {
        from: 'wishtofamily@gmail.com',
        to: email,
        subject: 'Password Reset Request',
        html: `<p>Please click <a href="https://backend-maxlance.onrender.com/reset-password/${resetToken}/?email=${email}">here</a> to reset your password.</p>`
      };
    
      // Send the email
      await transporter.sendMail(mailOptions);
      return true;
   } catch (error) {
    return false;
   }
   },

   verifyPasswordResetToken(email, token) {
    // Check if the provided email has a corresponding token stored locally
    if (resetTokens[email] && resetTokens[email] === token) {
      // Token is valid, remove it after verification
      delete resetTokens[email];
      return true;
    } else {
      // Token is not valid or expired
      return false;
    }
  }
}

module.exports = emailService;
