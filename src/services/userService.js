const { pool } = require('../configs/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const emailService = require('./emailService');

class UserService {
  async findUserByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = ?';
      const [rows] = await pool.execute(query, [email]);
      
      if (rows.length === 0) {
        return null;
      }
      
      return rows[0];
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  async findUserByUsername(username) {
    try {
      const query = 'SELECT * FROM users WHERE username = ?';
      const [rows] = await pool.execute(query, [username]);
      
      if (rows.length === 0) {
        return null;
      }
      
      return rows[0];
    } catch (error) {
      throw new Error(`Error finding user by username: ${error.message}`);
    }
  }

  async createUser(userData) {
    try {
      const { username, email, password } = userData;
      

      const existingUserByEmail = await this.findUserByEmail(email);
      if (existingUserByEmail) {
        throw new Error('Email already exists');
      }
      
      const existingUserByUsername = await this.findUserByUsername(username);
      if (existingUserByUsername) {
        throw new Error('Username already exists');
      }
      

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      

      const verificationToken = uuidv4();
      

      const query = `
        INSERT INTO users (username, email, password, verification_token, is_verified) 
        VALUES (?, ?, ?, ?, FALSE)
      `;
      
      const [result] = await pool.execute(query, [username, email, hashedPassword, verificationToken]);
      
      try {
        await emailService.sendVerificationEmail(email, username, verificationToken);
        console.log(`Verification email sent to ${email}`);
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError.message);
      }
      

      const newUser = {
        id: result.insertId,
        username,
        email,
        is_verified: false,
        created_at: new Date(),
        message: 'Registration successful! Please check your email to verify your account.'
      };
      
      return newUser;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async authenticateUser(email, password) {
    try {

      const user = await this.findUserByEmail(email);
      if (!user) {
        throw new Error('Invalid email or password');
      }
      

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }
      

      const payload = {
        id: user.id,
        username: user.username,
        email: user.email
      };
      
      const token = jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '24h'
      });
      
      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      };
    } catch (error) {
      throw new Error(`Error authenticating user: ${error.message}`);
    }
  }

  async verifyEmail(token) {
    try {

      const query = 'SELECT * FROM users WHERE verification_token = ?';
      const [rows] = await pool.execute(query, [token]);
      
      if (rows.length === 0) {
        throw new Error('Invalid verification token');
      }
      
      const user = rows[0];
      

      if (user.is_verified) {
        return {
          success: true,
          message: 'Email already verified',
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            is_verified: true
          }
        };
      }
      

      const updateQuery = `
        UPDATE users 
        SET is_verified = TRUE, verification_token = NULL 
        WHERE id = ?
      `;
      
      await pool.execute(updateQuery, [user.id]);
      

      try {
        await emailService.sendWelcomeEmail(user.email, user.username);
        console.log(`Welcome email sent to ${user.email}`);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError.message);
      }
      
      return {
        success: true,
        message: 'Email verified successfully! Welcome to Movie API.',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          is_verified: true
        }
      };
      
    } catch (error) {
      throw new Error(`Error verifying email: ${error.message}`);
    }
  }

  async resendVerificationEmail(email) {
    try {

      const user = await this.findUserByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }
      

      if (user.is_verified) {
        throw new Error('Email already verified');
      }
      

      const verificationToken = uuidv4();
      

      const updateQuery = 'UPDATE users SET verification_token = ? WHERE id = ?';
      await pool.execute(updateQuery, [verificationToken, user.id]);
      

      await emailService.sendVerificationEmail(user.email, user.username, verificationToken);
      
      return {
        success: true,
        message: 'Verification email sent! Please check your inbox.'
      };
      
    } catch (error) {
      throw new Error(`Error resending verification email: ${error.message}`);
    }
  }
}

module.exports = new UserService();
