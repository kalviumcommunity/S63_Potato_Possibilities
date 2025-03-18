const mongoose = require("mongoose");

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  creator: { type: String, required: true },
});

const Dish = mongoose.model("Dish", dishSchema);
module.exports = Dish;
