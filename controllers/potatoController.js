const Dish = require('../models/Dish'); // Assuming a Mongoose model for MongoDB

exports.createDish = async (req, res) => {
    try {
        const dish = await Dish.create(req.body);
        res.status(201).json(dish);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllDishes = async (req, res) => {
    try {
        const dishes = await Dish.find();
        res.status(200).json(dishes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getDishById = async (req, res) => {
    try {
        const dish = await Dish.findById(req.params.id);
        if (!dish) return res.status(404).json({ message: "Dish not found" });
        res.status(200).json(dish);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateDish = async (req, res) => {
    try {
        const updatedDish = await Dish.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedDish);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteDish = async (req, res) => {
    try {
        await Dish.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Dish deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
