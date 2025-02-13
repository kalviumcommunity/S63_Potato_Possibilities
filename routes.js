const express = require('express');
const router = express.Router();
const potatoController = require('../controllers/potatoController');

// Create a new potato-based dish
router.post('/potato', potatoController.createDish);

// Get all dishes
router.get('/potato', potatoController.getAllDishes);

// Get a single dish by ID
router.get('/potato/:id', potatoController.getDishById);

// Update a dish
router.put('/potato/:id', potatoController.updateDish);

// Delete a dish
router.delete('/potato/:id', potatoController.deleteDish);

module.exports = router;
