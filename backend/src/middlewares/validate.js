import { validationResult } from 'express-validator';
import { HttpError } from '../utils/errors.js';

export function validate(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return next(new HttpError(400, 'Validation failed', result.array()));
  }
  return next();
}
