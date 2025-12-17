import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/errors.js';

function signAccessToken(user) {
  return jwt.sign(
    { sub: String(user._id), role: user.role, email: user.email, name: user.name },
    env.jwtAccessSecret,
    { expiresIn: env.jwtAccessExpiresIn }
  );
}

function setAuthCookie(res, token) {
  const isProd = env.nodeEnv === 'production';

  res.cookie(env.cookieName, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  });
}

function clearAuthCookie(res) {
  const isProd = env.nodeEnv === 'production';
  res.clearCookie(env.cookieName, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax'
  });
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) throw new HttpError(409, 'Email already in use');

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    passwordHash,
    role: 'client'
  });

  const token = signAccessToken(user);
  setAuthCookie(res, token);

  res.status(201).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new HttpError(401, 'Invalid credentials');

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new HttpError(401, 'Invalid credentials');

  const token = signAccessToken(user);
  setAuthCookie(res, token);

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

export const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  res.status(204).send();
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.sub).select('name email role');
  if (!user) throw new HttpError(401, 'Unauthorized');

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('name email role createdAt');
  res.json({ users });
});
