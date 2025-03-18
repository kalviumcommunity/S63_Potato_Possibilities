const express = require("express");
const router = express.Router();
const Dish = require("../models/Dish");
const Joi = require("joi");

// Validation schema using Joi
const dishSchema = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().min(5).required(),
  image: Joi.string().uri().required(),
  creator: Joi.string().min(3).required(),
});

// GET all dishes
router.get("/", async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving dishes: " + error.message });
  }
});

// GET a single dish by ID
router.get("/:id", async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }
    res.json(dish);
  } catch (error) {
    res.status(500).json({ message: "Error finding dish: " + error.message });
  }
});

// POST a new dish
router.post("/create", async (req, res) => {
  console.log("Received data:", req.body); // Log the incoming request body

  // Validate request body using Joi
  const { error } = dishSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Validation error: " + error.details[0].message });
  }

  const { name, description, image, creator } = req.body;

  try {
    const newDish = new Dish({ name, description, image, creator });
    const savedDish = await newDish.save();
    res.status(201).json({ message: "Dish created successfully", dish: savedDish });
  } catch (error) {
    res.status(500).json({ message: "Error creating dish: " + error.message });
  }
});

// PUT (update) a dish
router.put("/:id", async (req, res) => {
  // Validate request body using Joi
  const { error } = dishSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Validation error: " + error.details[0].message });
  }

  const { name, description, image, creator } = req.body;

  try {
    const updatedDish = await Dish.findByIdAndUpdate(
      req.params.id,
      { name, description, image, creator },
      { new: true, runValidators: true }
    );

    if (!updatedDish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    res.json({ message: "Dish updated successfully", dish: updatedDish });
  } catch (error) {
    res.status(500).json({ message: "Error updating dish: " + error.message });
  }
});

// DELETE a dish
router.delete("/:id", async (req, res) => {
  try {
    const dish = await Dish.findByIdAndDelete(req.params.id);

    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    res.json({ message: "Dish deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting dish: " + error.message });
  }
});

module.exports = router;
