const express = require('express');
const Order = require('../models/Order');  // Adjust path to Order model
const router = express.Router();

// Add a new order
router.post('/', async (req, res) => {
  const { customerName, items, totalPrice } = req.body;

  try {
    const newOrder = new Order({
      customerName,
      items,
      totalPrice,
    });

    const order = await newOrder.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all orders (for restaurant dashboard)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // Sort by most recent
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update order status
router.put('/:id', async (req, res) => {
  const { status } = req.body;

  try {
    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// DELETE /api/orders/:id - Delete an order by ID
router.delete('/:id', async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
  
      if (!order) {
        return res.status(404).json({ msg: 'Order not found' });
      }
  
      await Order.deleteOne({ _id: req.params.id }); // Updated from order.remove()
  
      res.json({ msg: 'Order deleted successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

module.exports = router;
