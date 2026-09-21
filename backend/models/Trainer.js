import mongoose from 'mongoose';

const trainerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    link: { type: String, required: true }, // trainer image URL
    specialization: { type: String, default: 'Fitness & Strength Coach' },
    experience: { type: String, default: '5+ Years' },
    rating: { type: Number, default: 4.9, min: 1, max: 5 },
    bio: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    instagram: { type: String, default: '' },
    certifications: [{ type: String }],
    clientLimit: { type: Number, default: 25 },
  },
  { timestamps: true }
);

export default mongoose.model('Trainer', trainerSchema);
