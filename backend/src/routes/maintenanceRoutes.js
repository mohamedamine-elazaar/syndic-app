import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middlewares/validate.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import {
  createMaintenance,
  deleteMaintenance,
  getMaintenance,
  listMaintenance,
  updateMaintenance
} from '../controllers/maintenanceController.js';

export const maintenanceRoutes = Router();

maintenanceRoutes.use(requireAuth);

maintenanceRoutes.get('/', listMaintenance);

maintenanceRoutes.post(
  '/',
  requireRole('admin', 'staff'),
  [
    body('building').isMongoId(),
    body('title').isString().trim().isLength({ min: 2, max: 160 }),
    body('description').optional().isString().trim().isLength({ max: 2000 }),
    body('status').optional().isIn(['open', 'in_progress', 'done'])
  ],
  validate,
  createMaintenance
);

maintenanceRoutes.get('/:id', [param('id').isMongoId()], validate, getMaintenance);

maintenanceRoutes.put(
  '/:id',
  requireRole('admin', 'staff'),
  [
    param('id').isMongoId(),
    body('building').optional().isMongoId(),
    body('title').optional().isString().trim().isLength({ min: 2, max: 160 }),
    body('description').optional().isString().trim().isLength({ max: 2000 }),
    body('status').optional().isIn(['open', 'in_progress', 'done'])
  ],
  validate,
  updateMaintenance
);

maintenanceRoutes.delete(
  '/:id',
  requireRole('admin', 'staff'),
  [param('id').isMongoId()],
  validate,
  deleteMaintenance
);
