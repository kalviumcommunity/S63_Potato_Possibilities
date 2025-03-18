const express = require("express");
const router = express.Router();
const Dish = require("../models/Dish");

// GET all dishes
router.get("/", async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
});

// POST a new dish
router.post("/", async (req, res) => {
  console.log("Received data:", req.body); // Log the incoming request body

  const { name, description, image, creator } = req.body;

  // Validate request data
  if (!name || !description || !image || !creator) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newDish = new Dish({ name, description, image, creator });
    const savedDish = await newDish.save();
    res.status(201).json(savedDish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT (update) a dish
router.put("/:id", async (req, res) => {
  const { name, description, image, creator } = req.body;
  
  // Validate request data
  if (!name || !description || !image || !creator) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const updatedDish = await Dish.findByIdAndUpdate(
      req.params.id,
      { name, description, image, creator },
      { new: true, runValidators: true }
    );
    
    if (!updatedDish) {
      return res.status(404).json({ message: "Dish not found" });
    }
    
    res.json(updatedDish);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
