const mongoose = require('mongoose');

// Define the order schema
const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true }, // Name of the customer
  items: [{
    name: { type: String, required: true }, // Name of the ordered dish
    quantity: { type: Number, required: true } // Quantity of each dish
  }],
  totalPrice: { type: Number, required: true }, // Total price of the order
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Preparing', 'Ready for Pickup', 'Completed'], 
    default: 'Pending' 
  }, // Order status
}, { timestamps: true }); // Enable createdAt and updatedAt timestamps automatically

// Create the Order model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
