import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema(
  {
    building: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'done'],
      default: 'open'
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export const Maintenance = mongoose.model('Maintenance', maintenanceSchema);
