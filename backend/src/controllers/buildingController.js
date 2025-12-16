import { Building } from '../models/Building.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/errors.js';

export const listBuildings = asyncHandler(async (req, res) => {
  const buildings = await Building.find().sort({ createdAt: -1 });
  res.json({ buildings });
});

export const createBuilding = asyncHandler(async (req, res) => {
  const { name, address } = req.body;
  const building = await Building.create({ name, address, createdBy: req.user.sub });
  res.status(201).json({ building });
});

export const getBuilding = asyncHandler(async (req, res) => {
  const building = await Building.findById(req.params.id);
  if (!building) throw new HttpError(404, 'Building not found');
  res.json({ building });
});

export const updateBuilding = asyncHandler(async (req, res) => {
  const { name, address } = req.body;
  const building = await Building.findByIdAndUpdate(
    req.params.id,
    { $set: { name, address } },
    { new: true, runValidators: true }
  );
  if (!building) throw new HttpError(404, 'Building not found');
  res.json({ building });
});

export const deleteBuilding = asyncHandler(async (req, res) => {
  const building = await Building.findByIdAndDelete(req.params.id);
  if (!building) throw new HttpError(404, 'Building not found');
  res.status(204).send();
});
