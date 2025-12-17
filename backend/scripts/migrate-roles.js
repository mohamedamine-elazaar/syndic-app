import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { connectDb } from '../src/config/db.js';
import { User } from '../src/models/User.js';

dotenv.config();

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  // eslint-disable-next-line no-console
  console.error('Missing MONGODB_URI in environment (.env)');
  process.exit(1);
}

try {
  await connectDb(mongoUri);

  const result = await User.updateMany(
    { role: { $in: ['owner', 'staff'] } },
    { $set: { role: 'client' } }
  );

  // eslint-disable-next-line no-console
  console.log(
    `Role migration complete. matched=${result.matchedCount ?? result.n} modified=${result.modifiedCount ?? result.nModified}`
  );
} catch (err) {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect().catch(() => {});
}
