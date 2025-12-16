import mongoose from 'mongoose';

const apartmentSchema = new mongoose.Schema(
  {
    building: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
    number: { type: String, required: true, trim: true, maxlength: 30 },
    floor: { type: Number, default: 0 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

apartmentSchema.index({ building: 1, number: 1 }, { unique: true });

export const Apartment = mongoose.model('Apartment', apartmentSchema);
