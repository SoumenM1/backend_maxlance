// user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Item = require('./item');

const User = sequelize.define('User', {
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profileImage: {
    type: DataTypes.STRING
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verificationToken: {
    type: DataTypes.STRING,
  }
});

// Define association
User.hasMany(Item, { as: 'items', foreignKey: 'userId' });
Item.belongsTo(User, { foreignKey: 'userId' });

module.exports = User;
