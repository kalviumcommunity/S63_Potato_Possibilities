// controllers/potatoController.js
const Potato = require('../models/potato');

// Create a new dish
exports.createDish = async (req, res) => {
  try {
    const newDish = new Potato(req.body);
    await newDish.save();
    res.status(201).json(newDish);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all dishes
exports.getAllDishes = async (req, res) => {
  try {
    const dishes = await Potato.find();
    res.status(200).json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single dish by ID
exports.getDishById = async (req, res) => {
  try {
    const dish = await Potato.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    res.status(200).json(dish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a dish
exports.updateDish = async (req, res) => {
  try {
    const updatedDish = await Potato.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    res.status(200).json(updatedDish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a dish
exports.deleteDish = async (req, res) => {
  try {
    const deletedDish = await Potato.findByIdAndDelete(req.params.id);
    if (!deletedDish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    res.status(200).json({ message: 'Dish deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
