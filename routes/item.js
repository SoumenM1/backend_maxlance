// itemRoutes.js
const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middleware/authMiddleware')
// Create a new item
router.post('/items', authMiddleware,itemController.createItem);

// Get a single item
router.get('/items', authMiddleware,itemController.getItem);

// Update an item
router.put('/items/:itemId',authMiddleware, itemController.updateItem);

// Delete an item
router.delete('/items/:itemId', authMiddleware,itemController.deleteItem);

module.exports = router;
