// itemController.js
const Item = require('../models/item');

const itemController = {
  async createItem(req, res) {
    try {
      const { name, description } = req.body;
      const userId= req.userId;
      const newItem = await Item.create({ name, description, userId });
    //   console.log('Item created successfully:', newItem.toJSON());
      res.status(201).json({ newItem });
    } catch (error) {
    //   console.error('Error creating item:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async getItem(req, res) {
    try {
      const items = await Item.findAll({ where: { userId: req.userId } });
      if (!items) {
        return res.status(404).json({ error: 'Item not found' });
      }
    //   console.log('Item retrieved successfully:', item.toJSON());
      res.json({ items });
    } catch (error) {
    //   console.error('Error retrieving item:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async updateItem(req, res) {
    try {
      const itemId = req.itemId;
      const updatedData = req.body;
      const item = await Item.findByPk(itemId);
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      await item.update(updatedData);
    //   console.log('Item updated successfully:', item.toJSON());
      res.json({ item });
    } catch (error) {
    //   console.error('Error updating item:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async deleteItem(req, res) {
    try {
      const itemId = req.itemId;
      const item = await Item.findByPk(itemId);
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      await item.destroy();
    //   console.log('Item deleted successfully');
      res.json({ message: 'Item deleted successfully' });
    } catch (error) {
    //   console.error('Error deleting item:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

module.exports = itemController;
