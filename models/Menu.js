const mongoose = require('mongoose');

// Define the menu schema with an image URL
const menuSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the dish
  price: { type: Number, required: true }, // Price of the dish
  description: { type: String }, // Description of the dish (optional)
  category: { type: String }, // Category (e.g., Appetizer, Main Course, Dessert)
  availability: { type: Boolean, default: true }, // If the dish is available
  imageUrl: { type: String }, // URL for the dish's image (optional)
});

// Create the Menu model
const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;