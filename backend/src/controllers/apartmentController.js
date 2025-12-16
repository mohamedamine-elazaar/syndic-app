import { Apartment } from '../models/Apartment.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/errors.js';

export const listApartments = asyncHandler(async (req, res) => {
  const apartments = await Apartment.find()
    .populate('building', 'name address')
    .populate('owner', 'name email role')
    .sort({ createdAt: -1 });
  res.json({ apartments });
});

export const createApartment = asyncHandler(async (req, res) => {
  const { building, number, floor, owner } = req.body;
  const apartment = await Apartment.create({
    building,
    number,
    floor,
    owner: owner || undefined,
    createdBy: req.user.sub
  });
  res.status(201).json({ apartment });
});

export const getApartment = asyncHandler(async (req, res) => {
  const apartment = await Apartment.findById(req.params.id)
    .populate('building', 'name address')
    .populate('owner', 'name email role');
  if (!apartment) throw new HttpError(404, 'Apartment not found');
  res.json({ apartment });
});

export const updateApartment = asyncHandler(async (req, res) => {
  const { building, number, floor, owner } = req.body;
  const apartment = await Apartment.findByIdAndUpdate(
    req.params.id,
    { $set: { building, number, floor, owner: owner || undefined } },
    { new: true, runValidators: true }
  );
  if (!apartment) throw new HttpError(404, 'Apartment not found');
  res.json({ apartment });
});

export const deleteApartment = asyncHandler(async (req, res) => {
  const apartment = await Apartment.findByIdAndDelete(req.params.id);
  if (!apartment) throw new HttpError(404, 'Apartment not found');
  res.status(204).send();
});
