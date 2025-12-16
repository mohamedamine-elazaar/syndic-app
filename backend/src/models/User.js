import mongoose from 'mongoose';

const ROLES = ['admin', 'owner', 'staff'];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ROLES, default: 'owner' }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
