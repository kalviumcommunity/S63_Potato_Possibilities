const express = require("express");
const router = express.Router();
const Dish = require("../models/Dish");

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

module.exports = router;
