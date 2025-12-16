import mongoose from 'mongoose';
import { User } from './src/models/User.js';
import { env } from './src/config/env.js';

const TARGET_EMAIL = 'inwibakchinwi@gmail.com';
const NEW_ROLE = 'admin';

async function makeAdmin() {
  console.log('Connecting to DB...');
  await mongoose.connect(env.mongoUri);
  
  console.log(`Finding user ${TARGET_EMAIL}...`);
  const user = await User.findOne({ email: TARGET_EMAIL });
  
  if (!user) {
    console.log('User not found!');
    process.exit(1);
  }

  console.log(`Current role: ${user.role}`);
  user.role = NEW_ROLE;
  await user.save();
  
  console.log(`User ${user.name} is now an ${NEW_ROLE}.`);
  
  await mongoose.disconnect();
}

makeAdmin().catch(console.error);
