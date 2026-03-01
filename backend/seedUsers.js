/**
 * Seed script to create sample users for testing.
 * Run with: node seedUsers.js
 * Make sure MONGODB_URI and JWT_SECRET are set in .env
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const users = [
  { username: 'John Doe', email: 'john@example.com', password: 'password123', role: 'user' },
  { username: 'Jane Doe', email: 'jane@example.com', password: 'password321', role: 'host' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/airbnb-clone');
    console.log('Connected to MongoDB');

    for (const u of users) {
      const existing = await User.findOne({ email: u.email });
      if (existing) {
        console.log(`User ${u.email} already exists, skipping`);
        continue;
      }
      const hashed = await bcrypt.hash(u.password, 10);
      await User.create({ ...u, password: hashed });
      console.log(`Created user: ${u.username} (${u.email})`);
    }

    console.log('Seed completed.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
