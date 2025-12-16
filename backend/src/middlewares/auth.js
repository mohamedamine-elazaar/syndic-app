import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { HttpError } from '../utils/errors.js';

export function requireAuth(req, res, next) {
  const token = req.cookies?.[env.cookieName];
  if (!token) return next(new HttpError(401, 'Unauthorized'));

  try {
    const payload = jwt.verify(token, env.jwtAccessSecret);
    req.user = payload; // { sub, role, email }
    return next();
  } catch {
    return next(new HttpError(401, 'Unauthorized'));
  }
}

export function requireRole(...roles) {
  return function roleMiddleware(req, res, next) {
    const role = req.user?.role;
    if (!role) return next(new HttpError(401, 'Unauthorized'));
    if (!roles.includes(role)) return next(new HttpError(403, 'Forbidden'));
    return next();
  };
}
