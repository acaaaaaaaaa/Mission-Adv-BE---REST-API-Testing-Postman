-- Create users table with email verification support
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  verification_token VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample users (passwords will be hashed in real implementation)
-- INSERT INTO users (username, email, password) VALUES
-- ('john_doe', 'john@example.com', 'hashed_password_here'),
-- ('jane_smith', 'jane@example.com', 'hashed_password_here');

-- Check the table structure
DESCRIBE users;

-- View all users
SELECT * FROM users;
