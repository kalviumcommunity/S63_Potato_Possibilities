const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Dish = require('../models/Dish');
const jwt = require('jsonwebtoken');
const { authenticateJWT, isAuthenticated, JWT_SECRET } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');
const { sendVerificationEmail } = require('../services/emailService');

// Rate limiting for registration
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many registration attempts from this IP, please try again later.'
});

router.post('/verify-email', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token is required for verification.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user by ID
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update user's email verification status
    user.emailVerified = true; // Assuming you have an emailVerified field in your User model
    await user.save();

    res.json({ message: 'Email verified successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying email: ' + error.message });
  }
  const { name, email, username, password } = req.body;

  // Basic validation
  if (!name || !email || !username || !password) {
    return res.status(400).json({ message: 'Please provide name, email, username, and password' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ 
      where: { 
        [User.sequelize.Op.or]: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or username already exists' });
    }

    // Create new user
    const newUser = await User.create({ name, email, username, password });
    
    // Generate verification token (for simplicity, using user ID)
    const verificationToken = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict' // CSRF protection
    });

    // Return success without sending password
    const userWithoutPassword = { ...newUser.get() };
    delete userWithoutPassword.password;

    res.status(201).json({ 
      message: 'User registered successfully. Please verify your email.', 
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user: ' + error.message });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict' // CSRF protection
    });

    // Return user without password
    const userWithoutPassword = { ...user.get() };
    delete userWithoutPassword.password;

    res.json({ message: 'Login successful', user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Error during login: ' + error.message });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  // Clear the token cookie
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
});

// Get current user
router.get('/me', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user without password
    const userWithoutPassword = { ...user.get() };
    delete userWithoutPassword.password;

    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user: ' + error.message });
  }
});

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] } // Exclude password from results
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users: ' + error.message });
  }
});

// GET a single user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] } // Exclude password from results
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error finding user: ' + error.message });
  }
});

// GET all dishes created by a specific user
router.get('/:id/dishes', async (req, res) => {
  try {
    const dishes = await Dish.findAll({
      where: { created_by: req.params.id }
    });
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving dishes: ' + error.message });
  }
});

// PUT (update) a user
router.put('/:id', authenticateJWT, async (req, res) => {
  // Check if the authenticated user is updating their own profile
  if (req.user.id != req.params.id) {
    return res.status(403).json({ message: 'You can only update your own profile' });
  }

  const { name, email, username, password } = req.body;

  // Basic validation
  if (!name && !email && !username && !password) {
    return res.status(400).json({ message: 'Please provide at least one field to update' });
  }

  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update only the provided fields
    const updatedUser = await user.update({
      name: name || user.name,
      email: email || user.email,
      username: username || user.username,
      password: password || user.password
    });

    // Return user without password
    const userWithoutPassword = { ...updatedUser.get() };
    delete userWithoutPassword.password;

    res.json({ message: 'User updated successfully', user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user: ' + error.message });
  }
});

// DELETE a user
router.delete('/:id', authenticateJWT, async (req, res) => {
  // Check if the authenticated user is deleting their own profile
  if (req.user.id != req.params.id) {
    return res.status(403).json({ message: 'You can only delete your own profile' });
  }

  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();
    res.clearCookie('token'); // Clear the token cookie after deletion
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user: ' + error.message });
  }
});

module.exports = router;
