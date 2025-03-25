const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Create a new Sequelize instance with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: console.log
});

// Test the connection and sync models
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ SQLite Database connected successfully');
    
    // Sync all models
    // Note: In production, you might want to use migrations instead
    await sequelize.sync({ alter: true });
    console.log('✅ All models were synchronized successfully');
    
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1); // Exit with failure
  }
};

module.exports = { connectDB, sequelize };