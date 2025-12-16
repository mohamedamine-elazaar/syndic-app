import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middlewares/validate.js';
import { requireAuth } from '../middlewares/auth.js';
import { login, logout, me, register } from '../controllers/authController.js';

export const authRoutes = Router();

authRoutes.post(
  '/register',
  [
    body('name').isString().trim().isLength({ min: 2, max: 80 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 8, max: 128 })
  ],
  validate,
  register
);

authRoutes.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').isString().isLength({ min: 1 })],
  validate,
  login
);

authRoutes.post('/logout', logout);

authRoutes.get('/me', requireAuth, me);
