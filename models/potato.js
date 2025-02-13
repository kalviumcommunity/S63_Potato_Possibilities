// models/potato.js
const mongoose = require('mongoose');

// Define the Potato Schema
const potatoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: { type: [String], required: true },
  instructions: { type: String, required: true },
  author: { type: String },
  category: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Potato', potatoSchema);
