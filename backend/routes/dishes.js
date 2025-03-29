const express = require("express");
const router = express.Router();
const Dish = require("../models/Dish");
const User = require("../models/User");
const Joi = require("joi");
const { authenticateJWT } = require("../middleware/auth");

// Validation schema
const dishSchema = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().min(5).required(),
  image: Joi.string().required(),
  creator: Joi.string().required(),
  created_by: Joi.number().integer().allow(null)
});

// GET all dishes
router.get("/", async (req, res) => {
  try {
    const dishes = await Dish.findAll({
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'username'] }]
    });
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving dishes: " + error.message });
  }
});

// GET a single dish by ID
router.get("/:id", async (req, res) => {
  try {
    const dish = await Dish.findByPk(req.params.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'username'] }]
    });
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }
    res.json(dish);
  } catch (error) {
    res.status(500).json({ message: "Error finding dish: " + error.message });
  }
});

// GET dishes filtered by created_by query parameter
router.get("/by-user", async (req, res) => {
  const { created_by } = req.query;
  if (!created_by) {
    return res.status(400).json({ message: "Query parameter 'created_by' is required" });
  }
  try {
    const dishes = await Dish.findAll({
      where: { created_by },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'username'] }]
    });
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving dishes: " + error.message });
  }
});

// POST a new dish - Protected route
router.post("/create", authenticateJWT, async (req, res) => {
  console.log("Received data:", req.body); // Log the incoming request body

  // Validate request body using Joi
  const { error } = dishSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Validation error: " + error.details[0].message });
  }

  // Get data from request body, but override created_by with authenticated user's ID
  const { name, description, image, creator } = req.body;
  const created_by = req.user.id; // Use the authenticated user's ID

  try {
    const newDish = await Dish.create({ 
      name, 
      description, 
      image, 
      creator, 
      created_by 
    });
    
    // Fetch the dish with its associated user
    const savedDish = await Dish.findByPk(newDish.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'username'] }]
    });
    
    res.status(201).json({ message: "Dish created successfully", dish: savedDish });
  } catch (error) {
    res.status(500).json({ message: "Error creating dish: " + error.message });
  }
});

// PUT (update) a dish - Protected route
router.put("/:id", authenticateJWT, async (req, res) => {
  // Validate request body using Joi
  const { error } = dishSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Validation error: " + error.details[0].message });
  }

  const { name, description, image, creator } = req.body;

  try {
    const dish = await Dish.findByPk(req.params.id);
    
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    // Check if the authenticated user is the owner of the dish
    if (dish.created_by !== req.user.id) {
      return res.status(403).json({ message: "You can only update your own dishes" });
    }

    // Update the dish, but don't change the created_by field
    await dish.update({ 
      name, 
      description, 
      image, 
      creator,
      // Keep the original created_by value
      created_by: dish.created_by
    });
    
    // Fetch the updated dish with its associated user
    const updatedDish = await Dish.findByPk(req.params.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'username'] }]
    });

    res.json({ message: "Dish updated successfully", dish: updatedDish });
  } catch (error) {
    res.status(500).json({ message: "Error updating dish: " + error.message });
  }
});

// DELETE a dish - Protected route
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const dish = await Dish.findByPk(req.params.id);

    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    // Check if the authenticated user is the owner of the dish
    if (dish.created_by !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own dishes" });
    }

    await dish.destroy();
    res.json({ message: "Dish deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting dish: " + error.message });
  }
});

module.exports = router;