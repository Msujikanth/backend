const express = require('express');
const Menu = require('../models/Menu');  // Assuming Menu model is in models folder
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure multer to store images in a 'uploads' folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Destination folder for uploaded images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Use current timestamp + original extension
  }
});

// Multer upload configuration for handling single image upload
const upload = multer({ storage: storage });

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const menuItems = await Menu.find();
    res.json(menuItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create a new menu item (with optional image upload)
router.post('/', upload.single('image'), async (req, res) => {
  const { name, price, description, category, availability } = req.body;
  
  // Image URL is set if an image is uploaded
  const imageUrl = req.file ? req.file.path : '';

  try {
    const newMenuItem = new Menu({
      name,
      price,
      description,
      category,
      availability,
      imageUrl // Add the image URL to the new menu item
    });

    const menuItem = await newMenuItem.save();
    res.json(menuItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a menu item by ID (including image upload)
router.put('/:id', upload.single('image'), async (req, res) => {
  const { name, price, description, category, availability } = req.body;
  const imageUrl = req.file ? req.file.path : ''; // Update image if uploaded

  try {
    let menuItem = await Menu.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ msg: 'Menu item not found' });
    }

    // Update fields
    menuItem.name = name || menuItem.name;
    menuItem.price = price || menuItem.price;
    menuItem.description = description || menuItem.description;
    menuItem.category = category || menuItem.category;
    menuItem.availability = availability || menuItem.availability;
    
    // Update the image if a new image is uploaded
    if (imageUrl) {
      menuItem.imageUrl = imageUrl;
    }

    await menuItem.save();
    res.json(menuItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a menu item
router.delete('/:id', async (req, res) => {
  try {
    const menuId = req.params.id;

    // Use findByIdAndDelete to remove the item by its ID
    const deletedItem = await Menu.findByIdAndDelete(menuId);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Serve static files in the 'uploads' folder
router.use('/uploads', express.static('uploads'));

module.exports = router;
