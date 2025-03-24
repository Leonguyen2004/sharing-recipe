const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    recipeName: { type: String, required: true },
    cookingTime: { type: String, required: true },
    difficulty: { type: String, required: true },
    servings: { type: String, required: true },
    category: { type: [String], required: true },
    ingredients: { type: String, required: true },
    equipment: { type: String, required: true },
    nutrition: { type: String, required: true },
    image: { type: String },
    instruction: { type: String, required: true }
});