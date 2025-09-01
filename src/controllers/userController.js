const userService = require('../services/userService');

class UserController {
  async register(req, res) {
    try {
      const userData = req.validatedBody;
      const newUser = await userService.createUser(userData);
      
      res.status(201).json({
        status: true,
        message: 'User registered successfully',
        data: newUser
      });
    } catch (error) {
      console.error('Error in register:', error);
      if (error.message.includes('Email already exists') || 
          error.message.includes('Username already exists')) {
        return res.status(400).json({
          status: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.validatedBody;
      const result = await userService.authenticateUser(email, password);
      
      res.status(200).json({
        status: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      console.error('Error in login:', error);
      if (error.message.includes('Invalid email or password')) {
        return res.status(401).json({
          status: false,
          message: 'Invalid email or password'
        });
      }
      
      res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async logout(req, res) {
    try {
      res.status(200).json({
        status: true,
        message: 'Logout successful',
        data: {
          message: 'Token invalidated. Please remove token from client storage.'
        }
      });
    } catch (error) {
      console.error('Error in logout:', error);
      res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async profile(req, res) {
    try {
      const user = req.user;
      res.status(200).json({
        status: true,
        message: 'Profile retrieved successfully',
        data: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Error in profile:', error);
      res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async verifyEmail(req, res) {
    try {
      const { token } = req.query;
      
      if (!token) {
        return res.status(400).json({
          status: false,
          message: 'Verification token is required'
        });
      }
      
      const result = await userService.verifyEmail(token);
      
      res.status(200).json({
        status: true,
        message: result.message,
        data: result.user
      });
    } catch (error) {
      console.error('Error in verifyEmail:', error);
      
      if (error.message.includes('Invalid verification token')) {
        return res.status(400).json({
          status: false,
          message: 'Invalid or expired verification token'
        });
      }
      
      res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  async resendVerification(req, res) {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({
          status: false,
          message: 'Email is required'
        });
      }
      
      const result = await userService.resendVerificationEmail(email);
      
      res.status(200).json({
        status: true,
        message: result.message
      });
    } catch (error) {
      console.error('Error in resendVerification:', error);
      
      if (error.message.includes('User not found')) {
        return res.status(404).json({
          status: false,
          message: 'User not found'
        });
      }
      
      if (error.message.includes('Email already verified')) {
        return res.status(400).json({
          status: false,
          message: 'Email is already verified'
        });
      }
      
      res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = new UserController();
