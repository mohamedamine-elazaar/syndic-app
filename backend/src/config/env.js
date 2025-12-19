import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Always try to load the backend/.env file (relative to this module),
// regardless of the process working directory.
const envFile = path.resolve(__dirname, '../../.env');
const loaded = dotenv.config({ path: envFile, override: true });

// Fallback: if backend/.env wasn't found/loaded, try default behavior (cwd/.env)
if (loaded.error) {
  dotenv.config({ override: true });
}

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 5000),
  mongoUri: required('MONGODB_URI'),
  jwtAccessSecret: required('JWT_ACCESS_SECRET'),
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
  cookieName: process.env.COOKIE_NAME ?? 'syndic_token',
  // Comma-separated list of allowed origins. In development, localhost:* is also allowed.
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173,http://localhost:5174,http://localhost:3000',
};
