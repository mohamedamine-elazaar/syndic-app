import { Maintenance } from '../models/Maintenance.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/errors.js';

export const listMaintenance = asyncHandler(async (req, res) => {
  const items = await Maintenance.find().populate('building', 'name address').sort({ createdAt: -1 });
  res.json({ items });
});

export const createMaintenance = asyncHandler(async (req, res) => {
  const { building, title, description, status } = req.body;
  const item = await Maintenance.create({
    building,
    title,
    description,
    status,
    createdBy: req.user.sub
  });
  res.status(201).json({ item });
});

export const getMaintenance = asyncHandler(async (req, res) => {
  const item = await Maintenance.findById(req.params.id).populate('building', 'name address');
  if (!item) throw new HttpError(404, 'Maintenance item not found');
  res.json({ item });
});

export const updateMaintenance = asyncHandler(async (req, res) => {
  const { building, title, description, status } = req.body;
  const item = await Maintenance.findByIdAndUpdate(
    req.params.id,
    { $set: { building, title, description, status } },
    { new: true, runValidators: true }
  );
  if (!item) throw new HttpError(404, 'Maintenance item not found');
  res.json({ item });
});

export const deleteMaintenance = asyncHandler(async (req, res) => {
  const item = await Maintenance.findByIdAndDelete(req.params.id);
  if (!item) throw new HttpError(404, 'Maintenance item not found');
  res.status(204).send();
});
