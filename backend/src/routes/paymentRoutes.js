import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middlewares/validate.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { createPayment, deletePayment, getPayment, listPayments } from '../controllers/paymentController.js';

export const paymentRoutes = Router();

paymentRoutes.use(requireAuth);

paymentRoutes.get('/', listPayments);

paymentRoutes.post(
  '/',
  requireRole('admin'),
  [
    body('apartment').isMongoId(),
    body('amount').isFloat({ min: 0 }),
    body('currency').optional().isString().trim().isLength({ min: 1, max: 5 }),
    body('date').optional().isISO8601(),
    body('description').optional().isString().trim().isLength({ max: 240 })
  ],
  validate,
  createPayment
);

paymentRoutes.get('/:id', [param('id').isMongoId()], validate, getPayment);

paymentRoutes.delete('/:id', requireRole('admin'), [param('id').isMongoId()], validate, deletePayment);
