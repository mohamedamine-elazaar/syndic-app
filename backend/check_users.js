import mongoose from 'mongoose';
import { User } from './src/models/User.js';
import { env } from './src/config/env.js';

console.log('Starting check_users script...');
console.log('Mongo URI:', env.mongoUri);

async function checkUsers() {
  console.log('Connecting to DB...');
  await mongoose.connect(env.mongoUri);
  console.log('Connected. Finding users...');
  const users = await User.find({});
  console.log('Users found:', users);
  await mongoose.disconnect();
  console.log('Done.');
}

checkUsers().catch(err => {
  console.error('Error in checkUsers:', err);
});
