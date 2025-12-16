import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    apartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Apartment', required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'MAD', maxlength: 5 },
    date: { type: Date, default: Date.now },
    description: { type: String, trim: true, maxlength: 240 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export const Payment = mongoose.model('Payment', paymentSchema);
