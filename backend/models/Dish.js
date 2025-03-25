const { DataTypes } = require('sequelize');
const { sequelize } = require('../connectDB');
const User = require('./User');

const Dish = sequelize.define('Dish', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  creator: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Foreign key to User model
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'dishes',
  timestamps: true
});

// Define the association
Dish.belongsTo(User, { foreignKey: 'created_by', as: 'user' });
User.hasMany(Dish, { foreignKey: 'created_by', as: 'dishes' });

module.exports = Dish;