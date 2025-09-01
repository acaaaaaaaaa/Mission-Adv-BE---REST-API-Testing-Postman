const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        status: false,
        message: 'Access denied. No token provided.'
      });
    }
    
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: false,
        message: 'Access denied. Invalid token format.'
      });
    }
    
    const token = authHeader.substring(7);
    
    if (!token) {
      return res.status(401).json({
        status: false,
        message: 'Access denied. No token provided.'
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: false,
        message: 'Access denied. Token expired.'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: false,
        message: 'Access denied. Invalid token.'
      });
    }
    
    return res.status(500).json({
      status: false,
      message: 'Internal server error during token verification.'
    });
  }
};

module.exports = {
  verifyToken
};
