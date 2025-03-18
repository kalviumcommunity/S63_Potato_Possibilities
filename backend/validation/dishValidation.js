const Joi = require('joi');

const dishSchema = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().min(5).required(),
    price: Joi.number().positive().required(),
    ingredients: Joi.array().items(Joi.string()).required()
});

module.exports = dishSchema;
