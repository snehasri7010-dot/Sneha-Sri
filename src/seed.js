require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const testUsers = [
  {
    username: 'admin_user',
    email: 'admin@drivehub.test',
    mobileNumber: 9876543210,
    password: 'password123',
    role: 'admin',
  },
  {
    username: 'owner_user',
    email: 'owner@drivehub.test',
    mobileNumber: 9876543211,
    password: 'password123',
    role: 'owner',
  },
  {
    username: 'renter_user',
    email: 'renter@drivehub.test',
    mobileNumber: 9876543212,
    password: 'password123',
    role: 'renter',
  },
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Clearing existing users...');
    await User.deleteMany({});
    console.log('Database cleared');

    console.log('Creating test users...');
    const createdUsers = await User.insertMany(testUsers);
    console.log(`Successfully created ${createdUsers.length} test users:`);
    createdUsers.forEach((user) => {
      console.log(`  - ${user.username} (${user.role}): ${user.email}`);
    });

    console.log('\nTest credentials:');
    testUsers.forEach((user) => {
      console.log(`  Username: ${user.username}, Password: ${user.password}`);
    });

    await mongoose.disconnect();
    console.log('\nDatabase connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
}

seedDatabase();
