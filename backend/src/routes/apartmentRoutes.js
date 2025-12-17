import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middlewares/validate.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import {
  createApartment,
  deleteApartment,
  getApartment,
  listApartments,
  updateApartment
} from '../controllers/apartmentController.js';

export const apartmentRoutes = Router();

apartmentRoutes.use(requireAuth);

apartmentRoutes.get('/', listApartments);

apartmentRoutes.post(
  '/',
  requireRole('admin'),
  [
    body('building').isMongoId(),
    body('number').isString().trim().isLength({ min: 1, max: 30 }),
    body('floor').optional().isInt({ min: -10, max: 200 }),
    body('owner').optional().isMongoId()
  ],
  validate,
  createApartment
);

apartmentRoutes.get('/:id', [param('id').isMongoId()], validate, getApartment);

apartmentRoutes.put(
  '/:id',
  requireRole('admin'),
  [
    param('id').isMongoId(),
    body('building').optional().isMongoId(),
    body('number').optional().isString().trim().isLength({ min: 1, max: 30 }),
    body('floor').optional().isInt({ min: -10, max: 200 }),
    body('owner').optional().isMongoId()
  ],
  validate,
  updateApartment
);

apartmentRoutes.delete(
  '/:id',
  requireRole('admin'),
  [param('id').isMongoId()],
  validate,
  deleteApartment
);
