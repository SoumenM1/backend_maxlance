const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const emailService = require('../services/emailService.js');
const {generateRefreshToken} = require('../controllers/tokenController.js')
const authService = {
  async register(req, res) {
    try {
      const {name, email, password, imgUrl } = req.body;

      // Check if the user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      } 

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user
      const newUser = await User.create({ full_name:name,email, password: hashedPassword ,profileImage:imgUrl});

      // Send email verification link
      await emailService.sendVerificationEmail(email);

     return res.status(201).json({ message: 'User registered successfully. Please verify your email.' });
    } catch (error) {
    //   console.error('Error registering user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
  
      // Find the user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
       // Check if the user's email is verified
       if (!user.emailVerified) {
        return res.status(401).json({ error: 'Email not verified' });
    }

      // Check if the password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      // Generate access token
      const accessToken = jwt.sign({ id: user.id ,userName:user.name,email:user.email}, 'soumen maity key', { expiresIn: '1h' });
  
      // Generate refresh token (you can implement your own logic for refresh token)
      const refreshToken = generateRefreshToken(user.id);
  
      // Send both tokens to the client
     return res.json({ accessToken, refreshToken });
    } catch (error) {
    //   console.error('Error logging in user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },


  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      // Check if the user exists
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Generate password reset token and send reset link
      const resetToken = await emailService.generatePasswordResetToken(email);
     const isSend= await emailService.sendPasswordResetEmail(email, resetToken);
      if(!isSend){
        return res.json({message:"password reset not sent"})
      }
      return res.json({ message: 'Password reset link sent successfully',data:true });
    } catch (error) {
    //   console.error('Error initiating password reset:', error);
      return res.status(500).json({ error: 'Internal Server Error',data:false });
    }
  },

  async resetPassword(req, res) {
    try {
     const {email , token, newPassword }=req.body
    if(!email || !token || !newPassword) return res.status(400).json({msg:"missing params"})
      // Verify the password reset token
      const isTokenValid = await emailService.verifyPasswordResetToken(email, token);
      if (!isTokenValid) {
        return res.status(400).json({ error: 'Invalid or expired token' });
      }

      // Find the user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the password
      await user.update({ password: hashedPassword });

      return  res.json({ message: 'Password reset successfully',data:true });
    } catch (error) {
    //   console.error('Error resetting password:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async verifyEmail(req, res) {
    try {
     const token = req.params.token;
     const email = req.query.email;
    if(!email || !token){
            return res.status(400).json({msg:"missing params"})
     }
      // Verify the email verification token
      const isTokenValid = await emailService.verifyEmailVerificationToken(email, token);
      if (!isTokenValid) {
        res.redirect('https://soumenmernapp.netlify.app').status(200)
        return res.status(400).json({ error: 'Invalid or expired token' });
      }

      // Update email verification status in the database
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      await user.update({ emailVerified: true });
    res.redirect('https://soumenmernapp.netlify.app').status(200)
      return res.json({ message: 'Email verified successfully' });
    } catch (error) {
    //   console.error('Error verifying email:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  async userDetails(req,res){
    try {
        // Extract user ID from the decoded token
        const email = req.email;

        // Use the user ID to fetch user details from the database
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Extract user details like name and imageUrl
        const { full_name, profileImage } = user;

        // Send the user details in the response
        res.json({name: full_name, imgUrl:profileImage });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

  }
};

module.exports = authService;
