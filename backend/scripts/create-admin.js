import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import { connectDb } from '../src/config/db.js';
import { User } from '../src/models/User.js';

dotenv.config();

const emailArg = process.argv[2];
const passwordArg = process.argv[3];
const nameArg = process.argv[4];

const email = (emailArg ?? '').trim().toLowerCase();
const password = String(passwordArg ?? '').trim();
const name = (nameArg ?? 'Admin').trim();

if (!email || !password) {
  // eslint-disable-next-line no-console
  console.error('Usage: npm run create-admin -- <email> <password> [name]');
  process.exit(1);
}

if (password.length < 8) {
  // eslint-disable-next-line no-console
  console.error('Password must be at least 8 characters.');
  process.exit(1);
}

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  // eslint-disable-next-line no-console
  console.error('Missing MONGODB_URI in environment (.env)');
  process.exit(1);
}

try {
  await connectDb(mongoUri);

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.findOneAndUpdate(
    { email },
    {
      $set: {
        name,
        email,
        passwordHash,
        role: 'admin'
      }
    },
    { new: true, upsert: true }
  ).select('name email role');

  // eslint-disable-next-line no-console
  console.log(`Admin user ready: ${user.email} (role=${user.role})`);
} catch (err) {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect().catch(() => {});
}
