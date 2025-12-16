import { Payment } from '../models/Payment.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/errors.js';

export const listPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find()
    .populate({ path: 'apartment', select: 'number', populate: { path: 'building', select: 'name' } })
    .sort({ createdAt: -1 });
  res.json({ payments });
});

export const createPayment = asyncHandler(async (req, res) => {
  const { apartment, amount, currency, date, description } = req.body;
  const payment = await Payment.create({
    apartment,
    amount,
    currency,
    date,
    description,
    createdBy: req.user.sub
  });
  res.status(201).json({ payment });
});

export const getPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id).populate('apartment', 'number');
  if (!payment) throw new HttpError(404, 'Payment not found');
  res.json({ payment });
});

export const deletePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findByIdAndDelete(req.params.id);
  if (!payment) throw new HttpError(404, 'Payment not found');
  res.status(204).send();
});
