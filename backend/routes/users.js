const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Dish = require('../models/Dish');

// Login endpoint
router.post('/login', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Set username in cookie
    res.cookie('username', username, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ message: 'Error during login: ' + error.message });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  // Clear the username cookie
  res.clearCookie('username');
  res.json({ message: 'Logout successful' });
});

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users: ' + error.message });
  }
});

// GET a single user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
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

// POST a new user
router.post('/create', async (req, res) => {
  const { name, email, username } = req.body;

  // Basic validation
  if (!name || !email || !username) {
    return res.status(400).json({ message: 'Please provide name, email, and username' });
  }

  try {
    const newUser = await User.create({ name, email, username });
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user: ' + error.message });
  }
});

// PUT (update) a user
router.put('/:id', async (req, res) => {
  const { name, email, username } = req.body;

  // Basic validation
  if (!name && !email && !username) {
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
      username: username || user.username
    });

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user: ' + error.message });
  }
});

// DELETE a user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user: ' + error.message });
  }
});

module.exports = router;