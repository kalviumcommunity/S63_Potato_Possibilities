const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware to verify JWT token
const authenticateJWT = (req, res, next) => {
  // Get token from cookies
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required. No token provided.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user info to request
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
};

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  // Get token from cookies
  const token = req.cookies.token;

  if (!token) {
    req.isAuthenticated = false;
    return next();
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user info to request
    req.user = decoded;
    req.isAuthenticated = true;
    
    next();
  } catch (error) {
    req.isAuthenticated = false;
    next();
  }
};

module.exports = { authenticateJWT, isAuthenticated, JWT_SECRET };