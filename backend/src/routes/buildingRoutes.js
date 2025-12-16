import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middlewares/validate.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import {
  createBuilding,
  deleteBuilding,
  getBuilding,
  listBuildings,
  updateBuilding
} from '../controllers/buildingController.js';

export const buildingRoutes = Router();

buildingRoutes.use(requireAuth);

buildingRoutes.get('/', listBuildings);

buildingRoutes.post(
  '/',
  requireRole('admin'),
  [body('name').isString().trim().isLength({ min: 2, max: 120 }), body('address').isString().trim()],
  validate,
  createBuilding
);

buildingRoutes.get('/:id', [param('id').isMongoId()], validate, getBuilding);

buildingRoutes.put(
  '/:id',
  requireRole('admin'),
  [
    param('id').isMongoId(),
    body('name').optional().isString().trim().isLength({ min: 2, max: 120 }),
    body('address').optional().isString().trim()
  ],
  validate,
  updateBuilding
);

buildingRoutes.delete('/:id', requireRole('admin'), [param('id').isMongoId()], validate, deleteBuilding);
