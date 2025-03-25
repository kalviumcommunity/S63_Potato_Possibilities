require('dotenv').config();
const { sequelize } = require('./connectDB');
const User = require('./models/User');
const Dish = require('./models/Dish');

// Sample data
const users = [
  { name: 'John Doe', email: 'john@example.com', username: 'johndoe' },
  { name: 'Jane Smith', email: 'jane@example.com', username: 'janesmith' },
  { name: 'Bob Johnson', email: 'bob@example.com', username: 'bobjohnson' }
];

const dishes = [
  {
    name: 'Classic Mashed Potatoes',
    description: 'Creamy, buttery mashed potatoes with garlic and herbs.',
    image: 'https://example.com/mashed-potatoes.jpg',
    creator: 'John Doe'
  },
  {
    name: 'Crispy Potato Wedges',
    description: 'Seasoned potato wedges baked to perfection.',
    image: 'https://example.com/potato-wedges.jpg',
    creator: 'Jane Smith'
  },
  {
    name: 'Potato Gratin',
    description: 'Thinly sliced potatoes baked with cream and cheese.',
    image: 'https://example.com/potato-gratin.jpg',
    creator: 'Bob Johnson'
  },
  {
    name: 'Loaded Baked Potato',
    description: 'Baked potato topped with cheese, bacon, and sour cream.',
    image: 'https://example.com/loaded-potato.jpg',
    creator: 'John Doe'
  },
  {
    name: 'Sweet Potato Fries',
    description: 'Crispy sweet potato fries with a spicy dipping sauce.',
    image: 'https://example.com/sweet-potato-fries.jpg',
    creator: 'Jane Smith'
  }
];

// Seed the database
const seedDatabase = async () => {
  try {
    // Connect to the database
    await sequelize.authenticate();
    console.log('✅ Connected to the database');

    // Sync models (force: true will drop tables if they exist)
    await sequelize.sync({ force: true });
    console.log('✅ Database synchronized');

    // Create users
    const createdUsers = await Promise.all(
      users.map(user => User.create(user))
    );
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create dishes with user associations
    const createdDishes = await Promise.all(
      dishes.map((dish, index) => {
        // Assign each dish to a user (cycling through the users)
        const userId = createdUsers[index % createdUsers.length].id;
        return Dish.create({
          ...dish,
          created_by: userId
        });
      })
    );
    console.log(`✅ Created ${createdDishes.length} dishes`);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();