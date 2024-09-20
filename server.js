const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  
const Menu = require('./models/Menu');  
const Order = require('./models/Order');  
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/authMiddleware');
const menuRoute = require('./routes/menu'); // Adjust the path as necessary


const app = express();


// Middleware
app.use(express.json());  // Parse JSON bodies
app.use(cors());  // Use CORS middleware

// Menu routes
app.use('/menu', menuRoute);

// Use authentication routes
app.use('/api/auth', authRoutes);

// MongoDB connection
mongoose.connect('mongodb://localhost/restaurantApp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Simple route to test
app.get('/', (req, res) => {
  res.send('Backend is working!');
});

// Restaurant-only route to add a menu item
app.post('/menu/add', authMiddleware('restaurant'), async (req, res) => {
  const { name, price, description, category, availability } = req.body;
  try {
    const newItem = new Menu({ name, price, description, category, availability });
    await newItem.save();
    res.status(201).json({ message: 'Menu item added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add menu item' });
  }
});

// Routes for Menu and Order
app.post('/menu/add', async (req, res) => {
  const { name, price, description, category, availability } = req.body;
  try {
    const newItem = new Menu({ name, price, description, category, availability });
    await newItem.save();
    res.status(201).json({ message: 'Menu item added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add menu item' });
  }
});

app.get('/menu', async (req, res) => {
  try {
    const menu = await Menu.find(); 
    res.status(200).json(menu);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

app.post('/order', async (req, res) => {
  const { customerName, items, totalPrice } = req.body;
  try {
    const newOrder = new Order({ customerName, items, totalPrice });
    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to place order' });
  }
});

app.get('/order/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order status' });
  }
});

// Start the server
const PORT = 5000;  
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});